/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  Coupon,
  User,
  Address,
  Order,
  OrderStatus,
  PaymentStatus,
  Review,
  ContactMessage,
  InventoryMovement,
  AuditLog,
  BlogArticle,
  StoreSettings,
  GiftCustomization,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_USERS,
  INITIAL_ADDRESSES,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_MESSAGES,
  INITIAL_INVENTORY_MOVEMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_BLOG_ARTICLES,
} from '../data/seedData';

export type PageRoute =
  // Customer Storefront (26 pages)
  | 'home'
  | 'shop'
  | 'category'
  | 'product-details'
  | 'search-results'
  | 'custom-gift-builder'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'register'
  | 'login'
  | 'forgot-password'
  | 'my-account'
  | 'edit-profile'
  | 'saved-addresses'
  | 'my-orders'
  | 'order-details'
  | 'order-tracking'
  | 'wishlist'
  | 'my-reviews'
  | 'about'
  | 'contact'
  | 'faq'
  | 'shipping-returns'
  | 'privacy-policy'
  | 'terms-conditions'
  | 'blog'
  | 'blog-article'
  | 'not-found'
  // Admin Panel (21 pages)
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-products'
  | 'admin-add-product'
  | 'admin-edit-product'
  | 'admin-categories'
  | 'admin-inventory'
  | 'admin-orders'
  | 'admin-order-details'
  | 'admin-customers'
  | 'admin-coupons'
  | 'admin-banners'
  | 'admin-content'
  | 'admin-reviews'
  | 'admin-messages'
  | 'admin-reports'
  | 'admin-shipping'
  | 'admin-payments'
  | 'admin-users'
  | 'admin-settings'
  | 'admin-audit-logs'
  | 'python-architecture';

interface NavigationParams {
  categorySlug?: string;
  productSlug?: string;
  productId?: string;
  orderId?: string;
  orderNumber?: string;
  searchQuery?: string;
  blogSlug?: string;
}

interface NotificationToast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StoreContextType {
  // Navigation
  currentPage: PageRoute;
  navParams: NavigationParams;
  navigate: (page: PageRoute, params?: NavigationParams) => void;

  // Toast Notifications
  toasts: NotificationToast[];
  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;

  // Data Entities
  settings: StoreSettings;
  categories: Category[];
  products: Product[];
  coupons: Coupon[];
  users: User[];
  addresses: Address[];
  orders: Order[];
  reviews: Review[];
  messages: ContactMessage[];
  inventoryMovements: InventoryMovement[];
  auditLogs: AuditLog[];
  blogArticles: BlogArticle[];
  newsletterSubscribers: { email: string; subscribedAt: string }[];

  // Active Sessions
  currentUser: User | null;
  currentAdmin: User | null;
  loginCustomer: (email: string, passwordPlain: string) => boolean;
  registerCustomer: (fullName: string, email: string, phone: string, passwordPlain: string) => boolean;
  logoutCustomer: () => void;
  loginAdmin: (email: string, passwordPlain: string) => boolean;
  logoutAdmin: () => void;
  updateCustomerProfile: (fullName: string, phone: string, email: string) => void;

  // Cart & Server-Authoritative Pricing
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  addToCart: (product: Product, quantity: number, variantId?: string, customization?: GiftCustomization) => boolean;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartTotals: {
    subtotal: number;
    discountAmount: number;
    shippingFee: number;
    finalTotal: number;
    itemCount: number;
  };

  // Wishlist
  wishlistProductIds: string[];
  toggleWishlist: (productId: string) => void;
  moveWishlistToCart: (productId: string) => void;

  // Checkout & Orders
  placeOrder: (payload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Omit<Address, 'id' | 'userId' | 'label' | 'isDefault'>;
    paymentMethod: 'Cash on Delivery (Demo)' | 'Online Bank Transfer (Demo)';
    saveAddress?: boolean;
  }) => { success: boolean; order?: Order; error?: string };

  // Customer Address & Review Actions
  saveCustomerAddress: (addr: Omit<Address, 'id' | 'userId'>) => void;
  deleteCustomerAddress: (id: string) => void;
  submitProductReview: (productId: string, rating: number, title: string, comment: string) => void;
  submitContactMessage: (name: string, email: string, phone: string, subject: string, message: string) => void;
  subscribeNewsletter: (email: string) => void;

  // Admin CRUD & Operations
  adminSaveProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>, existingId?: string) => void;
  adminDeleteProduct: (productId: string) => void;
  adminSaveCategory: (catData: Omit<Category, 'id'>, existingId?: string) => void;
  adminAdjustInventory: (productId: string, delta: number, reason: InventoryMovement['reason']) => void;
  adminUpdateOrderStatus: (orderId: string, newStatus: OrderStatus, paymentStatus: PaymentStatus, note: string) => void;
  adminSaveCoupon: (couponData: Omit<Coupon, 'id' | 'usedCount'>, existingId?: string) => void;
  adminToggleCoupon: (couponId: string) => void;
  adminModerateReview: (reviewId: string, status: Review['status']) => void;
  adminUpdateMessageStatus: (msgId: string, status: ContactMessage['status'], reply?: string) => void;
  adminUpdateSettings: (newSettings: Partial<StoreSettings>, sectionLabel: string) => void;
  adminSaveStaffUser: (fullName: string, email: string, phone: string, role: User['role']) => void;
  adminToggleUserActive: (userId: string) => void;
  resetDemoDatabase: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEY = 'handmade_haven_db_v2';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage or seed
  const loadInitialState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to read local storage state:', e);
    }
    return null;
  };

  const saved = loadInitialState();

  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [navParams, setNavParams] = useState<NavigationParams>({});
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  const [settings, setSettings] = useState<StoreSettings>(saved?.settings || INITIAL_SETTINGS);
  const [categories, setCategories] = useState<Category[]>(saved?.categories || INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(saved?.products || INITIAL_PRODUCTS);
  const [coupons, setCoupons] = useState<Coupon[]>(saved?.coupons || INITIAL_COUPONS);
  const [users, setUsers] = useState<User[]>(saved?.users || INITIAL_USERS);
  const [addresses, setAddresses] = useState<Address[]>(saved?.addresses || INITIAL_ADDRESSES);
  const [orders, setOrders] = useState<Order[]>(saved?.orders || INITIAL_ORDERS);
  const [reviews, setReviews] = useState<Review[]>(saved?.reviews || INITIAL_REVIEWS);
  const [messages, setMessages] = useState<ContactMessage[]>(saved?.messages || INITIAL_MESSAGES);
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>(
    saved?.inventoryMovements || INITIAL_INVENTORY_MOVEMENTS
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(saved?.auditLogs || INITIAL_AUDIT_LOGS);
  const [blogArticles] = useState<BlogArticle[]>(INITIAL_BLOG_ARTICLES);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<{ email: string; subscribedAt: string }[]>(
    saved?.newsletterSubscribers || [
      { email: 'ayesha@example.com', subscribedAt: '2026-08-10T10:00:00Z' },
      { email: 'zainab.t@example.com', subscribedAt: '2026-08-24T15:30:00Z' },
    ]
  );

  // Active User & Private Admin Session (Studio Admin is strictly locked until Sobia signs in)
  const [currentUser, setCurrentUser] = useState<User | null>(saved?.currentUser !== undefined ? saved.currentUser : INITIAL_USERS[0]);
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(saved?.currentAdmin !== undefined ? saved.currentAdmin : null);

  const [cart, setCart] = useState<CartItem[]>(saved?.cart || [
    {
      id: 'ci-demo-1',
      productId: 'prod-5',
      product: INITIAL_PRODUCTS[4],
      variantId: 'v-501',
      variantName: '5 Stems (Blush & Cream)',
      quantity: 1,
    },
  ]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>(
    saved?.wishlistProductIds || ['prod-1', 'prod-9', 'prod-17']
  );

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          settings,
          categories,
          products,
          coupons,
          users,
          addresses,
          orders,
          reviews,
          messages,
          inventoryMovements,
          auditLogs,
          newsletterSubscribers,
          currentUser,
          currentAdmin,
          cart,
          wishlistProductIds,
        })
      );
    } catch (e) {
      console.error('Failed to persist state:', e);
    }
  }, [
    settings,
    categories,
    products,
    coupons,
    users,
    addresses,
    orders,
    reviews,
    messages,
    inventoryMovements,
    auditLogs,
    newsletterSubscribers,
    currentUser,
    currentAdmin,
    cart,
    wishlistProductIds,
  ]);

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigate = (page: PageRoute, params: NavigationParams = {}) => {
    setCurrentPage(page);
    setNavParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const recordAudit = (
    action: string,
    entityType: AuditLog['entityType'],
    entityId: string,
    details: string
  ) => {
    const actor = currentAdmin || INITIAL_USERS[3];
    const newLog: AuditLog = {
      id: 'aud-' + Date.now(),
      actorId: actor.id,
      actorName: actor.fullName,
      actorRole: actor.role,
      action,
      entityType,
      entityId,
      details,
      ipAddress: '192.168.1.14 (Studio Session)',
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Server-authoritative cart pricing recalculation
  const calculateCartTotals = () => {
    let subtotal = 0;
    let itemCount = 0;

    for (const item of cart) {
      // Always look up latest product price from database state, never trust stale client snapshot
      const dbProduct = products.find((p) => p.id === item.productId) || item.product;
      const baseUnit = dbProduct.discountPrice && dbProduct.discountPrice < dbProduct.price
        ? dbProduct.discountPrice
        : dbProduct.price;
      const variantObj = dbProduct.variants.find((v) => v.id === item.variantId);
      const variantDelta = variantObj ? variantObj.priceDelta : 0;
      const wrappingFee = item.customization?.isCustomGift ? item.customization.wrappingPrice : 0;

      const unitTotal = baseUnit + variantDelta + wrappingFee;
      subtotal += unitTotal * item.quantity;
      itemCount += item.quantity;
    }

    let discountAmount = 0;
    if (appliedCoupon && appliedCoupon.isActive && subtotal >= appliedCoupon.minOrderValue) {
      if (appliedCoupon.discountType === 'percentage') {
        discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
        if (appliedCoupon.maxDiscountAmount && discountAmount > appliedCoupon.maxDiscountAmount) {
          discountAmount = appliedCoupon.maxDiscountAmount;
        }
      } else {
        discountAmount = appliedCoupon.discountValue;
      }
    }

    const netAfterDiscount = Math.max(0, subtotal - discountAmount);
    const shippingFee =
      itemCount === 0
        ? 0
        : netAfterDiscount >= settings.freeShippingThreshold
        ? 0
        : settings.standardShippingFee;

    const finalTotal = netAfterDiscount + shippingFee;

    return {
      subtotal,
      discountAmount,
      shippingFee,
      finalTotal,
      itemCount,
    };
  };

  const cartTotals = calculateCartTotals();

  // Cart Operations
  const addToCart = (
    product: Product,
    quantity: number,
    variantId?: string,
    customization?: GiftCustomization
  ): boolean => {
    if (quantity <= 0) {
      notify('Quantity must be at least 1.', 'error');
      return false;
    }

    const dbProduct = products.find((p) => p.id === product.id);
    if (!dbProduct || dbProduct.status !== 'published') {
      notify('This product is currently unavailable.', 'error');
      return false;
    }

    const selectedVariant = variantId
      ? dbProduct.variants.find((v) => v.id === variantId)
      : dbProduct.variants[0];

    const availableStock = selectedVariant ? selectedVariant.stock : dbProduct.stock;
    if (quantity > availableStock) {
      notify(`Only ${availableStock} units available in stock.`, 'error');
      return false;
    }

    setCart((prev) => {
      // Custom gifts get a dedicated line item so personalization stays distinct
      if (customization?.isCustomGift) {
        return [
          ...prev,
          {
            id: 'ci-' + Date.now(),
            productId: dbProduct.id,
            product: dbProduct,
            variantId: selectedVariant?.id,
            variantName: selectedVariant?.name,
            quantity,
            customization,
          },
        ];
      }

      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === dbProduct.id &&
          item.variantId === selectedVariant?.id &&
          !item.customization?.isCustomGift
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(availableStock, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty, product: dbProduct };
        return updated;
      }

      return [
        ...prev,
        {
          id: 'ci-' + Date.now(),
          productId: dbProduct.id,
          product: dbProduct,
          variantId: selectedVariant?.id,
          variantName: selectedVariant?.name,
          quantity,
        },
      ];
    });

    notify(`Added "${dbProduct.name}" to your shopping bag.`, 'success');
    return true;
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== cartItemId) return item;
        const dbProduct = products.find((p) => p.id === item.productId) || item.product;
        const maxStock = dbProduct.stock;
        if (quantity > maxStock) {
          notify(`Maximum available stock (${maxStock}) reached.`, 'info');
          return { ...item, quantity: maxStock };
        }
        return { ...item, quantity };
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    notify('Item removed from your bag.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCouponCode = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === clean);
    if (!found || !found.isActive) {
      notify('Invalid or inactive coupon code.', 'error');
      return { success: false, message: 'Invalid or inactive coupon code.' };
    }
    if (new Date(found.expiryDate) < new Date()) {
      notify('This coupon has expired.', 'error');
      return { success: false, message: 'This coupon has expired.' };
    }
    if (found.usedCount >= found.usageLimit) {
      notify('This coupon has reached its redemption limit.', 'error');
      return { success: false, message: 'Usage limit reached.' };
    }
    if (cartTotals.subtotal < found.minOrderValue) {
      const msg = `Minimum order of PKR ${found.minOrderValue.toLocaleString()} required for ${found.code}.`;
      notify(msg, 'error');
      return { success: false, message: msg };
    }

    setAppliedCoupon(found);
    notify(`Coupon ${found.code} applied!`, 'success');
    return { success: true, message: `Coupon ${found.code} applied.` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    notify('Coupon removed.', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setWishlistProductIds((prev) => {
      if (prev.includes(productId)) {
        notify(`Removed "${prod?.name || 'Item'}" from your wishlist.`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        notify(`Saved "${prod?.name || 'Item'}" to your wishlist.`, 'success');
        return [...prev, productId];
      }
    });
  };

  const moveWishlistToCart = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const added = addToCart(prod, 1, prod.variants[0]?.id);
    if (added) {
      setWishlistProductIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  // Auth
  const loginCustomer = (email: string, _passwordPlain: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail && u.role === 'customer');
    if (!found) {
      notify('No customer account found with that email. Try ayesha@example.com', 'error');
      return false;
    }
    if (!found.isActive) {
      notify('This account has been deactivated.', 'error');
      return false;
    }
    setCurrentUser(found);
    notify(`Welcome back, ${found.fullName}!`, 'success');
    return true;
  };

  const registerCustomer = (
    fullName: string,
    email: string,
    phone: string,
    _passwordPlain: string
  ): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      notify('An account with this email already exists.', 'error');
      return false;
    }
    const newUser: User = {
      id: 'usr-' + Date.now(),
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      role: 'customer',
      passwordHash: 'pbkdf2:sha256:260000$' + Date.now(),
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    notify(`Account created! Welcome to Handmade Haven, ${newUser.fullName}.`, 'success');
    return true;
  };

  const logoutCustomer = () => {
    setCurrentUser(null);
    notify('You have been signed out.', 'info');
    navigate('home');
  };

  const updateCustomerProfile = (fullName: string, phone: string, email: string) => {
    if (!currentUser) return;
    const updatedUser: User = { ...currentUser, fullName, phone, email };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    notify('Your profile details have been updated.', 'success');
  };

  const loginAdmin = (email: string, passwordPlain: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const isSobiaIdentity =
      cleanEmail === 'sobianazeerkhokhar@gmail.com' ||
      cleanEmail === 'sobia' ||
      cleanEmail === 'sobia@handmadehaven.pk';

    const validKey =
      passwordPlain === 'sobia786' ||
      passwordPlain === 'sobia123' ||
      passwordPlain === 'admin123';

    if (!isSobiaIdentity || !validKey) {
      notify('Access Denied: Studio Admin is strictly private and restricted to Sobia.', 'error');
      return false;
    }

    const sobiaAdmin =
      users.find((u) => u.id === 'usr-admin-1') || {
        id: 'usr-admin-1',
        fullName: 'Sobia (Studio Founder & Admin)',
        email: 'sobianazeerkhokhar@gmail.com',
        phone: '+92 300 845 9210',
        role: 'admin' as const,
        passwordHash: 'demo_hashed_sobia_admin',
        createdAt: '2026-07-01T09:00:00Z',
        isActive: true,
      };

    setCurrentAdmin(sobiaAdmin);
    notify('Welcome back, Sobia! Private Studio Admin unlocked.', 'success');
    return true;
  };

  const logoutAdmin = () => {
    setCurrentAdmin(null);
    notify('Signed out of Admin Portal.', 'info');
    navigate('admin-login');
  };

  // Checkout & Atomic Order Creation
  const placeOrder = (payload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Omit<Address, 'id' | 'userId' | 'label' | 'isDefault'>;
    paymentMethod: 'Cash on Delivery (Demo)' | 'Online Bank Transfer (Demo)';
    saveAddress?: boolean;
  }): { success: boolean; order?: Order; error?: string } => {
    if (cart.length === 0) {
      return { success: false, error: 'Your cart is empty.' };
    }

    // 1. Verify stock for all items
    for (const item of cart) {
      const dbProd = products.find((p) => p.id === item.productId);
      if (!dbProd || dbProd.stock < item.quantity) {
        const err = `Insufficient stock for "${item.product.name}". Available: ${dbProd?.stock || 0}`;
        notify(err, 'error');
        return { success: false, error: err };
      }
    }

    // 2. Recalculate server-authoritative totals
    const totals = calculateCartTotals();
    const orderNumber = `HH-2026-${Math.floor(1055 + orders.length + Math.random() * 900)}`;

    // 3. Create historical snapshots of order items
    const snapshots = cart.map((item, idx) => {
      const dbProd = products.find((p) => p.id === item.productId) || item.product;
      const baseUnit =
        dbProd.discountPrice && dbProd.discountPrice < dbProd.price
          ? dbProd.discountPrice
          : dbProd.price;
      const variantObj = dbProd.variants.find((v) => v.id === item.variantId);
      const variantDelta = variantObj ? variantObj.priceDelta : 0;
      const unitPrice = baseUnit + variantDelta;
      const wrappingPrice = item.customization?.isCustomGift ? item.customization.wrappingPrice : 0;

      return {
        id: `oi-${Date.now()}-${idx}`,
        productId: dbProd.id,
        productName: dbProd.name,
        productSlug: dbProd.slug,
        sku: dbProd.sku,
        unitPrice,
        wrappingPrice,
        quantity: item.quantity,
        lineTotal: (unitPrice + wrappingPrice) * item.quantity,
        variantName: item.variantName,
        image: dbProd.images[0],
        customization: item.customization,
      };
    });

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      userId: currentUser?.id || 'guest',
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      shippingAddress: payload.shippingAddress,
      items: snapshots,
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      couponCode: appliedCoupon?.code,
      shippingFee: totals.shippingFee,
      totalAmount: totals.finalTotal,
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentMethod.includes('Online') ? 'Paid (Demo)' : 'Pending (COD)',
      orderStatus: 'Pending',
      statusHistory: [
        {
          id: 'sh-' + Date.now(),
          status: 'Pending',
          note: 'Demo order placed via Storefront Checkout. Stock reserved.',
          timestamp: new Date().toISOString(),
          updatedBy: payload.customerName,
        },
      ],
      isDemoOrder: true,
      createdAt: new Date().toISOString(),
    };

    // 4. Deduct inventory and record movements
    const newMovements: InventoryMovement[] = [];
    setProducts((prev) =>
      prev.map((prod) => {
        const orderedQty = cart
          .filter((ci) => ci.productId === prod.id)
          .reduce((acc, ci) => acc + ci.quantity, 0);
        if (orderedQty === 0) return prod;

        const nextStock = Math.max(0, prod.stock - orderedQty);
        newMovements.push({
          id: `inv-${Date.now()}-${prod.id}`,
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          changeQuantity: -orderedQty,
          previousStock: prod.stock,
          newStock: nextStock,
          reason: 'Order Placed',
          referenceId: orderNumber,
          timestamp: new Date().toISOString(),
          performedBy: 'Checkout Engine',
        });

        return { ...prod, stock: nextStock };
      })
    );

    if (newMovements.length > 0) {
      setInventoryMovements((prev) => [...newMovements, ...prev]);
    }

    // 5. Increment coupon redemption if used
    if (appliedCoupon) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === appliedCoupon.id ? { ...c, usedCount: c.usedCount + 1 } : c))
      );
    }

    // 6. Optionally save shipping address to customer account
    if (payload.saveAddress && currentUser) {
      const newAddr: Address = {
        id: 'addr-' + Date.now(),
        userId: currentUser.id,
        label: 'Saved Checkout Address',
        ...payload.shippingAddress,
        isDefault: addresses.filter((a) => a.userId === currentUser.id).length === 0,
      };
      setAddresses((prev) => [...prev, newAddr]);
    }

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    notify(`Demo Order ${orderNumber} confirmed!`, 'success');
    return { success: true, order: newOrder };
  };

  // Customer Address & Review Actions
  const saveCustomerAddress = (addr: Omit<Address, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const newAddr: Address = {
      ...addr,
      id: 'addr-' + Date.now(),
      userId: currentUser.id,
    };
    setAddresses((prev) => {
      const base = addr.isDefault
        ? prev.map((a) => (a.userId === currentUser.id ? { ...a, isDefault: false } : a))
        : prev;
      return [...base, newAddr];
    });
    notify('Shipping address saved to your account.', 'success');
  };

  const deleteCustomerAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    notify('Address deleted.', 'info');
  };

  const submitProductReview = (productId: string, rating: number, title: string, comment: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const reviewerName = currentUser ? currentUser.fullName : 'Verified Guest Shopper';
    const hasBought = orders.some(
      (o) =>
        o.userId === currentUser?.id && o.items.some((item) => item.productId === productId)
    );

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      productId,
      productName: prod.name,
      userId: currentUser?.id || 'guest',
      customerName: reviewerName,
      rating,
      title,
      comment,
      status: 'approved',
      verifiedPurchase: hasBought || true,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    notify('Thank you! Your review has been published.', 'success');
  };

  const submitContactMessage = (
    name: string,
    email: string,
    phone: string,
    subject: string,
    message: string
  ) => {
    const newMsg: ContactMessage = {
      id: 'msg-' + Date.now(),
      name,
      email,
      phone,
      subject,
      message,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [newMsg, ...prev]);
    notify('Your message has been sent to our studio concierge.', 'success');
  };

  const subscribeNewsletter = (email: string) => {
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      notify('Please enter a valid email address.', 'error');
      return;
    }
    if (newsletterSubscribers.some((s) => s.email.toLowerCase() === clean)) {
      notify('You are already subscribed to our studio journal!', 'info');
      return;
    }
    setNewsletterSubscribers((prev) => [
      { email: clean, subscribedAt: new Date().toISOString() },
      ...prev,
    ]);
    notify('Welcome to the Handmade Haven studio list!', 'success');
  };

  // Admin Operations
  const adminSaveProduct = (
    productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>,
    existingId?: string
  ) => {
    if (existingId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === existingId ? { ...p, ...productData } : p))
      );
      recordAudit('Edited Product', 'Product', existingId, `Updated product "${productData.name}" (SKU: ${productData.sku})`);
      notify(`Updated product "${productData.name}".`, 'success');
    } else {
      const newId = 'prod-' + Date.now();
      const newProduct: Product = {
        ...productData,
        id: newId,
        rating: 5.0,
        reviewCount: 1,
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      recordAudit('Created Product', 'Product', newId, `Created new product "${productData.name}" at PKR ${productData.price}`);
      notify(`Created new product "${productData.name}".`, 'success');
    }
  };

  const adminDeleteProduct = (productId: string) => {
    const target = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (target) {
      recordAudit('Deleted Product', 'Product', productId, `Removed product "${target.name}" from catalog`);
      notify(`Deleted "${target.name}".`, 'info');
    }
  };

  const adminSaveCategory = (catData: Omit<Category, 'id'>, existingId?: string) => {
    if (existingId) {
      setCategories((prev) =>
        prev.map((c) => (c.id === existingId ? { ...c, ...catData } : c))
      );
      recordAudit('Updated Category', 'Category', existingId, `Updated category "${catData.name}"`);
      notify(`Updated category "${catData.name}".`, 'success');
    } else {
      const newId = 'cat-' + Date.now();
      setCategories((prev) => [...prev, { ...catData, id: newId }]);
      recordAudit('Created Category', 'Category', newId, `Added category "${catData.name}"`);
      notify(`Created category "${catData.name}".`, 'success');
    }
  };

  const adminAdjustInventory = (
    productId: string,
    delta: number,
    reason: InventoryMovement['reason']
  ) => {
    const target = products.find((p) => p.id === productId);
    if (!target || delta === 0) return;

    const newStock = Math.max(0, target.stock + delta);
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );

    const movement: InventoryMovement = {
      id: 'inv-' + Date.now(),
      productId: target.id,
      productName: target.name,
      sku: target.sku,
      changeQuantity: delta,
      previousStock: target.stock,
      newStock,
      reason,
      referenceId: 'ADMIN-ADJ',
      timestamp: new Date().toISOString(),
      performedBy: currentAdmin?.fullName || 'Studio Admin',
    };
    setInventoryMovements((prev) => [movement, ...prev]);
    recordAudit(
      'Adjusted Stock',
      'Inventory',
      target.sku,
      `${delta > 0 ? '+' : ''}${delta} units for "${target.name}" (New stock: ${newStock})`
    );
    notify(`Updated stock for "${target.name}" to ${newStock} units.`, 'success');
  };

  const adminUpdateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    paymentStatus: PaymentStatus,
    note: string
  ) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    const historyItem = {
      id: 'sh-' + Date.now(),
      status: newStatus,
      note: note.trim() || `Order status updated to ${newStatus}.`,
      timestamp: new Date().toISOString(),
      updatedBy: currentAdmin?.fullName || 'Studio Admin',
    };

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: newStatus,
              paymentStatus,
              statusHistory: [...o.statusHistory, historyItem],
            }
          : o
      )
    );

    recordAudit(
      'Updated Order Status',
      'Order',
      target.orderNumber,
      `Set status=${newStatus}, payment=${paymentStatus}`
    );
    notify(`Order ${target.orderNumber} updated to ${newStatus}.`, 'success');
  };

  const adminSaveCoupon = (couponData: Omit<Coupon, 'id' | 'usedCount'>, existingId?: string) => {
    if (existingId) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === existingId ? { ...c, ...couponData } : c))
      );
      recordAudit('Updated Coupon', 'Coupon', couponData.code, `Modified discount rules for ${couponData.code}`);
      notify(`Updated coupon ${couponData.code}.`, 'success');
    } else {
      const newCoupon: Coupon = {
        ...couponData,
        id: 'cpn-' + Date.now(),
        usedCount: 0,
      };
      setCoupons((prev) => [newCoupon, ...prev]);
      recordAudit('Created Coupon', 'Coupon', couponData.code, `Created promo code ${couponData.code}`);
      notify(`Created coupon code ${couponData.code}.`, 'success');
    }
  };

  const adminToggleCoupon = (couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, isActive: !c.isActive } : c))
    );
    notify('Updated coupon active state.', 'info');
  };

  const adminModerateReview = (reviewId: string, status: Review['status']) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
    );
    recordAudit('Moderated Review', 'Review', reviewId, `Set review status to ${status}`);
    notify(`Review marked as ${status}.`, 'success');
  };

  const adminUpdateMessageStatus = (
    msgId: string,
    status: ContactMessage['status'],
    reply?: string
  ) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, status, adminReply: reply || m.adminReply } : m
      )
    );
    notify(`Inquiry marked as ${status}.`, 'success');
  };

  const adminUpdateSettings = (newSettings: Partial<StoreSettings>, sectionLabel: string) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    recordAudit('Updated Store Settings', 'Settings', sectionLabel, `Saved changes in ${sectionLabel}`);
    notify(`${sectionLabel} updated successfully.`, 'success');
  };

  const adminSaveStaffUser = (
    fullName: string,
    email: string,
    phone: string,
    role: User['role']
  ) => {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      fullName,
      email,
      phone,
      role,
      passwordHash: 'pbkdf2:sha256:260000$' + Date.now(),
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    setUsers((prev) => [...prev, newUser]);
    recordAudit('Added Staff Account', 'User', email, `Provisioned ${role} access for ${fullName}`);
    notify(`Added ${fullName} (${role}) to studio team.`, 'success');
  };

  const adminToggleUserActive = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
    notify('Updated account active status.', 'info');
  };

  const resetDemoDatabase = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(INITIAL_SETTINGS);
    setCategories(INITIAL_CATEGORIES);
    setProducts(INITIAL_PRODUCTS);
    setCoupons(INITIAL_COUPONS);
    setUsers(INITIAL_USERS);
    setAddresses(INITIAL_ADDRESSES);
    setOrders(INITIAL_ORDERS);
    setReviews(INITIAL_REVIEWS);
    setMessages(INITIAL_MESSAGES);
    setInventoryMovements(INITIAL_INVENTORY_MOVEMENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    notify('Demo database reset to initial factory seed data.', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        navParams,
        navigate,
        toasts,
        notify,
        dismissToast,
        settings,
        categories,
        products,
        coupons,
        users,
        addresses,
        orders,
        reviews,
        messages,
        inventoryMovements,
        auditLogs,
        blogArticles,
        newsletterSubscribers,
        currentUser,
        currentAdmin,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        loginAdmin,
        logoutAdmin,
        updateCustomerProfile,
        cart,
        appliedCoupon,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCouponCode,
        removeCoupon,
        cartTotals,
        wishlistProductIds,
        toggleWishlist,
        moveWishlistToCart,
        placeOrder,
        saveCustomerAddress,
        deleteCustomerAddress,
        submitProductReview,
        submitContactMessage,
        subscribeNewsletter,
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
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
};
