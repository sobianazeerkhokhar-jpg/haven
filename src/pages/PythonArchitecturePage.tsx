/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Code2, Terminal, Database, ShieldCheck, CheckCircle2, FolderTree } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const PythonArchitecturePage: React.FC = () => {
  const { navigate } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'blueprints' | 'setup'>('overview');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#453832]/10 pb-6">
        <div>
          <p className="text-xs font-semibold text-[#6E5D54]">
            Full-Stack Deliverable & Runtime Transparency
          </p>
          <h1 className="font-serif-display text-3xl sm:text-5xl font-semibold text-[#453832]">
            Python Flask + SQLAlchemy Architecture
          </h1>
          <p className="text-xs sm:text-sm text-[#453832]/80 mt-1 max-w-3xl">
            Because the live AI Studio preview container executes a Node.js + Vite frontend
            server on port 3000, the interactive preview uses a persistent local database engine
            while the complete Python Flask + SQLAlchemy + SQLite/PostgreSQL backend is included
            in the repository under <code className="font-mono-tabular font-bold">/handmade-haven/</code>.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('home')}
          className="px-5 py-2.5 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
        >
          ← Back to Storefront
        </button>
      </div>

      {/* Interactive Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'overview' as const, label: 'Project Tree & Architecture', icon: FolderTree },
          { id: 'models' as const, label: 'SQLAlchemy Models (21 Tables)', icon: Database },
          { id: 'blueprints' as const, label: 'Flask Blueprints & Security', icon: ShieldCheck },
          { id: 'setup' as const, label: 'Local Setup, Seed & pytest Commands', icon: Terminal },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                activeTab === t.id
                  ? 'bg-[#453832] text-[#FFF9F0]'
                  : 'bg-white border border-[#453832]/15 text-[#453832]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
            <h2 className="font-serif-display text-2xl font-semibold">
              Included Python Project Files
            </h2>
            <pre className="p-4 rounded-xl bg-[#453832] text-[#FFF9F0] font-mono-tabular text-xs overflow-x-auto leading-relaxed">
{`handmade-haven/
├── app/
│   ├── __init__.py          # Flask Application Factory & Blueprints
│   ├── extensions.py        # SQLAlchemy, Migrate, LoginManager, CSRF, Limiter
│   ├── models.py            # 21 Relational Models (Decimal-safe PKR)
│   ├── auth/routes.py       # PBKDF2 Auth, Rate-Limited Login, RBAC
│   ├── storefront/routes.py # Catalog, Search, Filters, Blog, Policies
│   ├── cart/routes.py       # Server-Authoritative Cart & Wishlist
│   ├── checkout/routes.py   # Atomic DB Transactions & Stock Locking
│   ├── admin/routes.py      # Protected Admin CRUD, Reports, CSV Export
│   ├── api/routes.py        # REST JSON Endpoints (/api/v1/*)
│   └── services/pricing.py  # Server-Side Subtotal, Coupon & Shipping Math
├── scripts/
│   └── seed_demo_data.py    # Repeatable Seeder (6 Categories, 24 Products)
├── tests/
│   └── test_ecommerce.py    # Pytest Suite (Cart, Coupons, Stock, RBAC)
├── config.py                # Dev (SQLite) & Prod (PostgreSQL) Configs
├── requirements.txt         # Flask, SQLAlchemy, Flask-WTF, Pytest
├── run.py                   # WSGI Entry Point
└── README.md                # Full Setup & Deployment Guide`}
            </pre>
          </div>

          <div className="lg:col-span-6 bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
            <h2 className="font-serif-display text-2xl font-semibold">
              Production Integrations Checklist
            </h2>
            <p className="text-xs text-[#453832]/75">
              All core e-commerce workflows work out-of-the-box in demo mode. Before launching
              for real commercial transactions, configure these external providers in{' '}
              <code className="font-mono-tabular">.env</code>:
            </p>
            <div className="space-y-3 text-xs">
              {[
                {
                  title: '1. PostgreSQL Production Database',
                  desc: 'Set DATABASE_URL=postgresql+psycopg2://user:pass@host:5432/handmade_haven in .env (defaults to SQLite locally).',
                },
                {
                  title: '2. Online Payment Gateway (Safepay / Stripe / JazzCash)',
                  desc: 'Currently defaults to Cash on Delivery (Demo) and Simulated Bank Transfer. Configure PAYMENT_WEBHOOK_SECRET for live card capture.',
                },
                {
                  title: '3. Transactional Email Provider (SMTP / SendGrid / Resend)',
                  desc: 'Required for live password reset emails and automated order confirmation receipts.',
                },
                {
                  title: '4. Permanent Cloud Object Storage (AWS S3 / GCS / Cloudinary)',
                  desc: 'Required for storing customer-uploaded Custom Gift Builder reference images permanently.',
                },
              ].map((item, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#FFF9F0] border border-[#453832]/10">
                  <p className="font-semibold text-[#453832] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7A8B71] shrink-0" />
                    <span>{item.title}</span>
                  </p>
                  <p className="text-[#453832]/75 mt-1 pl-6">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'models' && (
        <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
          <h2 className="font-serif-display text-2xl font-semibold">
            21 SQLAlchemy Database Models (<code className="text-base">handmade-haven/app/models.py</code>)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {[
              '1. User (PBKDF2 password hash, role RBAC)',
              '2. Address (Customer shipping addresses)',
              '3. Category (Slug, display order, active flag)',
              '4. Product (SKU, integer PKR price, stock, flags)',
              '5. ProductImage (Gallery URLs & sort order)',
              '6. ProductVariant (Size/Color/Style, price delta)',
              '7. InventoryMovement (Stock audit ledger)',
              '8. Cart (Session & authenticated user cart)',
              '9. CartItem (Variant + JSON gift customization)',
              '10. WishlistItem (Customer saved products)',
              '11. Order (Unique order_number, separate statuses)',
              '12. OrderItem (Historical price & name snapshot)',
              '13. OrderStatusHistory (Timestamped state log)',
              '14. Coupon (Percentage/Fixed, min order, limits)',
              '15. CouponRedemption (Per-order usage tracking)',
              '16. Review (Verified purchase & moderation state)',
              '17. Banner (Homepage hero & promo management)',
              '18. NewsletterSubscriber (Opt-in studio list)',
              '19. ContactMessage (Customer concierge inquiries)',
              '20. StoreSetting (Key-value store configuration)',
              '21. AdminAuditLog (IP, actor, entity change trail)',
            ].map((m, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#FFF9F0] border border-[#453832]/10 font-medium"
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'blueprints' && (
        <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4 text-xs">
          <h2 className="font-serif-display text-2xl font-semibold">
            Server-Side Security & Validation Controls
          </h2>
          <ul className="space-y-2.5 list-disc pl-5 text-[#453832]/85 leading-relaxed">
            <li>
              <strong>Server-Authoritative Pricing:</strong> Neither the cart nor checkout
              trusts prices submitted from the browser. All unit prices, variant deltas, gift
              wrapping charges, coupon discounts, and free-shipping thresholds are recalculated
              on the server.
            </li>
            <li>
              <strong>Atomic Inventory Concurrency Protection:</strong> Order creation runs
              inside a database transaction (<code className="font-mono-tabular">db.session.begin()</code>)
              with row-level stock verification, preventing negative inventory or overselling.
            </li>
            <li>
              <strong>Customer Data Isolation:</strong> Every <code className="font-mono-tabular">/account/*</code>{' '}
              and <code className="font-mono-tabular">/orders/*</code> query filters strictly by{' '}
              <code className="font-mono-tabular">current_user.id</code> so customers can never
              access another customer's orders or addresses.
            </li>
            <li>
              <strong>Role-Based Access Control (RBAC):</strong> Admin blueprints enforce{' '}
              <code className="font-mono-tabular">@admin_required</code> decorators and log
              every state mutation to <code className="font-mono-tabular">AdminAuditLog</code>.
            </li>
          </ul>
        </div>
      )}

      {activeTab === 'setup' && (
        <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
          <h2 className="font-serif-display text-2xl font-semibold">
            How to Run the Python Flask Backend Locally
          </h2>
          <pre className="p-5 rounded-xl bg-[#453832] text-[#FFF9F0] font-mono-tabular text-xs overflow-x-auto leading-relaxed">
{`# 1. Navigate into the Python Flask project directory
cd handmade-haven

# 2. Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\\Scripts\\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy environment variables template
cp ../.env.example .env

# 5. Initialize SQLite database & seed the 6 categories, 24 products, coupons, and demo accounts
python scripts/seed_demo_data.py

# 6. Start the Flask development server on http://127.0.0.1:5000
python run.py

# 7. Run the automated pytest verification suite
pytest -v`}
          </pre>
        </div>
      )}
    </div>
  );
};
