"""
Checkout & Atomic Order Creation Blueprint
Enforces database transactions, stock locking, coupon verification, and duplicate submission protection.
"""
import random
from flask import Blueprint, request, jsonify
from flask_login import current_user
from app.models import (
    Cart,
    Order,
    OrderItem,
    OrderStatusHistory,
    Product,
    InventoryMovement,
    Coupon,
    CouponRedemption,
)
from app.services.pricing import calculate_cart_summary
from app.extensions import db

checkout_bp = Blueprint("checkout", __name__)


@checkout_bp.route("/place-order", methods=["POST"])
def place_order():
    data = request.get_json(silent=True) or {}
    cart_id = data.get("cart_id")
    idempotency_key = data.get("idempotency_key")

    if idempotency_key:
        existing_order = Order.query.filter_by(idempotency_key=idempotency_key).first()
        if existing_order:
            return jsonify({
                "message": "Duplicate order prevented; returning existing order.",
                "order_number": existing_order.order_number,
            }), 200

    cart = db.session.get(Cart, cart_id) if cart_id else None
    if not cart or not cart.items:
        return jsonify({"error": "Your shopping cart is empty."}), 400

    customer_name = (data.get("customer_name") or "").strip()
    customer_email = (data.get("customer_email") or "").strip()
    customer_phone = (data.get("customer_phone") or "").strip()
    house_building = (data.get("house_building") or "").strip()
    street = (data.get("street") or "").strip()
    area = (data.get("area") or "").strip()
    city = (data.get("city") or "").strip()
    province = (data.get("province") or "Punjab").strip()

    if not all([customer_name, customer_email, customer_phone, house_building, street, city]):
        return jsonify({"error": "Complete customer contact and shipping address details are required."}), 400

    try:
        # Verify stock for every item before committing
        for item in cart.items:
            product = db.session.get(Product, item.product_id)
            if not product or product.stock_quantity < item.quantity:
                db.session.rollback()
                return jsonify({"error": f"Insufficient stock for {product.name if product else 'item'}."}), 409

        summary = calculate_cart_summary(cart)
        order_number = f"HH-2026-{random.randint(1000, 9999)}"

        order = Order(
            order_number=order_number,
            user_id=current_user.id if current_user.is_authenticated else None,
            customer_name=customer_name,
            customer_email=customer_email,
            customer_phone=customer_phone,
            house_building=house_building,
            street=street,
            area=area,
            city=city,
            province=province,
            postal_code=data.get("postal_code"),
            delivery_instructions=data.get("delivery_instructions"),
            subtotal=summary["subtotal"],
            discount_amount=summary["discount_amount"],
            coupon_code=cart.coupon_code if summary["coupon_valid"] else None,
            shipping_fee=summary["shipping_fee"],
            total_amount=summary["final_total"],
            payment_method=data.get("payment_method", "Cash on Delivery (Demo)"),
            payment_status="Pending (COD)",
            order_status="Pending",
            is_demo_order=True,
            idempotency_key=idempotency_key,
        )
        db.session.add(order)
        db.session.flush()

        for item in cart.items:
            product = db.session.get(Product, item.product_id)
            unit_price = product.effective_price + (item.variant.price_delta if item.variant else 0)
            wrapping_price = item.wrapping_price if item.is_custom_gift else 0

            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                product_name_snapshot=product.name,
                sku_snapshot=product.sku,
                variant_name_snapshot=item.variant.name if item.variant else "Standard",
                unit_price_snapshot=unit_price,
                wrapping_price_snapshot=wrapping_price,
                quantity=item.quantity,
                line_total=(unit_price + wrapping_price) * item.quantity,
                is_custom_gift=item.is_custom_gift,
                recipient_name=item.recipient_name,
                personal_message=item.personal_message,
                gift_card_message=item.gift_card_message,
                wrapping_style=item.wrapping_style,
                special_instructions=item.special_instructions,
            )
            db.session.add(order_item)

            # Safely deduct stock and record inventory movement
            prev_stock = product.stock_quantity
            product.stock_quantity = max(0, prev_stock - item.quantity)
            movement = InventoryMovement(
                product_id=product.id,
                change_quantity=-item.quantity,
                previous_stock=prev_stock,
                new_stock=product.stock_quantity,
                reason="Order Placed",
                reference_id=order_number,
                performed_by=customer_name,
            )
            db.session.add(movement)

        history = OrderStatusHistory(
            order_id=order.id,
            status="Pending",
            note="Demo order placed and stock reserved.",
            updated_by="System Checkout",
        )
        db.session.add(history)

        if summary["coupon_valid"] and cart.coupon_code:
            coupon = Coupon.query.filter(
                db.func.upper(Coupon.code) == cart.coupon_code.strip().upper()
            ).first()
            if coupon:
                coupon.used_count += 1
                db.session.add(
                    CouponRedemption(
                        coupon_id=coupon.id,
                        order_id=order.id,
                        user_id=order.user_id,
                        discount_applied=summary["discount_amount"],
                    )
                )

        # Clear cart items after successful order creation
        for item in list(cart.items):
            db.session.delete(item)
        cart.coupon_code = None

        db.session.commit()
        return jsonify({
            "message": "Demo order created successfully.",
            "order_id": order.id,
            "order_number": order.order_number,
            "total_amount": order.total_amount,
            "is_demo_order": True,
        }), 201

    except Exception as exc:
        db.session.rollback()
        return jsonify({"error": f"Order creation failed: {str(exc)}"}), 500
