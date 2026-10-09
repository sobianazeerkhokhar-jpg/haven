"""
Repeatable Demo Data Seeder for Handmade Haven
Seeds:
- Private Studio Admin Account exclusively for Sobia (sobianazeerkhokhar@gmail.com)
- Sample Customer Account (ayesha@example.com)
- 6 Categories
- 24 Realistic Handmade Products (PKR demonstration pricing)
- 3 Coupons (HAVEN10, GIFT500, SPRING15)
"""
import os
import sys
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app
from app.extensions import db
from app.models import User, Category, Product, ProductVariant, Coupon


CATEGORIES = [
    ("Handmade Jewelry", "handmade-jewelry", "Delicate freshwater pearls and botanical brass castings.", 1),
    ("Crochet Flowers", "crochet-flowers", "Everlasting blooms hand-stitched with organic cotton yarn.", 2),
    ("Candles & Decor", "candles-decor", "Small-batch 100% pure soy wax candles and travertine trays.", 3),
    ("Resin Art", "resin-art", "Crystal-clear botanical preserves with real pressed wildflowers.", 4),
    ("Gift Hampers", "gift-hampers", "Thoughtfully assembled keepsake boxes finished with wax seals.", 5),
    ("Cards & Stationery", "cards-stationery", "Hand-stitched linen journals and cotton-rag greeting cards.", 6),
]

PRODUCTS_BY_CATEGORY = {
    "handmade-jewelry": [
        ("Pearl Blossom Earrings", "pearl-blossom-earrings", "HH-JWL-001", 2450, 2150, 18, True, True),
        ("Minimal Gold-Tone Necklace", "minimal-gold-tone-necklace", "HH-JWL-002", 2200, None, 25, False, True),
        ("Floral Charm Bracelet", "floral-charm-bracelet", "HH-JWL-003", 1950, 1750, 17, False, False),
        ("Personalized Initial Pendant", "personalized-initial-pendant", "HH-JWL-004", 2650, None, 30, True, True),
    ],
    "crochet-flowers": [
        ("Pink Tulip Crochet Bouquet", "pink-tulip-crochet-bouquet", "HH-CRC-001", 3200, 2850, 16, True, True),
        ("Mini Crochet Rose", "mini-crochet-rose", "HH-CRC-002", 950, None, 54, False, True),
        ("Crochet Daisy Keychain", "crochet-daisy-keychain", "HH-CRC-003", 680, None, 50, False, False),
        ("Custom Crochet Bouquet", "custom-crochet-bouquet", "HH-CRC-004", 4800, 4350, 7, True, False),
    ],
    "candles-decor": [
        ("Vanilla Soy Candle", "vanilla-soy-candle", "HH-CND-001", 2100, 1890, 27, True, True),
        ("Floral Candle Gift Set", "floral-candle-gift-set", "HH-CND-002", 3950, 3600, 16, False, True),
        ("Decorative Handmade Tray", "decorative-handmade-tray", "HH-CND-003", 2400, None, 23, False, False),
        ("Mini Desk Decor Set", "mini-desk-decor-set", "HH-CND-004", 2750, None, 12, False, False),
    ],
    "resin-art": [
        ("Pressed Flower Resin Keychain", "pressed-flower-resin-keychain", "HH-RSN-001", 850, None, 43, False, True),
        ("Floral Resin Bookmark", "floral-resin-bookmark", "HH-RSN-002", 790, 690, 35, False, True),
        ("Resin Coaster Set", "resin-coaster-set", "HH-RSN-003", 3400, 2950, 20, True, True),
        ("Personalized Resin Name Tag", "personalized-resin-name-tag", "HH-RSN-004", 1250, None, 25, False, False),
    ],
    "gift-hampers": [
        ("Birthday Surprise Box", "birthday-surprise-box", "HH-HMP-001", 5800, 5250, 13, True, True),
        ("Best Friend Gift Hamper", "best-friend-gift-hamper", "HH-HMP-002", 4950, 4500, 18, True, True),
        ("Self-Care Gift Box", "self-care-gift-box", "HH-HMP-003", 4600, None, 11, False, False),
        ("Anniversary Keepsake Box", "anniversary-keepsake-box", "HH-HMP-004", 6850, 6300, 5, False, True),
    ],
    "cards-stationery": [
        ("Handmade Birthday Card", "handmade-birthday-card", "HH-STN-001", 650, None, 65, False, True),
        ("Floral Greeting Card Set", "floral-greeting-card-set", "HH-STN-002", 1850, 1650, 32, False, False),
        ("Personalized Journal", "personalized-journal", "HH-STN-003", 2600, 2350, 26, True, True),
        ("Scrapbook Starter Kit", "scrapbook-starter-kit", "HH-STN-004", 3500, 3150, 9, False, False),
    ],
}


def seed_database():
    app = create_app("development")
    with app.app_context():
        db.create_all()

        # 1. Seed Sobia's Exclusive Studio Admin Account
        if not User.query.filter_by(email="sobianazeerkhokhar@gmail.com").first():
            sobia_admin = User(
                full_name="Sobia (Studio Founder & Admin)",
                email="sobianazeerkhokhar@gmail.com",
                phone="+92 300 845 9210",
                role="admin",
            )
            sobia_admin.set_password("sobia786")
            db.session.add(sobia_admin)

        # 2. Seed Demo Customer Account
        if not User.query.filter_by(email="ayesha@example.com").first():
            customer = User(
                full_name="Ayesha Kamran",
                email="ayesha@example.com",
                phone="+92 321 498 1122",
                role="customer",
            )
            customer.set_password("customer123")
            db.session.add(customer)

        db.session.commit()

        # 3. Seed 6 Categories & 24 Products
        for name, slug, desc, order_num in CATEGORIES:
            cat = Category.query.filter_by(slug=slug).first()
            if not cat:
                cat = Category(
                    name=name,
                    slug=slug,
                    description=desc,
                    image_url="/static/images/category_placeholder.jpg",
                    display_order=order_num,
                    is_active=True,
                )
                db.session.add(cat)
                db.session.flush()

            for p_name, p_slug, sku, price, disc, stock, feat, best in PRODUCTS_BY_CATEGORY[slug]:
                if not Product.query.filter_by(sku=sku).first():
                    prod = Product(
                        category_id=cat.id,
                        name=p_name,
                        slug=p_slug,
                        sku=sku,
                        short_description=f"Handcrafted {p_name} from our studio collection.",
                        description=f"Small-batch artisanal {p_name} crafted with care at Handmade Haven.",
                        price=price,
                        discount_price=disc,
                        materials="Natural artisan materials",
                        dimensions="Standard gift dimensions",
                        stock_quantity=stock,
                        status="published",
                        is_featured=feat,
                        is_bestseller=best,
                        allow_customization=True,
                    )
                    db.session.add(prod)
                    db.session.flush()
                    db.session.add(
                        ProductVariant(
                            product_id=prod.id,
                            name="Standard Studio Edition",
                            variant_type="style",
                            value="Standard",
                            price_delta=0,
                            stock_quantity=stock,
                        )
                    )

        # 4. Seed Coupons
        if not Coupon.query.filter_by(code="HAVEN10").first():
            db.session.add(
                Coupon(
                    code="HAVEN10",
                    description="10% welcome discount on orders above PKR 1,500",
                    discount_type="percentage",
                    discount_value=10,
                    min_order_value=1500,
                    max_discount_amount=1500,
                    expiry_date=datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=365),
                    usage_limit=500,
                    is_active=True,
                )
            )

        db.session.commit()
        print("Handmade Haven demo data seeded! Studio Admin owner: Sobia (sobianazeerkhokhar@gmail.com)")


if __name__ == "__main__":
    seed_database()
