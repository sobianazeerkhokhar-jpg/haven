"""
Protected Studio Admin Blueprint (Strictly Restricted to Sobia - Owner Admin)
"""
import csv
import io
from functools import wraps
from flask import Blueprint, request, jsonify, Response, abort
from flask_login import login_required, current_user
from app.models import (
    Product,
    Category,
    Order,
    OrderStatusHistory,
    User,
    Coupon,
    Review,
    ContactMessage,
    InventoryMovement,
    AdminAuditLog,
)
from app.extensions import db

admin_bp = Blueprint("admin", __name__)

SOBIA_OWNER_EMAIL = "sobianazeerkhokhar@gmail.com"


def sobia_owner_required(f):
    """Strict owner guard: only Sobia's authenticated admin account can access Studio Admin."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if (
            not current_user.is_authenticated
            or current_user.role != "admin"
            or current_user.email.lower() != SOBIA_OWNER_EMAIL
        ):
            abort(403, description="Access Denied: Studio Admin belongs exclusively to Sobia.")
        return f(*args, **kwargs)
    return decorated_function


def log_admin_action(action: str, entity_type: str, entity_id: str, details: str = ""):
    log = AdminAuditLog(
        actor_id=current_user.id,
        actor_name="Sobia",
        actor_role=current_user.role,
        action=action,
        entity_type=entity_type,
        entity_id=str(entity_id),
        details=details,
        ip_address=request.remote_addr or "127.0.0.1",
    )
    db.session.add(log)


@admin_bp.route("/dashboard-metrics", methods=["GET"])
@login_required
@sobia_owner_required
def dashboard_metrics():
    total_orders = Order.query.count()
    valid_orders = Order.query.filter(Order.order_status != "Cancelled").all()
    total_revenue = sum(o.total_amount for o in valid_orders)
    avg_order_value = int(round(total_revenue / len(valid_orders))) if valid_orders else 0
    pending_orders = Order.query.filter(Order.order_status.in_(["Pending", "Processing"])).count()
    low_stock = Product.query.filter(Product.stock_quantity <= 10).count()
    total_customers = User.query.filter_by(role="customer").count()

    return jsonify({
        "owner": "Sobia",
        "is_sample_data": True,
        "total_orders": total_orders,
        "total_revenue_pkr": total_revenue,
        "average_order_value_pkr": avg_order_value,
        "pending_orders": pending_orders,
        "low_stock_products": low_stock,
        "total_customers": total_customers,
    }), 200


@admin_bp.route("/products", methods=["POST"])
@login_required
@sobia_owner_required
def create_product():
    data = request.get_json(silent=True) or {}
    product = Product(
        category_id=int(data["category_id"]),
        name=data["name"].strip(),
        slug=data["slug"].strip(),
        sku=data["sku"].strip(),
        short_description=data.get("short_description", ""),
        description=data.get("description", ""),
        price=int(data["price"]),
        discount_price=int(data["discount_price"]) if data.get("discount_price") else None,
        stock_quantity=int(data.get("stock_quantity", 0)),
        status=data.get("status", "published"),
        is_featured=bool(data.get("is_featured", False)),
        is_bestseller=bool(data.get("is_bestseller", False)),
    )
    db.session.add(product)
    db.session.flush()
    log_admin_action("Created Product", "Product", product.id, f"SKU: {product.sku}")
    db.session.commit()
    return jsonify({"message": "Product created by Sobia.", "product_id": product.id}), 201


@admin_bp.route("/orders/<int:order_id>/status", methods=["PATCH"])
@login_required
@sobia_owner_required
def update_order_status(order_id: int):
    data = request.get_json(silent=True) or {}
    order = db.session.get(Order, order_id)
    if not order:
        return jsonify({"error": "Order not found."}), 404

    new_status = data.get("order_status", order.order_status)
    payment_status = data.get("payment_status", order.payment_status)
    note = data.get("note", f"Status updated to {new_status} by Sobia")

    order.order_status = new_status
    order.payment_status = payment_status
    db.session.add(
        OrderStatusHistory(
            order_id=order.id,
            status=new_status,
            note=note,
            updated_by="Sobia",
        )
    )
    log_admin_action("Updated Order Status", "Order", order.order_number, f"status={new_status}")
    db.session.commit()
    return jsonify({"message": "Order status updated.", "order_status": order.order_status}), 200


@admin_bp.route("/reports/orders.csv", methods=["GET"])
@login_required
@sobia_owner_required
def export_orders_csv():
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["OrderNumber", "Customer", "City", "Subtotal", "Discount", "Shipping", "Total", "Status"])
    for o in Order.query.order_by(Order.created_at.desc()).all():
        writer.writerow([
            o.order_number,
            o.customer_name,
            o.city,
            o.subtotal,
            o.discount_amount,
            o.shipping_fee,
            o.total_amount,
            o.order_status,
        ])
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=handmade_haven_orders.csv"},
    )
