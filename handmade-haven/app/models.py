"""
Handmade Haven - Complete SQLAlchemy Database Models (21 Relational Models)
Uses integer-based monetary fields (PKR) to guarantee decimal-safe calculations.
Compatible with both SQLite (local development) and PostgreSQL (production).
"""
from datetime import datetime, timezone
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db, login_manager


def utc_now():
    return datetime.now(timezone.utc)


@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))


# 1. USERS
class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(40), nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(30), nullable=False, default="customer", index=True)  # customer, admin, manager, editor
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now, nullable=False)

    addresses = db.relationship("Address", backref="user", lazy="dynamic", cascade="all, delete-orphan")
    orders = db.relationship("Order", backref="customer", lazy="dynamic")
    reviews = db.relationship("Review", backref="author", lazy="dynamic")
    wishlist_items = db.relationship("WishlistItem", backref="user", lazy="dynamic", cascade="all, delete-orphan")

    def set_password(self, raw_password: str) -> None:
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password_hash(self.password_hash, raw_password)

    @property
    def is_staff(self) -> bool:
        return self.role in {"admin", "manager", "editor"}


# 2. ADDRESSES
class Address(db.Model):
    __tablename__ = "addresses"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    label = db.Column(db.String(60), default="Home", nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(40), nullable=False)
    house_building = db.Column(db.String(160), nullable=False)
    street = db.Column(db.String(160), nullable=False)
    area = db.Column(db.String(160), nullable=False)
    city = db.Column(db.String(80), nullable=False, index=True)
    province = db.Column(db.String(80), nullable=False)
    postal_code = db.Column(db.String(20), nullable=True)
    delivery_instructions = db.Column(db.Text, nullable=True)
    is_default = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now, nullable=False)


# 3. CATEGORIES
class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    slug = db.Column(db.String(120), nullable=False, unique=True, index=True)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    display_order = db.Column(db.Integer, default=1, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=utc_now, nullable=False)

    products = db.relationship("Product", backref="category", lazy="dynamic")


# 4. PRODUCTS
class Product(db.Model):
    __tablename__ = "products"
    __table_args__ = (
        db.CheckConstraint("price > 0", name="check_positive_price"),
        db.CheckConstraint("stock_quantity >= 0", name="check_non_negative_stock"),
    )

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False, index=True)
    name = db.Column(db.String(160), nullable=False)
    slug = db.Column(db.String(180), nullable=False, unique=True, index=True)
    sku = db.Column(db.String(60), nullable=False, unique=True, index=True)
    short_description = db.Column(db.String(300), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Integer, nullable=False)  # Integer PKR
    discount_price = db.Column(db.Integer, nullable=True)
    materials = db.Column(db.String(300), nullable=True)
    dimensions = db.Column(db.String(200), nullable=True)
    care_instructions = db.Column(db.String(300), nullable=True)
    stock_quantity = db.Column(db.Integer, default=0, nullable=False)
    status = db.Column(db.String(20), default="published", nullable=False, index=True)  # published, draft, archived
    is_featured = db.Column(db.Boolean, default=False, nullable=False)
    is_bestseller = db.Column(db.Boolean, default=False, nullable=False)
    is_new_arrival = db.Column(db.Boolean, default=False, nullable=False)
    allow_customization = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now, nullable=False)

    images = db.relationship("ProductImage", backref="product", lazy="joined", cascade="all, delete-orphan")
    variants = db.relationship("ProductVariant", backref="product", lazy="joined", cascade="all, delete-orphan")
    reviews = db.relationship("Review", backref="product", lazy="dynamic", cascade="all, delete-orphan")

    @property
    def effective_price(self) -> int:
        if self.discount_price and 0 < self.discount_price < self.price:
            return self.discount_price
        return self.price


# 5. PRODUCT IMAGES
class ProductImage(db.Model):
    __tablename__ = "product_images"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    image_url = db.Column(db.String(500), nullable=False)
    alt_text = db.Column(db.String(200), nullable=True)
    sort_order = db.Column(db.Integer, default=0, nullable=False)


# 6. PRODUCT VARIANTS
class ProductVariant(db.Model):
    __tablename__ = "product_variants"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    name = db.Column(db.String(120), nullable=False)
    variant_type = db.Column(db.String(40), default="style", nullable=False)  # color, size, style, scent
    value = db.Column(db.String(100), nullable=False)
    price_delta = db.Column(db.Integer, default=0, nullable=False)
    stock_quantity = db.Column(db.Integer, default=10, nullable=False)


# 7. INVENTORY MOVEMENTS
class InventoryMovement(db.Model):
    __tablename__ = "inventory_movements"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    change_quantity = db.Column(db.Integer, nullable=False)
    previous_stock = db.Column(db.Integer, nullable=False)
    new_stock = db.Column(db.Integer, nullable=False)
    reason = db.Column(db.String(80), nullable=False)  # Order Placed, Manual Restock, Admin Adjustment
    reference_id = db.Column(db.String(80), nullable=True)
    performed_by = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now, nullable=False)


# 8. CARTS
class Cart(db.Model):
    __tablename__ = "carts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    session_token = db.Column(db.String(120), unique=True, nullable=True, index=True)
    coupon_code = db.Column(db.String(50), nullable=True)
    updated_at = db.Column(db.DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    items = db.relationship("CartItem", backref="cart", lazy="joined", cascade="all, delete-orphan")


# 9. CART ITEMS
class CartItem(db.Model):
    __tablename__ = "cart_items"

    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey("carts.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    variant_id = db.Column(db.Integer, db.ForeignKey("product_variants.id", ondelete="SET NULL"), nullable=True)
    quantity = db.Column(db.Integer, default=1, nullable=False)
    is_custom_gift = db.Column(db.Boolean, default=False, nullable=False)
    recipient_name = db.Column(db.String(120), nullable=True)
    personal_message = db.Column(db.String(300), nullable=True)
    gift_card_message = db.Column(db.Text, nullable=True)
    wrapping_style = db.Column(db.String(80), nullable=True)
    wrapping_price = db.Column(db.Integer, default=0, nullable=False)
    target_budget = db.Column(db.String(80), nullable=True)
    reference_image_name = db.Column(db.String(255), nullable=True)
    special_instructions = db.Column(db.Text, nullable=True)

    product = db.relationship("Product")
    variant = db.relationship("ProductVariant")


# 10. WISHLIST ITEMS
class WishlistItem(db.Model):
    __tablename__ = "wishlist_items"
    __table_args__ = (db.UniqueConstraint("user_id", "product_id", name="uq_user_wishlist_product"),)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now, nullable=False)

    product = db.relationship("Product")


# 11. ORDERS
class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(40), unique=True, nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    customer_name = db.Column(db.String(120), nullable=False)
    customer_email = db.Column(db.String(150), nullable=False, index=True)
    customer_phone = db.Column(db.String(40), nullable=False)

    # Shipping Address Snapshot
    house_building = db.Column(db.String(160), nullable=False)
    street = db.Column(db.String(160), nullable=False)
    area = db.Column(db.String(160), nullable=False)
    city = db.Column(db.String(80), nullable=False)
    province = db.Column(db.String(80), nullable=False)
    postal_code = db.Column(db.String(20), nullable=True)
    delivery_instructions = db.Column(db.Text, nullable=True)

    # Server-Calculated Financials (PKR Integers)
    subtotal = db.Column(db.Integer, nullable=False)
    discount_amount = db.Column(db.Integer, default=0, nullable=False)
    coupon_code = db.Column(db.String(50), nullable=True)
    shipping_fee = db.Column(db.Integer, default=0, nullable=False)
    total_amount = db.Column(db.Integer, nullable=False)

    # Separate Order & Payment Statuses
    payment_method = db.Column(db.String(60), default="Cash on Delivery (Demo)", nullable=False)
    payment_status = db.Column(db.String(40), default="Pending (COD)", nullable=False)
    order_status = db.Column(db.String(40), default="Pending", nullable=False, index=True)
    is_demo_order = db.Column(db.Boolean, default=True, nullable=False)
    idempotency_key = db.Column(db.String(100), unique=True, nullable=True)
    created_at = db.Column(db.DateTime, default=utc_now, nullable=False)

    items = db.relationship("OrderItem", backref="order", lazy="joined", cascade="all, delete-orphan")
    status_history = db.relationship("OrderStatusHistory", backref="order", lazy="joined", cascade="all, delete-orphan")


# 12. ORDER ITEMS (Historical Price & Product Snapshot)
class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    product_name_snapshot = db.Column(db.String(160), nullable=False)
    sku_snapshot = db.Column(db.String(60), nullable=False)
    variant_name_snapshot = db.Column(db.String(120), nullable=True)
    unit_price_snapshot = db.Column(db.Integer, nullable=False)
    wrapping_price_snapshot = db.Column(db.Integer, default=0, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    line_total = db.Column(db.Integer, nullable=False)

    # Customization Snapshot
    is_custom_gift = db.Column(db.Boolean, default=False, nullable=False)
    recipient_name = db.Column(db.String(120), nullable=True)
    personal_message = db.Column(db.String(300), nullable=True)
    gift_card_message = db.Column(db.Text, nullable=True)
    wrapping_style = db.Column(db.String(80), nullable=True)
    special_instructions = db.Column(db.Text, nullable=True)


# 13. ORDER STATUS HISTORY
class OrderStatusHistory(db.Model):
    __tablename__ = "order_status_history"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    status = db.Column(db.String(40), nullable=False)
    note = db.Column(db.String(300), nullable=True)
    updated_by = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now, nullable=False)


# 14. COUPONS
class Coupon(db.Model):
    __tablename__ = "coupons"

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False, index=True)
    description = db.Column(db.String(255), nullable=False)
    discount_type = db.Column(db.String(20), nullable=False)  # percentage, fixed
    discount_value = db.Column(db.Integer, nullable=False)
    min_order_value = db.Column(db.Integer, default=0, nullable=False)
    max_discount_amount = db.Column(db.Integer, nullable=True)
    expiry_date = db.Column(db.DateTime, nullable=False)
    usage_limit = db.Column(db.Integer, default=100, nullable=False)
    used_count = db.Column(db.Integer, default=0, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)


# 15. COUPON REDEMPTIONS
class CouponRedemption(db.Model):
    __tablename__ = "coupon_redemptions"

    id = db.Column(db.Integer, primary_key=True)
    coupon_id = db.Column(db.Integer, db.ForeignKey("coupons.id", ondelete="CASCADE"), nullable=False, index=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    discount_applied = db.Column(db.Integer, nullable=False)
    redeemed_at = db.Column(db.DateTime, default=utc_now, nullable=False)


# 16. REVIEWS
class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    customer_name = db.Column(db.String(120), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(160), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default="approved", nullable=False, index=True)  # pending, approved, rejected
    verified_purchase = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now, nullable=False)


# 17. BANNERS
class Banner(db.Model):
    __tablename__ = "banners"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    subtitle = db.Column(db.String(350), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    primary_cta_text = db.Column(db.String(80), default="Shop All Gifts")
    secondary_cta_text = db.Column(db.String(80), default="Create a Custom Gift")
    is_active = db.Column(db.Boolean, default=True, nullable=False)


# 18. NEWSLETTER SUBSCRIBERS
class NewsletterSubscriber(db.Model):
    __tablename__ = "newsletter_subscribers"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False, index=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    subscribed_at = db.Column(db.DateTime, default=utc_now, nullable=False)


# 19. CONTACT MESSAGES
class ContactMessage(db.Model):
    __tablename__ = "contact_messages"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    phone = db.Column(db.String(40), nullable=True)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default="unread", nullable=False)  # unread, read, replied
    admin_reply = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=utc_now, nullable=False)


# 20. STORE SETTINGS
class StoreSetting(db.Model):
    __tablename__ = "store_settings"

    id = db.Column(db.Integer, primary_key=True)
    setting_key = db.Column(db.String(100), unique=True, nullable=False, index=True)
    setting_value = db.Column(db.Text, nullable=False)
    updated_at = db.Column(db.DateTime, default=utc_now, onupdate=utc_now, nullable=False)


# 21. ADMIN AUDIT LOGS
class AdminAuditLog(db.Model):
    __tablename__ = "admin_audit_logs"

    id = db.Column(db.Integer, primary_key=True)
    actor_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    actor_name = db.Column(db.String(120), nullable=False)
    actor_role = db.Column(db.String(40), nullable=False)
    action = db.Column(db.String(160), nullable=False)
    entity_type = db.Column(db.String(60), nullable=False)
    entity_id = db.Column(db.String(80), nullable=False)
    details = db.Column(db.Text, nullable=True)
    ip_address = db.Column(db.String(60), nullable=True)
    created_at = db.Column(db.DateTime, default=utc_now, nullable=False)
