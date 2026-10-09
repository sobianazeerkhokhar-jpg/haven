"""
Shopping Cart & Wishlist Blueprint
Validates stock availability, variants, negative quantities, and coupon codes on the server.
"""
from flask import Blueprint, request, jsonify, session
from flask_login import current_user, login_required
from app.models import Cart, CartItem, Product, ProductVariant, WishlistItem
from app.services.pricing import calculate_cart_summary
from app.extensions import db

cart_bp = Blueprint("cart", __name__)


def get_or_create_cart() -> Cart:
    if current_user.is_authenticated:
        cart = Cart.query.filter_by(user_id=current_user.id).first()
        if not cart:
            cart = Cart(user_id=current_user.id)
            db.session.add(cart)
            db.session.commit()
        return cart

    token = session.get("cart_token")
    if not token:
        import uuid
        token = str(uuid.uuid4())
        session["cart_token"] = token

    cart = Cart.query.filter_by(session_token=token).first()
    if not cart:
        cart = Cart(session_token=token)
        db.session.add(cart)
        db.session.commit()
    return cart


@cart_bp.route("", methods=["GET"])
def view_cart():
    cart = get_or_create_cart()
    summary = calculate_cart_summary(cart)
    return jsonify({
        "cart_id": cart.id,
        "coupon_code": cart.coupon_code,
        "summary": summary,
        "items": [
            {
                "id": item.id,
                "product_id": item.product_id,
                "product_name": item.product.name if item.product else "Removed",
                "quantity": item.quantity,
                "is_custom_gift": item.is_custom_gift,
                "recipient_name": item.recipient_name,
            }
            for item in cart.items
        ],
    }), 200


@cart_bp.route("/add", methods=["POST"])
def add_item():
    data = request.get_json(silent=True) or {}
    product_id = data.get("product_id")
    quantity = int(data.get("quantity", 1))
    variant_id = data.get("variant_id")

    if quantity <= 0:
        return jsonify({"error": "Quantity must be positive."}), 400

    product = db.session.get(Product, product_id)
    if not product or product.status != "published":
        return jsonify({"error": "Product is not available."}), 404

    available_stock = product.stock_quantity
    if variant_id:
        variant = db.session.get(ProductVariant, variant_id)
        if not variant or variant.product_id != product.id:
            return jsonify({"error": "Invalid variant selected for this product."}), 400
        available_stock = min(available_stock, variant.stock_quantity)

    if quantity > available_stock:
        return jsonify({"error": f"Cannot exceed available stock ({available_stock})."}), 400

    cart = get_or_create_cart()
    is_custom = bool(data.get("is_custom_gift", False))

    item = CartItem(
        cart_id=cart.id,
        product_id=product.id,
        variant_id=variant_id,
        quantity=quantity,
        is_custom_gift=is_custom,
        recipient_name=data.get("recipient_name"),
        personal_message=data.get("personal_message"),
        gift_card_message=data.get("gift_card_message"),
        wrapping_style=data.get("wrapping_style"),
        wrapping_price=int(data.get("wrapping_price", 0)),
        target_budget=data.get("target_budget"),
        special_instructions=data.get("special_instructions"),
    )
    db.session.add(item)
    db.session.commit()

    return jsonify({"message": "Item added to cart.", "summary": calculate_cart_summary(cart)}), 201


@cart_bp.route("/coupon", methods=["POST"])
def apply_coupon():
    data = request.get_json(silent=True) or {}
    code = (data.get("code") or "").strip().upper()
    cart = get_or_create_cart()
    cart.coupon_code = code
    db.session.commit()

    summary = calculate_cart_summary(cart)
    if not summary["coupon_valid"]:
        cart.coupon_code = None
        db.session.commit()
        return jsonify({"error": summary["coupon_message"] or "Invalid coupon."}), 400

    return jsonify({"message": f"Coupon {code} applied.", "summary": summary}), 200
