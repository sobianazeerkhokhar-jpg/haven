"""
Server-Authoritative Pricing, Coupon Validation, and Shipping Calculation Service
Never trusts client-submitted unit prices or totals.
"""
from datetime import datetime, timezone
from flask import current_app
from app.models import Cart, Coupon, Product, ProductVariant
from app.extensions import db


def calculate_cart_summary(cart: Cart) -> dict:
    """
    Recalculates cart subtotal, coupon discount, delivery fee, and final total
    strictly from database records.
    """
    if not cart or not cart.items:
        return {
            "subtotal": 0,
            "discount_amount": 0,
            "shipping_fee": 0,
            "final_total": 0,
            "item_count": 0,
            "coupon_valid": False,
            "coupon_message": None,
        }

    subtotal = 0
    item_count = 0

    for item in cart.items:
        product = db.session.get(Product, item.product_id)
        if not product or product.status != "published":
            continue

        base_unit = product.effective_price
        variant_delta = 0
        if item.variant_id:
            variant = db.session.get(ProductVariant, item.variant_id)
            if variant and variant.product_id == product.id:
                variant_delta = variant.price_delta

        wrapping_fee = item.wrapping_price if item.is_custom_gift else 0
        unit_total = base_unit + variant_delta + wrapping_fee
        subtotal += unit_total * item.quantity
        item_count += item.quantity

    discount_amount = 0
    coupon_valid = False
    coupon_message = None

    if cart.coupon_code:
        coupon = Coupon.query.filter(
            db.func.upper(Coupon.code) == cart.coupon_code.strip().upper()
        ).first()
        now = datetime.now(timezone.utc).replace(tzinfo=None)

        if not coupon or not coupon.is_active:
            coupon_message = "Coupon is inactive or invalid."
        elif coupon.expiry_date < now:
            coupon_message = "Coupon has expired."
        elif coupon.used_count >= coupon.usage_limit:
            coupon_message = "Coupon usage limit reached."
        elif subtotal < coupon.min_order_value:
            coupon_message = f"Minimum order of PKR {coupon.min_order_value} required."
        else:
            coupon_valid = True
            if coupon.discount_type == "percentage":
                discount_amount = int(round((subtotal * coupon.discount_value) / 100.0))
                if coupon.max_discount_amount and discount_amount > coupon.max_discount_amount:
                    discount_amount = coupon.max_discount_amount
            else:
                discount_amount = coupon.discount_value

    net_after_discount = max(0, subtotal - discount_amount)
    free_threshold = current_app.config.get("FREE_SHIPPING_THRESHOLD", 4500)
    standard_fee = current_app.config.get("STANDARD_SHIPPING_FEE", 280)

    shipping_fee = 0 if (item_count == 0 or net_after_discount >= free_threshold) else standard_fee
    final_total = net_after_discount + shipping_fee

    return {
        "subtotal": subtotal,
        "discount_amount": discount_amount,
        "shipping_fee": shipping_fee,
        "final_total": final_total,
        "item_count": item_count,
        "coupon_valid": coupon_valid,
        "coupon_message": coupon_message,
    }
