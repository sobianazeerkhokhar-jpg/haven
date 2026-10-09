/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Warehouse,
  ShoppingCart,
  Users,
  Tag,
  Image as ImageIcon,
  FileText,
  Star,
  MessageSquare,
  BarChart3,
  Truck,
  CreditCard,
  Shield,
  Settings,
  ClipboardList,
  LogOut,
  Plus,
  Edit3,
  Trash2,
  Download,
  RotateCcw,
  Store,
  Code2,
  Search,
} from 'lucide-react';
import { useStore, PageRoute } from '../context/StoreContext';
import { OrderStatus, PaymentStatus, Product } from '../types';
import { GENERATED_IMAGES } from '../data/seedData';
import { ResilientImage } from '../components/ResilientImage';

export const AdminPortal: React.FC = () => {
  const {
    currentPage,
    navParams,
    navigate,
    currentAdmin,
    loginAdmin,
    logoutAdmin,
    settings,
    categories,
    products,
    orders,
    users,
    coupons,
    reviews,
    messages,
    inventoryMovements,
    auditLogs,
    adminSaveProduct,
    adminDeleteProduct,
    adminSaveCategory,
    adminAdjustInventory,
    adminUpdateOrderStatus,
    adminSaveCoupon,
    adminToggleCoupon,
    adminModerateReview,
    adminUpdateMessageStatus,
    adminUpdateSettings,
    adminSaveStaffUser,
    adminToggleUserActive,
    resetDemoDatabase,
    notify,
  } = useStore();

  // Admin Login Form State (Strictly Private to Sobia)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Product Form State (Add / Edit)
  const editingProduct = useMemo(() => {
    if (currentPage === 'admin-edit-product' && navParams.productId) {
      return products.find((p) => p.id === navParams.productId) || products[0];
    }
    return null;
  }, [currentPage, navParams.productId, products]);

  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodCategoryId, setProdCategoryId] = useState(categories[0]?.id || 'cat-jewelry');
  const [prodPrice, setProdPrice] = useState(2500);
  const [prodDiscountPrice, setProdDiscountPrice] = useState<string>('');
  const [prodStock, setProdStock] = useState(15);
  const [prodShortDesc, setProdShortDesc] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodMaterials, setProdMaterials] = useState('Handmade in studio');
  const [prodDimensions, setProdDimensions] = useState('Standard gift size');
  const [prodImage, setProdImage] = useState(GENERATED_IMAGES.hero);
  const [prodStatus, setProdStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodBestseller, setProdBestseller] = useState(false);
  const [prodAllowCustom, setProdAllowCustom] = useState(true);

  React.useEffect(() => {
    if (editingProduct) {
      setProdName(editingProduct.name);
      setProdSku(editingProduct.sku);
      setProdCategoryId(editingProduct.categoryId);
      setProdPrice(editingProduct.price);
      setProdDiscountPrice(
        editingProduct.discountPrice ? String(editingProduct.discountPrice) : ''
      );
      setProdStock(editingProduct.stock);
      setProdShortDesc(editingProduct.shortDescription);
      setProdDesc(editingProduct.description);
      setProdMaterials(editingProduct.materials);
      setProdDimensions(editingProduct.dimensions);
      setProdImage(editingProduct.images[0] || GENERATED_IMAGES.hero);
      setProdStatus(editingProduct.status);
      setProdFeatured(editingProduct.isFeatured);
      setProdBestseller(editingProduct.isBestseller);
      setProdAllowCustom(editingProduct.allowCustomization);
    } else if (currentPage === 'admin-add-product') {
      setProdName('');
      setProdSku(`HH-NEW-${Math.floor(100 + Math.random() * 899)}`);
      setProdPrice(2400);
      setProdDiscountPrice('');
      setProdStock(20);
      setProdShortDesc('');
      setProdDesc('');
    }
  }, [editingProduct, currentPage]);

  // Category Form State
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catOrder, setCatOrder] = useState(categories.length + 1);

  // Order Filter & Update State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const activeAdminOrder =
    orders.find((o) => o.id === navParams.orderId) || orders[0];
  const [statusUpdateNote, setStatusUpdateNote] = useState('');

  // Coupon Form State
  const [cpnCode, setCpnCode] = useState('');
  const [cpnDesc, setCpnDesc] = useState('');
  const [cpnType, setCpnType] = useState<'percentage' | 'fixed'>('percentage');
  const [cpnValue, setCpnValue] = useState(10);
  const [cpnMinOrder, setCpnMinOrder] = useState(2000);

  // Staff User Form State
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('+92 300 0000000');
  const [staffRole, setStaffRole] = useState<'admin' | 'manager' | 'editor'>('manager');

  // Settings Editable States
  const [bannerForm, setBannerForm] = useState({
    announcementText: settings.announcementText,
    announcementEnabled: settings.announcementEnabled,
    heroHeadline: settings.heroHeadline,
    heroSubheadline: settings.heroSubheadline,
    heroPrimaryCta: settings.heroPrimaryCta,
    heroSecondaryCta: settings.heroSecondaryCta,
    heroBannerImage: settings.heroBannerImage,
  });

  const [contentForm, setContentForm] = useState({
    featuredCollectionTitle: settings.featuredCollectionTitle,
    featuredCollectionSubtitle: settings.featuredCollectionSubtitle,
    brandStoryHeadline: settings.brandStoryHeadline,
    brandStoryBody: settings.brandStoryBody,
  });

  const [shippingForm, setShippingForm] = useState({
    standardShippingFee: settings.standardShippingFee,
    freeShippingThreshold: settings.freeShippingThreshold,
    estimatedDeliveryDays: settings.estimatedDeliveryDays,
  });

  const [paymentForm, setPaymentForm] = useState({
    codEnabled: settings.codEnabled,
    onlinePaymentDemoEnabled: settings.onlinePaymentDemoEnabled,
    bankAccountDetails: settings.bankAccountDetails,
  });

  const [storeInfoForm, setStoreInfoForm] = useState({
    storeName: settings.storeName,
    tagline: settings.tagline,
    supportEmail: settings.supportEmail,
    supportPhone: settings.supportPhone,
    studioAddress: settings.studioAddress,
    workingHours: settings.workingHours,
  });

  // If on Admin Login or not authenticated as Admin (Strictly Restricted to Sobia)
  if (currentPage === 'admin-login' || !currentAdmin) {
    return (
      <div className="min-h-screen bg-[#453832] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#FFF9F0] rounded-2xl border border-[#453832]/20 p-8 space-y-6 shadow-xl">
          <div className="text-center space-y-1.5">
            <p className="text-xs font-semibold text-[#6E5D54]">
              Restricted Owner Access · Sobia’s Private Studio
            </p>
            <h1 className="font-serif-display text-3xl font-semibold text-[#453832]">
              Sobia’s Studio Admin
            </h1>
            <p className="text-xs text-[#453832]/70">
              This portal is hidden from public visitors and accessible exclusively to Sobia.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const ok = loginAdmin(loginEmail, loginPassword);
              if (ok) navigate('admin-dashboard');
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold mb-1">
                Owner Email or Username
              </label>
              <input
                type="text"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter owner email..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Secret Passkey</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter secret passkey..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-white text-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold hover:bg-[#453832]/90"
            >
              Unlock Sobia’s Studio Admin
            </button>
          </form>

          <div className="pt-4 border-t border-[#453832]/10 text-center">
            <button
              type="button"
              onClick={() => navigate('home')}
              className="text-xs font-semibold text-[#6E5D54] hover:text-[#453832]"
            >
              ← Return to Customer Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Real Database-Driven Dashboard Metrics
  const totalRevenue = orders
    .filter((o) => o.orderStatus !== 'Cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);
  const avgOrderValue =
    orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === 'Pending' || o.orderStatus === 'Processing'
  ).length;
  const lowStockProducts = products.filter((p) => p.stock <= 10);
  const customerAccounts = users.filter((u) => u.role === 'customer');

  const handleExportOrdersCsv = () => {
    const headers = [
      'OrderNumber',
      'Date',
      'CustomerName',
      'City',
      'Subtotal_PKR',
      'Discount_PKR',
      'Shipping_PKR',
      'Total_PKR',
      'OrderStatus',
      'PaymentStatus',
    ];
    const rows = orders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toISOString().split('T')[0],
      `"${o.customerName}"`,
      `"${o.shippingAddress.city}"`,
      o.subtotal,
      o.discountAmount,
      o.shippingFee,
      o.totalAmount,
      o.orderStatus,
      `"${o.paymentStatus}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `handmade_haven_sales_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('Downloaded Sales Report CSV.', 'success');
  };

  const sidebarItems: { id: PageRoute; label: string; icon: React.ElementType }[] = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-products', label: 'Products Management', icon: Package },
    { id: 'admin-add-product', label: 'Add New Product', icon: Plus },
    { id: 'admin-categories', label: 'Categories', icon: Layers },
    { id: 'admin-inventory', label: 'Inventory & Stock', icon: Warehouse },
    { id: 'admin-orders', label: 'Order Management', icon: ShoppingCart },
    { id: 'admin-customers', label: 'Customers', icon: Users },
    { id: 'admin-coupons', label: 'Coupons & Discounts', icon: Tag },
    { id: 'admin-banners', label: 'Homepage Banners', icon: ImageIcon },
    { id: 'admin-content', label: 'Website Content', icon: FileText },
    { id: 'admin-reviews', label: 'Reviews Moderation', icon: Star },
    { id: 'admin-messages', label: 'Customer Messages', icon: MessageSquare },
    { id: 'admin-reports', label: 'Sales & Analytics', icon: BarChart3 },
    { id: 'admin-shipping', label: 'Shipping Settings', icon: Truck },
    { id: 'admin-payments', label: 'Payment Settings', icon: CreditCard },
    { id: 'admin-users', label: 'Admin Users & Roles', icon: Shield },
    { id: 'admin-settings', label: 'Store Settings', icon: Settings },
    { id: 'admin-audit-logs', label: 'Audit Logs', icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col lg:flex-row text-[#453832]">
      {/* Admin Sidebar */}
      <aside className="w-full lg:w-64 bg-[#453832] text-[#FFF9F0] shrink-0 flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-[#FFF9F0]/15 flex items-center justify-between">
            <div>
              <p className="font-serif-display text-2xl font-semibold text-[#F7E7E7]">
                Sobia’s Studio
              </p>
              <p className="text-[11px] text-[#FFF9F0]/65">
                Private Owner Portal · Sobia
              </p>
            </div>
          </div>

          <nav className="p-3 space-y-1 max-h-[70vh] lg:max-h-none overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPage === item.id ||
                (currentPage === 'admin-edit-product' && item.id === 'admin-products') ||
                (currentPage === 'admin-order-details' && item.id === 'admin-orders');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#F7E7E7] text-[#453832] font-semibold'
                      : 'text-[#FFF9F0]/80 hover:bg-[#FFF9F0]/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#FFF9F0]/15 space-y-2 text-xs">
          <button
            type="button"
            onClick={() => navigate('python-architecture')}
            className="w-full text-left px-3 py-2 rounded-lg bg-[#FFF9F0]/10 text-[#F7E7E7] hover:bg-[#FFF9F0]/20 flex items-center gap-2"
          >
            <Code2 className="w-4 h-4 shrink-0" />
            <span className="truncate">Python Flask Backend Files</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('home')}
            className="w-full text-left px-3 py-2 rounded-lg bg-[#A8B5A0]/25 text-[#FFF9F0] hover:bg-[#A8B5A0]/40 flex items-center gap-2"
          >
            <Store className="w-4 h-4 shrink-0" />
            <span>View Live Storefront</span>
          </button>
          <button
            type="button"
            onClick={logoutAdmin}
            className="w-full text-left px-3 py-2 rounded-lg text-[#F7E7E7]/80 hover:text-white flex items-center gap-2"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out ({currentAdmin.fullName.split(' ')[0]})</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <div className="flex-1 p-6 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
        {/* Top Admin Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#453832]/10">
          <div>
            <p className="text-xs text-[#6E5D54]">
              Sample Analytics & Database Operations (Live Synced with Storefront)
            </p>
            <h1 className="font-serif-display text-3xl font-semibold text-[#453832]">
              {sidebarItems.find((i) => i.id === currentPage)?.label ||
                (currentPage === 'admin-edit-product'
                  ? 'Edit Product'
                  : currentPage === 'admin-order-details'
                  ? 'Order Details & Status'
                  : 'Admin Workspace')}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resetDemoDatabase}
              className="px-3.5 py-2 rounded-xl border border-[#453832]/20 bg-white text-xs font-semibold hover:bg-[#F7E7E7]/50 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Seed Data</span>
            </button>
            <button
              type="button"
              onClick={handleExportOrdersCsv}
              className="px-4 py-2 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Sales CSV</span>
            </button>
          </div>
        </div>

        {/* 1. ADMIN DASHBOARD */}
        {currentPage === 'admin-dashboard' && (
          <div className="space-y-8">
            {/* 6 Core KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="bg-white p-5 rounded-xl border border-[#453832]/10">
                <p className="text-xs text-[#6E5D54]">Total Revenue (Demo)</p>
                <p className="font-mono-tabular text-xl font-bold text-[#453832] mt-1">
                  PKR {totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-[#453832]/10">
                <p className="text-xs text-[#6E5D54]">Total Orders</p>
                <p className="font-mono-tabular text-xl font-bold text-[#453832] mt-1">
                  {orders.length}
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-[#453832]/10">
                <p className="text-xs text-[#6E5D54]">Avg. Order Value</p>
                <p className="font-mono-tabular text-xl font-bold text-[#453832] mt-1">
                  PKR {avgOrderValue.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-[#453832]/10">
                <p className="text-xs text-[#6E5D54]">Pending / Active</p>
                <p className="font-mono-tabular text-xl font-bold text-[#453832] mt-1">
                  {pendingOrdersCount}
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-[#453832]/10">
                <p className="text-xs text-[#6E5D54]">Total Customers</p>
                <p className="font-mono-tabular text-xl font-bold text-[#453832] mt-1">
                  {customerAccounts.length}
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-[#453832]/10">
                <p className="text-xs text-[#6E5D54]">Low-Stock Alerts</p>
                <p className="font-mono-tabular text-xl font-bold text-[#B94A48] mt-1">
                  {lowStockProducts.length} Items
                </p>
              </div>
            </div>

            {/* Charts & Distribution Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif-display text-2xl font-semibold">
                    Category Revenue Breakdown (Sample Data)
                  </h2>
                </div>
                <div className="space-y-3 pt-2">
                  {categories.map((cat, idx) => {
                    const catProds = products.filter((p) => p.categoryId === cat.id);
                    const pct = Math.min(95, 32 + idx * 11);
                    return (
                      <div key={cat.id} className="space-y-1 text-xs">
                        <div className="flex justify-between font-medium">
                          <span>{cat.name}</span>
                          <span className="font-mono-tabular">
                            {catProds.length} SKUs · {pct}% Share
                          </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-[#FFF9F0] overflow-hidden">
                          <div
                            className="h-full bg-[#453832] rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
                <h2 className="font-serif-display text-2xl font-semibold">
                  Order Status Distribution
                </h2>
                <div className="space-y-2.5 text-xs">
                  {(
                    [
                      'Pending',
                      'Confirmed',
                      'Processing',
                      'Shipped',
                      'Delivered',
                      'Cancelled',
                    ] as OrderStatus[]
                  ).map((st) => {
                    const count = orders.filter((o) => o.orderStatus === st).length;
                    return (
                      <div
                        key={st}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#FFF9F0]"
                      >
                        <span className="font-medium">{st}</span>
                        <span className="font-mono-tabular font-bold">{count} Orders</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Orders & Low Stock Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif-display text-2xl font-semibold">Recent Orders</h2>
                  <button
                    type="button"
                    onClick={() => navigate('admin-orders')}
                    className="text-xs font-semibold underline"
                  >
                    Manage All Orders →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#453832]/10 text-[#6E5D54]">
                        <th className="py-2">Order #</th>
                        <th className="py-2">Customer</th>
                        <th className="py-2">Status</th>
                        <th className="py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#453832]/8">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id}>
                          <td className="py-2.5 font-mono-tabular font-bold">
                            <button
                              type="button"
                              onClick={() =>
                                navigate('admin-order-details', { orderId: o.id })
                              }
                              className="hover:underline"
                            >
                              {o.orderNumber}
                            </button>
                          </td>
                          <td className="py-2.5">{o.customerName}</td>
                          <td className="py-2.5 font-medium">{o.orderStatus}</td>
                          <td className="py-2.5 text-right font-mono-tabular">
                            PKR {o.totalAmount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif-display text-2xl font-semibold">
                    Low-Stock Alert Queue
                  </h2>
                  <button
                    type="button"
                    onClick={() => navigate('admin-inventory')}
                    className="text-xs font-semibold underline"
                  >
                    Restock →
                  </button>
                </div>
                <div className="space-y-2.5 text-xs">
                  {lowStockProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-[#F7E7E7]/50 border border-[#453832]/10 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-[#453832]">{p.name}</p>
                        <p className="text-[11px] text-[#6E5D54] font-mono-tabular">
                          SKU: {p.sku}
                        </p>
                      </div>
                      <span className="font-mono-tabular font-bold text-[#B94A48]">
                        {p.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCTS MANAGEMENT */}
        {currentPage === 'admin-products' && (
          <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-[#6E5D54]">
                Showing all {products.length} products in catalog
              </p>
              <button
                type="button"
                onClick={() => navigate('admin-add-product')}
                className="px-4 py-2 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Product</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#453832]/15 text-[#6E5D54]">
                    <th className="py-3 pr-3">Product</th>
                    <th className="py-3 px-3">SKU</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Price (PKR)</th>
                    <th className="py-3 px-3">Stock</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 pl-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#453832]/8">
                  {products.map((prod) => (
                    <tr key={prod.id}>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-3">
                          <ResilientImage
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-[#453832]">{prod.name}</p>
                            <p className="text-[11px] text-[#6E5D54]">
                              {prod.isFeatured ? 'Featured · ' : ''}
                              {prod.isBestseller ? 'Bestseller' : ''}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono-tabular">{prod.sku}</td>
                      <td className="py-3 px-3">{prod.categoryName}</td>
                      <td className="py-3 px-3 font-mono-tabular font-semibold">
                        {(prod.discountPrice || prod.price).toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-mono-tabular">{prod.stock}</td>
                      <td className="py-3 px-3 capitalize font-medium">{prod.status}</td>
                      <td className="py-3 pl-3 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() =>
                            navigate('admin-edit-product', { productId: prod.id })
                          }
                          className="px-2.5 py-1 rounded border border-[#453832]/20 hover:bg-[#FFF9F0] inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => adminDeleteProduct(prod.id)}
                          className="px-2.5 py-1 rounded border border-[#B94A48]/30 text-[#B94A48] hover:bg-[#F7E7E7]/50 inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3 & 4. ADD PRODUCT & EDIT PRODUCT */}
        {(currentPage === 'admin-add-product' || currentPage === 'admin-edit-product') && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const catObj =
                categories.find((c) => c.id === prodCategoryId) || categories[0];
              const slug = prodName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

              adminSaveProduct(
                {
                  name: prodName,
                  slug,
                  sku: prodSku,
                  categoryId: catObj.id,
                  categoryName: catObj.name,
                  categorySlug: catObj.slug,
                  shortDescription: prodShortDesc || prodDesc.slice(0, 90),
                  description: prodDesc,
                  price: Number(prodPrice),
                  discountPrice: prodDiscountPrice ? Number(prodDiscountPrice) : null,
                  images: [prodImage, GENERATED_IMAGES.hero],
                  variants: editingProduct?.variants || [
                    {
                      id: 'v-' + Date.now(),
                      name: 'Standard Artisan Edition',
                      type: 'style',
                      value: 'Standard',
                      priceDelta: 0,
                      stock: Number(prodStock),
                    },
                  ],
                  materials: prodMaterials,
                  dimensions: prodDimensions,
                  careInstructions: 'Keep in dry studio pouch.',
                  stock: Number(prodStock),
                  status: prodStatus,
                  isFeatured: prodFeatured,
                  isBestseller: prodBestseller,
                  isNewArrival: true,
                  allowCustomization: prodAllowCustom,
                },
                editingProduct?.id
              );
              navigate('admin-products');
            }}
            className="bg-white rounded-2xl border border-[#453832]/10 p-6 sm:p-8 space-y-5 max-w-4xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Botanical Lavender Soy Candle"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">SKU Code *</label>
                <input
                  type="text"
                  required
                  value={prodSku}
                  onChange={(e) => setProdSku(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs font-mono-tabular"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Category *</label>
                <select
                  value={prodCategoryId}
                  onChange={(e) => setProdCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Catalog Status</label>
                <select
                  value={prodStatus}
                  onChange={(e) =>
                    setProdStatus(e.target.value as 'published' | 'draft' | 'archived')
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                >
                  <option value="published">Published (Visible in Storefront)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Regular Price (PKR) *
                </label>
                <input
                  type="number"
                  min={100}
                  required
                  value={prodPrice}
                  onChange={(e) => setProdPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs font-mono-tabular"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Discount Price (PKR — Optional)
                </label>
                <input
                  type="number"
                  value={prodDiscountPrice}
                  onChange={(e) => setProdDiscountPrice(e.target.value)}
                  placeholder="Leave blank if no discount"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs font-mono-tabular"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={prodStock}
                  onChange={(e) => setProdStock(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs font-mono-tabular"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Studio Image Asset</label>
                <select
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                >
                  <option value={GENERATED_IMAGES.hero}>Curated Gift Flat-Lay</option>
                  <option value={GENERATED_IMAGES.jewelryCrochet}>
                    Pearl Jewelry & Crochet Flowers
                  </option>
                  <option value={GENERATED_IMAGES.candlesResin}>
                    Botanical Soy Candle & Resin Art
                  </option>
                  <option value={GENERATED_IMAGES.hampersStationery}>
                    Keepsake Hamper & Stationery
                  </option>
                  <option value={GENERATED_IMAGES.storyStudio}>Artisan Workbench</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Short Summary *</label>
              <input
                type="text"
                required
                value={prodShortDesc}
                onChange={(e) => setProdShortDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Full Description *</label>
              <textarea
                rows={3}
                required
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              />
            </div>

            <div className="flex flex-wrap gap-6 text-xs pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prodFeatured}
                  onChange={(e) => setProdFeatured(e.target.checked)}
                  className="accent-[#453832]"
                />
                <span>Featured on Homepage</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prodBestseller}
                  onChange={(e) => setProdBestseller(e.target.checked)}
                  className="accent-[#453832]"
                />
                <span>Mark as Bestseller</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prodAllowCustom}
                  onChange={(e) => setProdAllowCustom(e.target.checked)}
                  className="accent-[#453832]"
                />
                <span>Eligible in Custom Gift Builder</span>
              </label>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
              >
                {editingProduct ? 'Save Product Updates' : 'Create & Publish Product'}
              </button>
              <button
                type="button"
                onClick={() => navigate('admin-products')}
                className="px-5 py-3 rounded-xl border border-[#453832]/20 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* 5. CATEGORY MANAGEMENT */}
        {currentPage === 'admin-categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
              <h2 className="font-serif-display text-2xl font-semibold">
                Storefront Categories ({categories.length})
              </h2>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 rounded-xl bg-[#FFF9F0] border border-[#453832]/10 flex items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-sm text-[#453832]">
                        {cat.displayOrder}. {cat.name}
                      </p>
                      <p className="text-[#453832]/75 mt-0.5">{cat.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        adminSaveCategory({ ...cat, isActive: !cat.isActive }, cat.id)
                      }
                      className={`px-3 py-1.5 rounded-lg font-semibold ${
                        cat.isActive
                          ? 'bg-[#453832] text-[#FFF9F0]'
                          : 'bg-[#F7E7E7] text-[#453832]'
                      }`}
                    >
                      {cat.isActive ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!catName.trim()) return;
                adminSaveCategory({
                  name: catName.trim(),
                  slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  description: catDesc.trim(),
                  image: GENERATED_IMAGES.hampersStationery,
                  displayOrder: Number(catOrder),
                  isActive: true,
                });
                setCatName('');
                setCatDesc('');
              }}
              className="lg:col-span-5 bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4 self-start"
            >
              <h2 className="font-serif-display text-2xl font-semibold">
                Create New Category
              </h2>
              <div>
                <label className="block text-xs font-semibold mb-1">Category Title *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Botanical Embroidery"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Display Order</label>
                <input
                  type="number"
                  value={catOrder}
                  onChange={(e) => setCatOrder(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs font-mono-tabular"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
              >
                Save Category
              </button>
            </form>
          </div>
        )}

        {/* 6. INVENTORY MANAGEMENT & MOVEMENT LOGS */}
        {currentPage === 'admin-inventory' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
              <h2 className="font-serif-display text-2xl font-semibold">
                Live Stock Levels & Quick Restock
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#453832]/15 text-[#6E5D54]">
                      <th className="py-2.5">SKU</th>
                      <th className="py-2.5">Product Name</th>
                      <th className="py-2.5">Current Stock</th>
                      <th className="py-2.5 text-right">Quick Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#453832]/8">
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td className="py-2.5 font-mono-tabular">{p.sku}</td>
                        <td className="py-2.5 font-semibold">{p.name}</td>
                        <td className="py-2.5 font-mono-tabular font-bold">
                          <span className={p.stock <= 8 ? 'text-[#B94A48]' : 'text-[#5A7252]'}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-2.5 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() =>
                              adminAdjustInventory(p.id, 5, 'Manual Restock')
                            }
                            className="px-2.5 py-1 rounded bg-[#453832] text-[#FFF9F0] font-mono-tabular"
                          >
                            +5 Restock
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              adminAdjustInventory(p.id, -1, 'Admin Adjustment')
                            }
                            className="px-2.5 py-1 rounded border border-[#453832]/20 font-mono-tabular"
                          >
                            −1 Adjust
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
              <h2 className="font-serif-display text-2xl font-semibold">
                Inventory Movement Ledger
              </h2>
              <div className="space-y-2 text-xs">
                {inventoryMovements.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-[#FFF9F0] flex flex-wrap items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-mono-tabular font-bold">{m.sku}</span> ·{' '}
                      <span className="font-semibold">{m.productName}</span> ({m.reason})
                    </div>
                    <div className="font-mono-tabular">
                      <span
                        className={
                          m.changeQuantity > 0
                            ? 'text-[#5A7252] font-bold'
                            : 'text-[#B94A48] font-bold'
                        }
                      >
                        {m.changeQuantity > 0 ? `+${m.changeQuantity}` : m.changeQuantity}
                      </span>{' '}
                      ({m.previousStock} → {m.newStock}) · {m.performedBy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. ORDER MANAGEMENT */}
        {currentPage === 'admin-orders' && (
          <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-[#453832]/45 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search order #, customer, city..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs font-medium"
              >
                <option value="all">All Order Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#453832]/15 text-[#6E5D54]">
                    <th className="py-3">Order #</th>
                    <th className="py-3">Date</th>
                    <th className="py-3">Customer</th>
                    <th className="py-3">City</th>
                    <th className="py-3">Order Status</th>
                    <th className="py-3">Payment Status</th>
                    <th className="py-3 text-right">Total</th>
                    <th className="py-3 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#453832]/8">
                  {orders
                    .filter((o) => {
                      if (
                        orderStatusFilter !== 'all' &&
                        o.orderStatus !== orderStatusFilter
                      )
                        return false;
                      if (orderSearch.trim()) {
                        const q = orderSearch.toLowerCase();
                        return (
                          o.orderNumber.toLowerCase().includes(q) ||
                          o.customerName.toLowerCase().includes(q) ||
                          o.shippingAddress.city.toLowerCase().includes(q)
                        );
                      }
                      return true;
                    })
                    .map((ord) => (
                      <tr key={ord.id}>
                        <td className="py-3 font-mono-tabular font-bold">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3 tabular-nums">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 font-medium">{ord.customerName}</td>
                        <td className="py-3">{ord.shippingAddress.city}</td>
                        <td className="py-3 font-semibold">{ord.orderStatus}</td>
                        <td className="py-3">{ord.paymentStatus}</td>
                        <td className="py-3 text-right font-mono-tabular font-bold">
                          PKR {ord.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              navigate('admin-order-details', { orderId: ord.id })
                            }
                            className="px-3 py-1.5 rounded-lg bg-[#453832] text-[#FFF9F0] font-semibold"
                          >
                            Inspect / Update
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. ADMIN ORDER DETAILS & STATUS WORKFLOW */}
        {currentPage === 'admin-order-details' && activeAdminOrder && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#453832]/10 pb-4">
                <div>
                  <p className="text-xs text-[#6E5D54]">Demo Test Order Record</p>
                  <h2 className="font-serif-display text-3xl font-semibold">
                    {activeAdminOrder.orderNumber}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('admin-orders')}
                  className="text-xs font-semibold underline"
                >
                  ← Back to All Orders
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#FFF9F0] space-y-1">
                  <p className="font-semibold">Customer & Contact</p>
                  <p>{activeAdminOrder.customerName}</p>
                  <p>{activeAdminOrder.customerEmail}</p>
                  <p>{activeAdminOrder.customerPhone}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FFF9F0] space-y-1">
                  <p className="font-semibold">Delivery Address</p>
                  <p>
                    {activeAdminOrder.shippingAddress.houseBuilding},{' '}
                    {activeAdminOrder.shippingAddress.street}
                  </p>
                  <p>
                    {activeAdminOrder.shippingAddress.area},{' '}
                    {activeAdminOrder.shippingAddress.city} (
                    {activeAdminOrder.shippingAddress.province})
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif-display text-xl font-semibold">
                  Order Items & Customizations
                </h3>
                {activeAdminOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-[#453832]/10 space-y-2 text-xs"
                  >
                    <div className="flex justify-between font-semibold">
                      <span>
                        {item.productName} ({item.variantName || 'Standard'}) ×{' '}
                        {item.quantity}
                      </span>
                      <span className="font-mono-tabular">
                        PKR {item.lineTotal.toLocaleString()}
                      </span>
                    </div>
                    {item.customization?.isCustomGift && (
                      <div className="p-3 rounded-lg bg-[#F7E7E7]/60 space-y-1">
                        <p className="font-semibold">
                          Bespoke Gift for: {item.customization.recipientName}
                        </p>
                        <p>Inscription: {item.customization.personalMessage}</p>
                        <p>Wrapping: {item.customization.wrappingStyle}</p>
                        <p className="italic">
                          Card Message: “{item.customization.giftCardMessage}”
                        </p>
                        {item.customization.specialInstructions && (
                          <p>Artisan Note: {item.customization.specialInstructions}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-5 self-start">
              <h3 className="font-serif-display text-2xl font-semibold">
                Update Order & Payment Status
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Transition Order Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        'Pending',
                        'Confirmed',
                        'Processing',
                        'Shipped',
                        'Delivered',
                        'Cancelled',
                      ] as OrderStatus[]
                    ).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() =>
                          adminUpdateOrderStatus(
                            activeAdminOrder.id,
                            st,
                            activeAdminOrder.paymentStatus,
                            statusUpdateNote
                          )
                        }
                        className={`py-2 px-3 rounded-lg border font-semibold ${
                          activeAdminOrder.orderStatus === st
                            ? 'bg-[#453832] text-[#FFF9F0] border-[#453832]'
                            : 'bg-[#FFF9F0] border-[#453832]/15'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Payment Status</label>
                  <select
                    value={activeAdminOrder.paymentStatus}
                    onChange={(e) =>
                      adminUpdateOrderStatus(
                        activeAdminOrder.id,
                        activeAdminOrder.orderStatus,
                        e.target.value as PaymentStatus,
                        'Updated payment status'
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#453832]/20 bg-[#FFF9F0]"
                  >
                    <option value="Pending (COD)">Pending (COD)</option>
                    <option value="Paid (Demo)">Paid (Demo)</option>
                    <option value="Refunded">Refunded</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Status Log Note</label>
                  <input
                    type="text"
                    value={statusUpdateNote}
                    onChange={(e) => setStatusUpdateNote(e.target.value)}
                    placeholder="Optional courier tracking or studio note..."
                    className="w-full px-3 py-2 rounded-lg border border-[#453832]/20 bg-[#FFF9F0]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. CUSTOMER MANAGEMENT */}
        {currentPage === 'admin-customers' && (
          <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
            <h2 className="font-serif-display text-2xl font-semibold">
              Registered Customer Accounts ({customerAccounts.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#453832]/15 text-[#6E5D54]">
                    <th className="py-3">Customer Name</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Phone</th>
                    <th className="py-3">Orders</th>
                    <th className="py-3">Account Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#453832]/8">
                  {customerAccounts.map((cust) => {
                    const custOrders = orders.filter((o) => o.userId === cust.id);
                    return (
                      <tr key={cust.id}>
                        <td className="py-3 font-semibold">{cust.fullName}</td>
                        <td className="py-3">{cust.email}</td>
                        <td className="py-3 font-mono-tabular">{cust.phone}</td>
                        <td className="py-3 font-mono-tabular">{custOrders.length} orders</td>
                        <td className="py-3">
                          <button
                            type="button"
                            onClick={() => adminToggleUserActive(cust.id)}
                            className="underline font-semibold"
                          >
                            {cust.isActive ? 'Active' : 'Suspended'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 10. COUPONS & DISCOUNTS */}
        {currentPage === 'admin-coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
              <h2 className="font-serif-display text-2xl font-semibold">
                Promotional Coupons
              </h2>
              <div className="space-y-3 text-xs">
                {coupons.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-[#FFF9F0] border border-[#453832]/10 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-mono-tabular text-sm font-bold text-[#453832]">
                        {c.code}{' '}
                        <span className="font-sans font-normal text-[#6E5D54]">
                          ({c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `PKR ${c.discountValue} OFF`})
                        </span>
                      </p>
                      <p className="text-[#453832]/75">{c.description}</p>
                      <p className="text-[11px] text-[#6E5D54] font-mono-tabular mt-1">
                        Min Order: PKR {c.minOrderValue} · Used: {c.usedCount}/{c.usageLimit}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => adminToggleCoupon(c.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold ${
                        c.isActive
                          ? 'bg-[#453832] text-[#FFF9F0]'
                          : 'bg-[#F7E7E7] text-[#453832]'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!cpnCode.trim()) return;
                adminSaveCoupon({
                  code: cpnCode.trim().toUpperCase(),
                  description: cpnDesc || 'Studio promotional code',
                  discountType: cpnType,
                  discountValue: Number(cpnValue),
                  minOrderValue: Number(cpnMinOrder),
                  expiryDate: '2027-12-31',
                  usageLimit: 100,
                  isActive: true,
                });
                setCpnCode('');
                setCpnDesc('');
              }}
              className="lg:col-span-5 bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4 self-start"
            >
              <h2 className="font-serif-display text-2xl font-semibold">Create Coupon</h2>
              <div>
                <label className="block text-xs font-semibold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={cpnCode}
                  onChange={(e) => setCpnCode(e.target.value)}
                  placeholder="FESTIVE20"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs font-mono-tabular uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Type</label>
                  <select
                    value={cpnType}
                    onChange={(e) =>
                      setCpnType(e.target.value as 'percentage' | 'fixed')
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed PKR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Value</label>
                  <input
                    type="number"
                    value={cpnValue}
                    onChange={(e) => setCpnValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs font-mono-tabular"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Minimum Order Value (PKR)
                </label>
                <input
                  type="number"
                  value={cpnMinOrder}
                  onChange={(e) => setCpnMinOrder(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs font-mono-tabular"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={cpnDesc}
                  onChange={(e) => setCpnDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
              >
                Create Coupon Code
              </button>
            </form>
          </div>
        )}

        {/* 11. HOMEPAGE BANNER MANAGEMENT */}
        {currentPage === 'admin-banners' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              adminUpdateSettings(bannerForm, 'Homepage Hero & Announcement Banner');
            }}
            className="bg-white rounded-2xl border border-[#453832]/10 p-6 sm:p-8 space-y-5 max-w-3xl"
          >
            <h2 className="font-serif-display text-2xl font-semibold">
              Manage Announcement Bar & Hero Section
            </h2>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={bannerForm.announcementEnabled}
                onChange={(e) =>
                  setBannerForm({ ...bannerForm, announcementEnabled: e.target.checked })
                }
                className="accent-[#453832]"
              />
              <span>Display Top Announcement Bar on Storefront</span>
            </label>
            <div>
              <label className="block text-xs font-semibold mb-1">Announcement Text</label>
              <input
                type="text"
                value={bannerForm.announcementText}
                onChange={(e) =>
                  setBannerForm({ ...bannerForm, announcementText: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Hero Headline</label>
              <input
                type="text"
                value={bannerForm.heroHeadline}
                onChange={(e) =>
                  setBannerForm({ ...bannerForm, heroHeadline: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Hero Subheadline</label>
              <textarea
                rows={2}
                value={bannerForm.heroSubheadline}
                onChange={(e) =>
                  setBannerForm({ ...bannerForm, heroSubheadline: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
            >
              Publish Banner Updates to Storefront
            </button>
          </form>
        )}

        {/* 12. WEBSITE CONTENT MANAGEMENT */}
        {currentPage === 'admin-content' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              adminUpdateSettings(contentForm, 'Storefront Editorial Content');
            }}
            className="bg-white rounded-2xl border border-[#453832]/10 p-6 sm:p-8 space-y-5 max-w-3xl"
          >
            <h2 className="font-serif-display text-2xl font-semibold">
              Manage Editorial Copy & Brand Story
            </h2>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Featured Collection Heading
              </label>
              <input
                type="text"
                value={contentForm.featuredCollectionTitle}
                onChange={(e) =>
                  setContentForm({
                    ...contentForm,
                    featuredCollectionTitle: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Featured Collection Subtitle
              </label>
              <textarea
                rows={2}
                value={contentForm.featuredCollectionSubtitle}
                onChange={(e) =>
                  setContentForm({
                    ...contentForm,
                    featuredCollectionSubtitle: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Brand Story Headline</label>
              <input
                type="text"
                value={contentForm.brandStoryHeadline}
                onChange={(e) =>
                  setContentForm({ ...contentForm, brandStoryHeadline: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Brand Story Narrative</label>
              <textarea
                rows={4}
                value={contentForm.brandStoryBody}
                onChange={(e) =>
                  setContentForm({ ...contentForm, brandStoryBody: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
            >
              Save Editorial Content
            </button>
          </form>
        )}

        {/* 13. REVIEWS MANAGEMENT */}
        {currentPage === 'admin-reviews' && (
          <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
            <h2 className="font-serif-display text-2xl font-semibold">
              Customer Review Moderation ({reviews.length})
            </h2>
            <div className="space-y-3 text-xs">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-[#FFF9F0] border border-[#453832]/10 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="max-w-2xl space-y-1">
                    <p className="font-semibold text-[#453832]">
                      {rev.productName} · {rev.rating}★ by {rev.customerName} (Status:{' '}
                      <span className="uppercase">{rev.status}</span>)
                    </p>
                    <p className="font-serif-display text-base font-semibold">“{rev.title}”</p>
                    <p className="text-[#453832]/80">{rev.comment}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => adminModerateReview(rev.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg bg-[#453832] text-[#FFF9F0] font-semibold"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => adminModerateReview(rev.id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg border border-[#B94A48]/30 text-[#B94A48]"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 14. CUSTOMER MESSAGES */}
        {currentPage === 'admin-messages' && (
          <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
            <h2 className="font-serif-display text-2xl font-semibold">
              Customer Concierge Inbox ({messages.length})
            </h2>
            <div className="space-y-3 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-5 rounded-xl bg-[#FFF9F0] border border-[#453832]/10 space-y-2"
                >
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="font-semibold text-sm text-[#453832]">
                      {msg.subject} — {msg.name} ({msg.email})
                    </p>
                    <span className="uppercase font-mono-tabular font-bold text-[#6E5D54]">
                      {msg.status}
                    </span>
                  </div>
                  <p className="text-[#453832]/80 leading-relaxed">{msg.message}</p>
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => adminUpdateMessageStatus(msg.id, 'replied')}
                      className="px-3 py-1.5 rounded-lg bg-[#453832] text-[#FFF9F0] font-semibold"
                    >
                      Mark as Replied
                    </button>
                    <button
                      type="button"
                      onClick={() => adminUpdateMessageStatus(msg.id, 'read')}
                      className="px-3 py-1.5 rounded-lg border border-[#453832]/20"
                    >
                      Mark Read
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 15. SALES REPORTS & ANALYTICS */}
        {currentPage === 'admin-reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif-display text-2xl font-semibold">
                    Monthly & Daily Sales Performance (Demo Data)
                  </h2>
                  <p className="text-xs text-[#6E5D54]">
                    All figures calculated from database orders in PKR.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportOrdersCsv}
                  className="px-4 py-2 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full CSV</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-4 rounded-xl bg-[#FFF9F0]">
                  <p className="text-[#6E5D54]">Gross Merchandise Value</p>
                  <p className="font-mono-tabular text-2xl font-bold text-[#453832] mt-1">
                    PKR {totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#FFF9F0]">
                  <p className="text-[#6E5D54]">Custom Gift Builder Attachment Rate</p>
                  <p className="font-mono-tabular text-2xl font-bold text-[#453832] mt-1">
                    50.0%
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#FFF9F0]">
                  <p className="text-[#6E5D54]">Active Coupon Redemptions</p>
                  <p className="font-mono-tabular text-2xl font-bold text-[#453832] mt-1">
                    {coupons.reduce((a, c) => a + c.usedCount, 0)} Uses
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 16. SHIPPING SETTINGS */}
        {currentPage === 'admin-shipping' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              adminUpdateSettings(shippingForm, 'Shipping & Delivery Settings');
            }}
            className="bg-white rounded-2xl border border-[#453832]/10 p-6 sm:p-8 space-y-4 max-w-2xl"
          >
            <h2 className="font-serif-display text-2xl font-semibold">
              Shipping Rates & Free Delivery Threshold
            </h2>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Standard Flat Shipping Fee (PKR)
              </label>
              <input
                type="number"
                value={shippingForm.standardShippingFee}
                onChange={(e) =>
                  setShippingForm({
                    ...shippingForm,
                    standardShippingFee: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Complimentary Shipping Threshold (PKR)
              </label>
              <input
                type="number"
                value={shippingForm.freeShippingThreshold}
                onChange={(e) =>
                  setShippingForm({
                    ...shippingForm,
                    freeShippingThreshold: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Estimated Delivery Timeline Notice
              </label>
              <input
                type="text"
                value={shippingForm.estimatedDeliveryDays}
                onChange={(e) =>
                  setShippingForm({
                    ...shippingForm,
                    estimatedDeliveryDays: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
            >
              Save Shipping Configuration
            </button>
          </form>
        )}

        {/* 17. PAYMENT SETTINGS */}
        {currentPage === 'admin-payments' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              adminUpdateSettings(paymentForm, 'Payment Gateway Settings');
            }}
            className="bg-white rounded-2xl border border-[#453832]/10 p-6 sm:p-8 space-y-4 max-w-2xl"
          >
            <h2 className="font-serif-display text-2xl font-semibold">
              Payment Methods Configuration
            </h2>
            <label className="flex items-center gap-2 text-xs font-semibold">
              <input
                type="checkbox"
                checked={paymentForm.codEnabled}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, codEnabled: e.target.checked })
                }
                className="accent-[#453832]"
              />
              <span>Enable Cash on Delivery (COD — Demo Mode)</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold">
              <input
                type="checkbox"
                checked={paymentForm.onlinePaymentDemoEnabled}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    onlinePaymentDemoEnabled: e.target.checked,
                  })
                }
                className="accent-[#453832]"
              />
              <span>Enable Direct Bank / Raast Transfer Instructions</span>
            </label>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Bank Transfer Instructions Shown at Checkout
              </label>
              <textarea
                rows={3}
                value={paymentForm.bankAccountDetails}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    bankAccountDetails: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
            >
              Save Payment Settings
            </button>
          </form>
        )}

        {/* 18. ADMIN USERS & ROLES */}
        {currentPage === 'admin-users' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
              <h2 className="font-serif-display text-2xl font-semibold">
                Studio Staff & Role Permissions
              </h2>
              <div className="space-y-3 text-xs">
                {users
                  .filter((u) => u.role !== 'customer')
                  .map((staff) => (
                    <div
                      key={staff.id}
                      className="p-4 rounded-xl bg-[#FFF9F0] border border-[#453832]/10 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-[#453832]">{staff.fullName}</p>
                        <p className="text-[#6E5D54]">{staff.email}</p>
                      </div>
                      <span className="uppercase font-mono-tabular font-bold px-3 py-1 rounded bg-[#F7E7E7]">
                        {staff.role}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!staffName.trim() || !staffEmail.trim()) return;
                adminSaveStaffUser(staffName, staffEmail, staffPhone, staffRole);
                setStaffName('');
                setStaffEmail('');
              }}
              className="lg:col-span-5 bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4 self-start"
            >
              <h2 className="font-serif-display text-2xl font-semibold">
                Add Staff Member
              </h2>
              <input
                type="text"
                required
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="Staff Full Name *"
                className="w-full px-3.5 py-2 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              />
              <input
                type="email"
                required
                value={staffEmail}
                onChange={(e) => setStaffEmail(e.target.value)}
                placeholder="Staff Email *"
                className="w-full px-3.5 py-2 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              />
              <select
                value={staffRole}
                onChange={(e) =>
                  setStaffRole(e.target.value as 'admin' | 'manager' | 'editor')
                }
                className="w-full px-3.5 py-2 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              >
                <option value="admin">Admin (Full Access)</option>
                <option value="manager">Manager (Orders & Inventory)</option>
                <option value="editor">Editor (Catalog & Content)</option>
              </select>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
              >
                Provision Role Account
              </button>
            </form>
          </div>
        )}

        {/* 19. STORE SETTINGS */}
        {currentPage === 'admin-settings' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              adminUpdateSettings(storeInfoForm, 'General Store Settings');
            }}
            className="bg-white rounded-2xl border border-[#453832]/10 p-6 sm:p-8 space-y-4 max-w-3xl"
          >
            <h2 className="font-serif-display text-2xl font-semibold">
              General Boutique Identity & Contact Settings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Store Name</label>
                <input
                  type="text"
                  value={storeInfoForm.storeName}
                  onChange={(e) =>
                    setStoreInfoForm({ ...storeInfoForm, storeName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={storeInfoForm.tagline}
                  onChange={(e) =>
                    setStoreInfoForm({ ...storeInfoForm, tagline: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Concierge Email</label>
                <input
                  type="email"
                  value={storeInfoForm.supportEmail}
                  onChange={(e) =>
                    setStoreInfoForm({ ...storeInfoForm, supportEmail: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Support Phone</label>
                <input
                  type="text"
                  value={storeInfoForm.supportPhone}
                  onChange={(e) =>
                    setStoreInfoForm({ ...storeInfoForm, supportPhone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Studio Address</label>
              <input
                type="text"
                value={storeInfoForm.studioAddress}
                onChange={(e) =>
                  setStoreInfoForm({ ...storeInfoForm, studioAddress: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
            >
              Save Store Settings
            </button>
          </form>
        )}

        {/* 20. AUDIT LOGS */}
        {currentPage === 'admin-audit-logs' && (
          <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
            <h2 className="font-serif-display text-2xl font-semibold">
              Security & Admin Audit Trail ({auditLogs.length})
            </h2>
            <div className="space-y-2.5 text-xs">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-[#FFF9F0] border border-[#453832]/10 flex flex-wrap items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-semibold text-[#453832]">{log.action}</span> ·{' '}
                    <span className="text-[#6E5D54]">
                      [{log.entityType}: {log.entityId}]
                    </span>
                    <p className="text-[#453832]/80 mt-0.5">{log.details}</p>
                  </div>
                  <div className="text-right text-[11px] text-[#6E5D54] font-mono-tabular">
                    <p>
                      {log.actorName} ({log.actorRole})
                    </p>
                    <p>{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
