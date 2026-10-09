# Handmade Haven — Thoughtful Gifts, Beautifully Handmade

Full-stack e-commerce storefront, bespoke Custom Gift Builder, and **Sobia's Private Studio Admin** portal.

## 1. Private Studio Admin Access (Exclusively for Sobia)

Per owner security requirements:
- All public links to the Admin Dashboard have been **removed** from the customer header, announcement bar, mobile menu, and footer so normal visitors cannot see or open the admin panel.
- **How Sobia Can Open Studio Admin:**
  1. **Via the Search Bar (Secret Owner Command):** Open the search bar in the header and type **`@sobia`** or **`sobia-admin`** and press Enter.
  2. **Via the Customer Login Page:** Go to **Sign In** and enter Sobia's owner credentials directly.
  3. **Discreet Footer Trigger:** Click the small **`©`** symbol at the bottom-left of the footer.
- **Sobia's Owner Credentials:**
  - **Email / Username:** `sobianazeerkhokhar@gmail.com` (or simply `sobia`)
  - **Secret Passkey:** `sobia786` (or `sobia123`)

## 2. Running the Python Flask + SQLAlchemy Backend Locally

```bash
cd handmade-haven
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python scripts/seed_demo_data.py
python run.py
```

## 3. Running Automated Tests

```bash
cd handmade-haven
pytest -v
```
