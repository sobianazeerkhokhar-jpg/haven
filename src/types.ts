/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'style' | 'scent';
  value: string;
  priceDelta: number; // PKR integer delta
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  description: string;
  shortDescription: string;
  price: number; // PKR integer
  discountPrice?: number | null; // PKR integer
  images: string[];
  variants: ProductVariant[];
  materials: string;
  dimensions: string;
  careInstructions: string;
  stock: number;
  status: 'published' | 'draft' | 'archived';
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  allowCustomization: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
  isActive: boolean;
  productCount?: number;
}

export interface GiftCustomization {
  isCustomGift: boolean;
  recipientName: string;
  personalMessage: string;
  giftCardMessage: string;
  wrappingStyle: 'classic-cream-ribbon' | 'blush-botanical-wax' | 'sage-linen-keepsake';
  wrappingPrice: number;
  targetBudget: string;
  referenceImageName?: string;
  referenceImagePreview?: string;
  specialInstructions: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variantName?: string;
  quantity: number;
  customization?: GiftCustomization;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  eligibleCategoryId?: string | 'all';
  isActive: boolean;
}

export interface Address {
  id: string;
  userId: string;
  label: string; // e.g., "Home", "Studio"
  fullName: string;
  phone: string;
  houseBuilding: string;
  street: string;
  area: string;
  city: string;
  province: 'Punjab' | 'Sindh' | 'Islamabad Capital Territory' | 'Khyber Pakhtunkhwa' | 'Balochistan' | 'Gilgit-Baltistan' | 'Azad Kashmir';
  postalCode: string;
  deliveryInstructions?: string;
  isDefault: boolean;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending (COD)' | 'Paid (Demo)' | 'Refunded' | 'Failed';

export interface OrderItemSnapshot {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  sku: string;
  unitPrice: number;
  wrappingPrice: number;
  quantity: number;
  lineTotal: number;
  variantName?: string;
  image: string;
  customization?: GiftCustomization;
}

export interface OrderStatusHistoryItem {
  id: string;
  status: OrderStatus;
  note: string;
  timestamp: string;
  updatedBy: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Omit<Address, 'id' | 'userId' | 'label' | 'isDefault'>;
  items: OrderItemSnapshot[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'Cash on Delivery (Demo)' | 'Online Bank Transfer (Demo)';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  isDemoOrder: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  status: 'approved' | 'pending' | 'rejected';
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'manager' | 'editor';
  passwordHash: string; // Simulated hash in client/server state
  createdAt: string;
  isActive: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  adminReply?: string;
  createdAt: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  changeQuantity: number;
  previousStock: number;
  newStock: number;
  reason: 'Order Placed' | 'Manual Restock' | 'Admin Adjustment' | 'Order Cancelled';
  referenceId?: string;
  timestamp: string;
  performedBy: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: 'Product' | 'Category' | 'Order' | 'Coupon' | 'Settings' | 'Review' | 'User' | 'Inventory';
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  author: string;
  authorRole: string;
  category: string;
  readTime: string;
  publishedAt: string;
  image: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  announcementText: string;
  announcementEnabled: boolean;
  heroHeadline: string;
  heroSubheadline: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroBannerImage: string;
  supportEmail: string;
  supportPhone: string;
  studioAddress: string;
  workingHours: string;
  instagramUrl: string;
  pinterestUrl: string;
  whatsappNumber: string;
  currencyCode: string;
  standardShippingFee: number;
  freeShippingThreshold: number;
  estimatedDeliveryDays: string;
  codEnabled: boolean;
  onlinePaymentDemoEnabled: boolean;
  bankAccountDetails: string;
  featuredCollectionTitle: string;
  featuredCollectionSubtitle: string;
  brandStoryHeadline: string;
  brandStoryBody: string;
}
