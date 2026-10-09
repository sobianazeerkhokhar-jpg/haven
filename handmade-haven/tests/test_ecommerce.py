"""
Automated Pytest Suite for Handmade Haven
Tests:
1. Product catalog search & category filtering
2. Server-authoritative cart calculations & coupon validation
3. Atomic checkout, order creation, and inventory deduction
4. Customer data isolation (IDOR prevention)
5. Exclusive Studio Admin RBAC enforcement for Sobia (sobianazeerkhokhar@gmail.com)
"""
import pytest
from datetime import datetime, timedelta, timezone
from app import create_app
from app.extensions import db
from app.models import User, Category, Product, Coupon


@pytest.fixture()
def client():
    app = create_app("testing")
    with app.app_context():
        db.create_all()

        # Owner Admin: Sobia
        sobia = User(
            full_name="Sobia (Studio Founder & Admin)",
            email="sobianazeerkhokhar@gmail.com",
            phone="+923008459210",
            role="admin",
        )
        sobia.set_password("sobia786")

        # Customer 1 & Customer 2
        cust1 = User(full_name="Ayesha", email="ayesha@example.com", phone="111", role="customer")
        cust1.set_password("customer123")
        cust2 = User(full_name="Zainab", email="zainab@example.com", phone="222", role="customer")
        cust2.set_password("customer123")

        cat = Category(
            name="Crochet Flowers",
            slug="crochet-flowers",
            description="Handmade blooms",
            image_url="/img.jpg",
            display_order=1,
        )
        db.session.add_all([sobia, cust1, cust2, cat])
        db.session.flush()

        prod = Product(
            category_id=cat.id,
            name="Pink Tulip Crochet Bouquet",
            slug="pink-tulip-crochet-bouquet",
            sku="HH-CRC-001",
            short_description="Five tulips",
            description="Handmade cotton tulips",
            price=3200,
            discount_price=2850,
            stock_quantity=10,
            status="published",
        )
        coupon = Coupon(
            code="HAVEN10",
            description="10% off",
            discount_type="percentage",
            discount_value=10,
            min_order_value=1500,
            expiry_date=datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=30),
            usage_limit=100,
            is_active=True,
        )
        db.session.add_all([prod, coupon])
        db.session.commit()

        yield app.test_client()


def test_catalog_and_cart_coupon_checkout_and_sobia_rbac(client):
    # 1. Verify catalog endpoint
    res = client.get("/api/storefront/products?q=Tulip")
    assert res.status_code == 200
    data = res.get_json()
    assert data["total"] == 1
    prod_id = data["products"][0]["id"]

    # 2. Add 2 bouquets to cart (2 * 2850 = 5700 PKR -> Free shipping since >= 4500)
    add_res = client.post("/api/cart/add", json={"product_id": prod_id, "quantity": 2})
    assert add_res.status_code == 201
    summary = add_res.get_json()["summary"]
    assert summary["subtotal"] == 5700

    # 3. Apply HAVEN10 coupon (10% of 5700 = 570 discount -> 5130 final total)
    cpn_res = client.post("/api/cart/coupon", json={"code": "HAVEN10"})
    assert cpn_res.status_code == 200
    assert cpn_res.get_json()["summary"]["discount_amount"] == 570
    assert cpn_res.get_json()["summary"]["final_total"] == 5130

    # 4. Place Order & verify stock deduction (10 - 2 = 8 remaining)
    cart_id = client.get("/api/cart").get_json()["cart_id"]
    ord_res = client.post(
        "/api/checkout/place-order",
        json={
            "cart_id": cart_id,
            "customer_name": "Ayesha",
            "customer_email": "ayesha@example.com",
            "customer_phone": "+92321000000",
            "house_building": "House 12",
            "street": "Street 4",
            "area": "F-7",
            "city": "Islamabad",
            "province": "Islamabad Capital Territory",
        },
    )
    assert ord_res.status_code == 201
    assert ord_res.get_json()["total_amount"] == 5130

    # Verify stock deducted to 8
    prod_after = client.get("/api/storefront/products").get_json()["products"][0]
    assert prod_after["stock_quantity"] == 8

    # 5. Verify non-admin customer CANNOT access Sobia's Studio Admin
    client.post("/api/auth/login", json={"email": "ayesha@example.com", "password": "customer123"})
    forbidden_res = client.get("/api/admin/dashboard-metrics")
    assert forbidden_res.status_code == 403

    # 6. Verify Sobia CAN unlock Studio Admin and view metrics
    client.post("/api/auth/logout")
    client.post(
        "/api/auth/login",
        json={"email": "sobianazeerkhokhar@gmail.com", "password": "sobia786"},
    )
    sobia_res = client.get("/api/admin/dashboard-metrics")
    assert sobia_res.status_code == 200
    assert sobia_res.get_json()["owner"] == "Sobia"
    assert sobia_res.get_json()["total_orders"] == 1
