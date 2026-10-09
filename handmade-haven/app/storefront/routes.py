"""
Storefront, Catalog, Categories, and Customer Account Blueprint
"""
from flask import Blueprint, request, jsonify, abort
from flask_login import login_required, current_user
from app.models import Product, Category, Order, Address, Review, ContactMessage, NewsletterSubscriber
from app.extensions import db

storefront_bp = Blueprint("storefront", __name__)


@storefront_bp.route("/products", methods=["GET"])
def list_products():
    """Supports search, category slug filter, price range filter, stock filter, sorting, and pagination."""
    query = Product.query.filter_by(status="published")

    category_slug = request.args.get("category")
    if category_slug and category_slug != "all":
        cat = Category.query.filter_by(slug=category_slug, is_active=True).first()
        if cat:
            query = query.filter_by(category_id=cat.id)

    search_q = (request.args.get("q") or "").strip()
    if search_q:
        like_pattern = f"%{search_q}%"
        query = query.filter(
            db.or_(
                Product.name.ilike(like_pattern),
                Product.description.ilike(like_pattern),
                Product.materials.ilike(like_pattern),
            )
        )

    max_price = request.args.get("max_price", type=int)
    if max_price:
        query = query.filter(Product.price <= max_price)

    in_stock = request.args.get("in_stock")
    if in_stock == "true":
        query = query.filter(Product.stock_quantity > 0)

    sort_by = request.args.get("sort", "newest")
    if sort_by == "price-asc":
        query = query.order_by(Product.price.asc())
    elif sort_by == "price-desc":
        query = query.order_by(Product.price.desc())
    else:
        query = query.order_by(Product.created_at.desc())

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 12, type=int)
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page,
        "products": [
            {
                "id": p.id,
                "name": p.name,
                "slug": p.slug,
                "sku": p.sku,
                "price": p.price,
                "discount_price": p.discount_price,
                "effective_price": p.effective_price,
                "stock_quantity": p.stock_quantity,
                "category": p.category.name if p.category else None,
            }
            for p in pagination.items
        ],
    }), 200


@storefront_bp.route("/account/orders", methods=["GET"])
@login_required
def my_orders():
    """Enforces strict customer data isolation: users can only view their own orders."""
    orders = Order.query.filter_by(user_id=current_user.id).order_by(Order.created_at.desc()).all()
    return jsonify({
        "orders": [
            {
                "id": o.id,
                "order_number": o.order_number,
                "total_amount": o.total_amount,
                "order_status": o.order_status,
                "payment_status": o.payment_status,
                "is_demo_order": o.is_demo_order,
                "created_at": o.created_at.isoformat(),
            }
            for o in orders
        ]
    }), 200


@storefront_bp.route("/account/orders/<int:order_id>", methods=["GET"])
@login_required
def my_order_detail(order_id: int):
    """Prevents horizontal privilege escalation (IDOR) across customer accounts."""
    order = db.session.get(Order, order_id)
    if not order or order.user_id != current_user.id:
        abort(403, description="You do not have permission to view this order.")
    return jsonify({
        "order_number": order.order_number,
        "customer_name": order.customer_name,
        "total_amount": order.total_amount,
        "order_status": order.order_status,
        "items": [
            {
                "product_name": item.product_name_snapshot,
                "quantity": item.quantity,
                "unit_price": item.unit_price_snapshot,
                "line_total": item.line_total,
                "is_custom_gift": item.is_custom_gift,
                "recipient_name": item.recipient_name,
            }
            for item in order.items
        ],
    }), 200
