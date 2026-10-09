/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Tag,
  CheckCircle2,
  Truck,
  ShieldCheck,
  User as UserIcon,
  MapPin,
  Package,
  Heart,
  Star,
  LogOut,
  Plus,
  Search,
  Clock,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ResilientImage } from '../components/ResilientImage';
import { Address, OrderStatus } from '../types';

// ============================================================================
// 5. SHOPPING CART PAGE
// ============================================================================
export const CartPage: React.FC = () => {
  const {
    cart,
    products,
    updateCartQuantity,
    removeFromCart,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    cartTotals,
    navigate,
    settings,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-[#F7E7E7] mx-auto flex items-center justify-center text-[#453832]">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h1 className="font-serif-display text-4xl font-semibold text-[#453832]">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-[#453832]/75 max-w-md mx-auto">
          Explore our handmade jewelry, everlasting crochet bouquets, soy candles, and bespoke
          gift boxes to fill your bag.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate('shop')}
            className="px-6 py-3 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
          >
            Continue Shopping
          </button>
          <button
            type="button"
            onClick={() => navigate('custom-gift-builder')}
            className="px-6 py-3 rounded-xl border border-[#453832]/20 bg-white text-xs font-semibold"
          >
            Build a Custom Gift
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <p className="text-xs text-[#6E5D54]">Server-Authoritative Cart Calculation</p>
        <h1 className="font-serif-display text-3xl sm:text-5xl font-semibold text-[#453832]">
          Your Shopping Bag ({cartTotals.itemCount} {cartTotals.itemCount === 1 ? 'Item' : 'Items'})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const dbProd = products.find((p) => p.id === item.productId) || item.product;
            const baseUnit =
              dbProd.discountPrice && dbProd.discountPrice < dbProd.price
                ? dbProd.discountPrice
                : dbProd.price;
            const variantDelta =
              dbProd.variants.find((v) => v.id === item.variantId)?.priceDelta || 0;
            const wrappingFee = item.customization?.isCustomGift
              ? item.customization.wrappingPrice
              : 0;
            const unitTotal = baseUnit + variantDelta + wrappingFee;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#453832]/10 p-5 flex flex-col sm:flex-row gap-5"
              >
                <div className="w-28 h-28 rounded-xl overflow-hidden bg-[#FFF9F0] shrink-0">
                  <ResilientImage
                    src={dbProd.images[0]}
                    alt={dbProd.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          navigate('product-details', {
                            productSlug: dbProd.slug,
                            productId: dbProd.id,
                          })
                        }
                        className="font-serif-display text-xl font-semibold text-[#453832] hover:text-[#7A8B71] text-left"
                      >
                        {dbProd.name}
                      </button>
                      <p className="text-xs text-[#6E5D54]">
                        {item.variantName || 'Standard Studio Edition'} · SKU: {dbProd.sku}
                      </p>
                    </div>
                    <p className="font-mono-tabular text-sm font-bold text-[#453832]">
                      PKR {(unitTotal * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  {/* Custom Gift Details Box */}
                  {item.customization?.isCustomGift && (
                    <div className="p-3 rounded-xl bg-[#F7E7E7]/50 border border-[#453832]/10 text-xs space-y-1">
                      <p className="font-semibold text-[#453832]">
                        Personalized Gift for: {item.customization.recipientName}
                      </p>
                      <p className="text-[#453832]/80">
                        Inscription: {item.customization.personalMessage}
                      </p>
                      <p className="text-[#453832]/80 italic">
                        Card Note: “{item.customization.giftCardMessage}”
                      </p>
                      {item.customization.wrappingPrice > 0 && (
                        <p className="text-[#6E5D54] font-mono-tabular">
                          Includes Bespoke Wrapping (+PKR {item.customization.wrappingPrice} / item)
                        </p>
                      )}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center border border-[#453832]/20 rounded-lg bg-[#FFF9F0]">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-xs font-semibold"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 text-xs font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-xs font-semibold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-[#B94A48] hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('shop')}
              className="text-xs font-semibold text-[#453832] underline underline-offset-4"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>

        {/* Order Summary & Coupon Sidebar */}
        <aside className="lg:col-span-4 bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-6">
          <h2 className="font-serif-display text-2xl font-semibold text-[#453832]">
            Order Summary
          </h2>

          {/* Coupon Form */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#453832]">
              Promotional Coupon Code
            </label>
            {appliedCoupon ? (
              <div className="p-3 rounded-xl bg-[#A8B5A0]/25 border border-[#453832]/15 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#453832]" />
                  <div>
                    <span className="font-mono-tabular font-bold">{appliedCoupon.code}</span>
                    <p className="text-[11px] text-[#453832]/75">{appliedCoupon.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-[#B94A48] font-semibold hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!couponInput.trim()) return;
                  applyCouponCode(couponInput);
                  setCouponInput('');
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Try HAVEN10 or GIFT500"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#453832]/20 bg-[#FFF9F0] uppercase font-mono-tabular"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Totals Breakdown */}
          <div className="border-t border-[#453832]/10 pt-4 space-y-2.5 text-xs tabular-nums">
            <div className="flex justify-between">
              <span className="text-[#453832]/75">Subtotal</span>
              <span className="font-semibold">PKR {cartTotals.subtotal.toLocaleString()}</span>
            </div>
            {cartTotals.discountAmount > 0 && (
              <div className="flex justify-between text-[#5A7252] font-semibold">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>− PKR {cartTotals.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#453832]/75">Delivery Charges</span>
              <span className="font-semibold">
                {cartTotals.shippingFee === 0
                  ? 'Complimentary (Free)'
                  : `PKR ${cartTotals.shippingFee.toLocaleString()}`}
              </span>
            </div>
            {cartTotals.shippingFee > 0 && (
              <p className="text-[11px] text-[#6E5D54]">
                Add PKR{' '}
                {Math.max(
                  0,
                  settings.freeShippingThreshold -
                    (cartTotals.subtotal - cartTotals.discountAmount)
                ).toLocaleString()}{' '}
                more for complimentary delivery!
              </p>
            )}

            <div className="flex justify-between pt-3 border-t border-[#453832]/10 text-base font-bold text-[#453832]">
              <span>Final Total</span>
              <span>PKR {cartTotals.finalTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('checkout')}
            className="w-full py-3.5 px-6 rounded-xl bg-[#453832] text-[#FFF9F0] text-sm font-semibold hover:bg-[#453832]/90 flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </aside>
      </div>
    </div>
  );
};

// ============================================================================
// 6. CHECKOUT PAGE
// ============================================================================
export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartTotals,
    appliedCoupon,
    currentUser,
    addresses,
    placeOrder,
    navigate,
    settings,
    notify,
  } = useStore();

  const userAddresses = addresses.filter((a) => a.userId === currentUser?.id);
  const defaultAddress = userAddresses.find((a) => a.isDefault) || userAddresses[0];

  const [customerName, setCustomerName] = useState(
    defaultAddress?.fullName || currentUser?.fullName || ''
  );
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(
    defaultAddress?.phone || currentUser?.phone || ''
  );

  const [houseBuilding, setHouseBuilding] = useState(defaultAddress?.houseBuilding || '');
  const [street, setStreet] = useState(defaultAddress?.street || '');
  const [area, setArea] = useState(defaultAddress?.area || '');
  const [city, setCity] = useState(defaultAddress?.city || 'Lahore');
  const [province, setProvince] = useState<Address['province']>(
    defaultAddress?.province || 'Punjab'
  );
  const [postalCode, setPostalCode] = useState(defaultAddress?.postalCode || '54000');
  const [deliveryInstructions, setDeliveryInstructions] = useState(
    defaultAddress?.deliveryInstructions || ''
  );

  const [paymentMethod, setPaymentMethod] = useState<
    'Cash on Delivery (Demo)' | 'Online Bank Transfer (Demo)'
  >('Cash on Delivery (Demo)');
  const [saveAddress, setSaveAddress] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectSavedAddress = (addr: Address) => {
    setCustomerName(addr.fullName);
    setCustomerPhone(addr.phone);
    setHouseBuilding(addr.houseBuilding);
    setStreet(addr.street);
    setArea(addr.area);
    setCity(addr.city);
    setProvince(addr.province);
    setPostalCode(addr.postalCode);
    setDeliveryInstructions(addr.deliveryInstructions || '');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      notify('Please complete your contact details.', 'error');
      return;
    }
    if (!houseBuilding.trim() || !street.trim() || !city.trim()) {
      notify('Please enter your complete shipping address.', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = placeOrder({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      shippingAddress: {
        fullName: customerName.trim(),
        phone: customerPhone.trim(),
        houseBuilding: houseBuilding.trim(),
        street: street.trim(),
        area: area.trim(),
        city: city.trim(),
        province,
        postalCode: postalCode.trim(),
        deliveryInstructions: deliveryInstructions.trim(),
      },
      paymentMethod,
      saveAddress,
    });

    setIsSubmitting(false);
    if (result.success && result.order) {
      navigate('order-confirmation', {
        orderId: result.order.id,
        orderNumber: result.order.orderNumber,
      });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-serif-display text-3xl font-semibold">No items in checkout</h1>
        <button
          type="button"
          onClick={() => navigate('shop')}
          className="px-6 py-2.5 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
        >
          Browse Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Demo Order Notice */}
      <div className="mb-8 p-4 rounded-xl bg-[#F7E7E7] border border-[#453832]/15 flex items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-semibold text-[#453832]">Demonstration Checkout Mode: </span>
          <span>
            Orders placed here are saved in the database, deduct live stock, and generate a
            real tracking number, but no real financial charge or physical courier dispatch
            occurs.
          </span>
        </div>
      </div>

      <form
        onSubmit={handleCheckoutSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left: Customer, Shipping & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Saved Address Quick Selector */}
          {userAddresses.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-3">
              <h2 className="font-serif-display text-xl font-semibold text-[#453832]">
                Use a Saved Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userAddresses.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => handleSelectSavedAddress(addr)}
                    className="p-3 rounded-xl border border-[#453832]/15 text-left text-xs hover:bg-[#FFF9F0] transition-colors"
                  >
                    <p className="font-semibold text-[#453832]">{addr.label}</p>
                    <p className="text-[#453832]/75 truncate">
                      {addr.houseBuilding}, {addr.street}
                    </p>
                    <p className="text-[#453832]/65">
                      {addr.city}, {addr.province}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 1. Customer Contact Details */}
          <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
            <h2 className="font-serif-display text-2xl font-semibold text-[#453832]">
              1. Customer Contact Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
            <h2 className="font-serif-display text-2xl font-semibold text-[#453832]">
              2. Shipping Destination
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  House / Apartment / Building *
                </label>
                <input
                  type="text"
                  required
                  value={houseBuilding}
                  onChange={(e) => setHouseBuilding(e.target.value)}
                  placeholder="House 42-B, Floor 2"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Street / Sector / Block *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street 9, Sector F-7/3"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Area / Landmark *</label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Gulberg III / DHA / Clifton"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Province / Territory *</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value as Address['province'])}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Islamabad Capital Territory">Islamabad Capital Territory</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                  <option value="Azad Kashmir">Azad Kashmir</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs font-mono-tabular"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Special Delivery Instructions (Optional)
              </label>
              <textarea
                rows={2}
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder="Gate code, fragile parcel notes, or preferred delivery hours..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              />
            </div>

            {currentUser && (
              <label className="flex items-center gap-2 text-xs text-[#453832] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                  className="accent-[#453832]"
                />
                <span>Save this shipping address to my account profile</span>
              </label>
            )}
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
            <h2 className="font-serif-display text-2xl font-semibold text-[#453832]">
              3. Payment Method (Demo Mode)
            </h2>
            <div className="space-y-3">
              <label
                className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery (Demo)'
                    ? 'border-[#453832] bg-[#F7E7E7]/40'
                    : 'border-[#453832]/15'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Cash on Delivery (Demo)'}
                    onChange={() => setPaymentMethod('Cash on Delivery (Demo)')}
                    className="accent-[#453832]"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#453832]">
                      Cash on Delivery (COD — Demonstration Mode)
                    </p>
                    <p className="text-[11px] text-[#453832]/70">
                      Pay in cash at your doorstep upon receiving your handmade gift parcel.
                    </p>
                  </div>
                </div>
              </label>

              <label
                className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Online Bank Transfer (Demo)'
                    ? 'border-[#453832] bg-[#F7E7E7]/40'
                    : 'border-[#453832]/15'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Online Bank Transfer (Demo)'}
                    onChange={() => setPaymentMethod('Online Bank Transfer (Demo)')}
                    className="accent-[#453832]"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#453832]">
                      Direct Online Bank / Raast Transfer (Simulated Demo)
                    </p>
                    <p className="text-[11px] text-[#453832]/70">{settings.bankAccountDetails}</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <aside className="lg:col-span-5 bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-6">
          <h2 className="font-serif-display text-2xl font-semibold text-[#453832]">
            Order Summary
          </h2>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 py-2 border-b border-[#453832]/8 text-xs"
              >
                <div className="flex items-start gap-3">
                  <ResilientImage
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-[#453832]">
                      {item.product.name} × {item.quantity}
                    </p>
                    <p className="text-[11px] text-[#6E5D54]">
                      {item.variantName || 'Standard'}
                    </p>
                    {item.customization?.isCustomGift && (
                      <p className="text-[11px] text-[#453832]/80">
                        Custom Gift for {item.customization.recipientName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs tabular-nums border-t border-[#453832]/10 pt-4">
            <div className="flex justify-between">
              <span className="text-[#453832]/75">Subtotal</span>
              <span>PKR {cartTotals.subtotal.toLocaleString()}</span>
            </div>
            {cartTotals.discountAmount > 0 && (
              <div className="flex justify-between text-[#5A7252] font-semibold">
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span>− PKR {cartTotals.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#453832]/75">Shipping Fee</span>
              <span>
                {cartTotals.shippingFee === 0
                  ? 'Free'
                  : `PKR ${cartTotals.shippingFee.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-[#453832]/10 text-base font-bold text-[#453832]">
              <span>Total Payable (Demo)</span>
              <span>PKR {cartTotals.finalTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-xl bg-[#453832] text-[#FFF9F0] text-sm font-semibold hover:bg-[#453832]/90 transition-colors"
          >
            {isSubmitting
              ? 'Processing Demo Order...'
              : `Place Demo Order · PKR ${cartTotals.finalTotal.toLocaleString()}`}
          </button>
        </aside>
      </form>
    </div>
  );
};

// ============================================================================
// 7. ORDER CONFIRMATION PAGE
// ============================================================================
export const OrderConfirmationPage: React.FC = () => {
  const { orders, navParams, navigate } = useStore();
  const order =
    orders.find(
      (o) => o.id === navParams.orderId || o.orderNumber === navParams.orderNumber
    ) || orders[0];

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="px-6 py-2.5 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      <div className="bg-white rounded-2xl border border-[#453832]/12 p-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#A8B5A0]/30 mx-auto flex items-center justify-center text-[#453832]">
          <CheckCircle2 className="w-8 h-8 text-[#5A7252]" />
        </div>
        <p className="text-xs font-semibold text-[#5A7252]">
          Demonstration Order Confirmed — Test Order Only
        </p>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#453832]">
          Thank You, {order.customerName}!
        </h1>
        <p className="text-xs text-[#453832]/75 max-w-md mx-auto leading-relaxed">
          Your demo order{' '}
          <span className="font-mono-tabular font-bold text-[#453832]">
            {order.orderNumber}
          </span>{' '}
          has been recorded in our studio database and inventory has been updated.
        </p>

        <div className="bg-[#FFF9F0] rounded-xl p-5 border border-[#453832]/10 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-[#453832]/70">Order Number:</span>
            <span className="font-mono-tabular font-bold">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#453832]/70">Order Status:</span>
            <span className="font-semibold">{order.orderStatus}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#453832]/70">Payment Method & Status:</span>
            <span className="font-semibold">
              {order.paymentMethod} · {order.paymentStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#453832]/70">Destination:</span>
            <span className="font-semibold">
              {order.shippingAddress.houseBuilding}, {order.shippingAddress.city}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#453832]/10 text-sm font-bold">
            <span>Total Order Value:</span>
            <span className="font-mono-tabular">
              PKR {order.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate('order-details', {
                orderId: order.id,
                orderNumber: order.orderNumber,
              })
            }
            className="px-6 py-3 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
          >
            View Full Order Receipt
          </button>
          <button
            type="button"
            onClick={() =>
              navigate('order-tracking', { orderNumber: order.orderNumber })
            }
            className="px-6 py-3 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs font-semibold"
          >
            Track Order Status
          </button>
          <button
            type="button"
            onClick={() => navigate('shop')}
            className="px-6 py-3 rounded-xl border border-[#453832]/20 bg-white text-xs font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 8. CUSTOMER AUTHENTICATION PAGES (Login, Register, Forgot Password)
// ============================================================================
export const CustomerAuthPage: React.FC<{
  mode: 'login' | 'register' | 'forgot-password';
}> = ({ mode }) => {
  const { loginCustomer, loginAdmin, registerCustomer, navigate, notify } = useStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(mode === 'login' ? 'ayesha@example.com' : '');
  const [phone, setPhone] = useState('+92 321 498 1122');
  const [password, setPassword] = useState('customer123');
  const [resetSubmitted, setResetSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      const cleanEmail = email.trim().toLowerCase();
      // If Sobia enters her owner identity on the sign-in screen, unlock her private Studio Admin directly
      if (
        cleanEmail === 'sobianazeerkhokhar@gmail.com' ||
        cleanEmail === 'sobia' ||
        cleanEmail === 'sobia@handmadehaven.pk'
      ) {
        const adminOk = loginAdmin(email, password);
        if (adminOk) navigate('admin-dashboard');
        return;
      }
      const ok = loginCustomer(email, password);
      if (ok) navigate('my-account');
    } else if (mode === 'register') {
      const ok = registerCustomer(fullName, email, phone, password);
      if (ok) navigate('my-account');
    } else {
      setResetSubmitted(true);
      notify(
        'Password reset token generated in local demo session (SMTP provider not configured).',
        'info'
      );
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="bg-white rounded-2xl border border-[#453832]/12 p-8 space-y-6 shadow-xs">
        <div className="text-center space-y-1.5">
          <p className="text-xs font-medium text-[#6E5D54]">Handmade Haven Collector Account</p>
          <h1 className="font-serif-display text-3xl font-semibold text-[#453832]">
            {mode === 'login'
              ? 'Welcome Back'
              : mode === 'register'
              ? 'Create Your Account'
              : 'Reset Your Password'}
          </h1>
        </div>

        {mode === 'login' && (
          <div className="p-3 rounded-xl bg-[#F7E7E7]/60 border border-[#453832]/10 text-[11px] text-[#453832]/85">
            <span className="font-semibold">Demo Customer Credentials Pre-filled:</span>{' '}
            ayesha@example.com / customer123
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ayesha Kamran"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
            />
          </div>

          {mode !== 'forgot-password' && (
            <div>
              <label className="block text-xs font-semibold mb-1">Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              />
            </div>
          )}

          {mode === 'forgot-password' && resetSubmitted && (
            <div className="p-3.5 rounded-xl bg-[#A8B5A0]/25 border border-[#453832]/15 text-xs text-[#453832]">
              <p className="font-semibold">Demo Password Reset Notice:</p>
              <p className="mt-1">
                Because an external SMTP email provider is not configured in this sandbox, no real
                email was sent. You can sign in directly using the demo account{' '}
                <span className="font-mono-tabular font-semibold">ayesha@example.com</span>.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold hover:bg-[#453832]/90"
          >
            {mode === 'login'
              ? 'Sign In to My Account'
              : mode === 'register'
              ? 'Create Collector Account'
              : 'Generate Password Reset Token'}
          </button>
        </form>

        <div className="pt-4 border-t border-[#453832]/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          {mode === 'login' ? (
            <>
              <button
                type="button"
                onClick={() => navigate('register')}
                className="text-[#453832] font-semibold hover:underline"
              >
                Create an account
              </button>
              <button
                type="button"
                onClick={() => navigate('forgot-password')}
                className="text-[#6E5D54] hover:underline"
              >
                Forgot password?
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate('login')}
              className="text-[#453832] font-semibold hover:underline"
            >
              ← Back to Customer Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 9. CUSTOMER ACCOUNT SUITE (Overview, Edit Profile, Addresses, Orders, Order Details, Tracking, Wishlist, Reviews)
// ============================================================================
export const CustomerAccountHub: React.FC<{
  subpage:
    | 'my-account'
    | 'edit-profile'
    | 'saved-addresses'
    | 'my-orders'
    | 'order-details'
    | 'wishlist'
    | 'my-reviews';
}> = ({ subpage }) => {
  const {
    currentUser,
    navigate,
    logoutCustomer,
    updateCustomerProfile,
    addresses,
    saveCustomerAddress,
    deleteCustomerAddress,
    orders,
    navParams,
    products,
    wishlistProductIds,
    toggleWishlist,
    moveWishlistToCart,
    reviews,
  } = useStore();

  // Local states for Edit Profile
  const [profName, setProfName] = useState(currentUser?.fullName || '');
  const [profEmail, setProfEmail] = useState(currentUser?.email || '');
  const [profPhone, setProfPhone] = useState(currentUser?.phone || '');

  // Local states for New Address
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrHouse, setAddrHouse] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrArea, setAddrArea] = useState('');
  const [addrCity, setAddrCity] = useState('Lahore');
  const [addrProvince, setAddrProvince] = useState<Address['province']>('Punjab');
  const [addrPostal, setAddrPostal] = useState('54000');

  if (!currentUser && subpage !== 'wishlist') {
    return <CustomerAuthPage mode="login" />;
  }

  // Strictly isolate data to logged-in customer
  const myOrders = orders.filter((o) => o.userId === currentUser?.id);
  const myAddresses = addresses.filter((a) => a.userId === currentUser?.id);
  const myReviews = reviews.filter((r) => r.userId === currentUser?.id);
  const wishlistedProducts = products.filter((p) => wishlistProductIds.includes(p.id));

  const selectedOrder =
    myOrders.find(
      (o) => o.id === navParams.orderId || o.orderNumber === navParams.orderNumber
    ) || myOrders[0];

  const accountTabs = [
    { id: 'my-account' as const, label: 'Account Overview', icon: UserIcon },
    { id: 'my-orders' as const, label: `My Orders (${myOrders.length})`, icon: Package },
    { id: 'saved-addresses' as const, label: 'Saved Addresses', icon: MapPin },
    { id: 'wishlist' as const, label: `My Wishlist (${wishlistedProducts.length})`, icon: Heart },
    { id: 'my-reviews' as const, label: `My Reviews (${myReviews.length})`, icon: Star },
    { id: 'edit-profile' as const, label: 'Edit Profile', icon: UserIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Account Navigation */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-[#453832]/10 p-5 space-y-5">
          {currentUser && (
            <div className="pb-4 border-b border-[#453832]/10">
              <p className="text-xs text-[#6E5D54]">Signed in as</p>
              <p className="font-serif-display text-xl font-semibold text-[#453832]">
                {currentUser.fullName}
              </p>
              <p className="text-xs text-[#453832]/65 truncate">{currentUser.email}</p>
            </div>
          )}

          <nav className="space-y-1">
            {accountTabs.map((tab) => {
              const Icon = tab.icon;
              const active =
                subpage === tab.id ||
                (subpage === 'order-details' && tab.id === 'my-orders');
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigate(tab.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors ${
                    active
                      ? 'bg-[#453832] text-[#FFF9F0] font-semibold'
                      : 'text-[#453832]/80 hover:bg-[#FFF9F0]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {currentUser && (
            <button
              type="button"
              onClick={logoutCustomer}
              className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold text-[#B94A48] hover:bg-[#F7E7E7]/40 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
        </aside>

        {/* Right Account Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* SUBPAGE: ACCOUNT OVERVIEW */}
          {subpage === 'my-account' && currentUser && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 sm:p-8">
                <h1 className="font-serif-display text-3xl font-semibold text-[#453832] mb-2">
                  Hello, {currentUser.fullName}
                </h1>
                <p className="text-xs text-[#453832]/75">
                  Manage your handmade gift orders, saved shipping addresses, and personal
                  collector preferences.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#453832]/10">
                    <p className="text-xs text-[#6E5D54]">Total Orders Placed</p>
                    <p className="font-serif-display text-3xl font-semibold text-[#453832] tabular-nums mt-1">
                      {myOrders.length}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#453832]/10">
                    <p className="text-xs text-[#6E5D54]">Saved Wishlist Items</p>
                    <p className="font-serif-display text-3xl font-semibold text-[#453832] tabular-nums mt-1">
                      {wishlistedProducts.length}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#453832]/10">
                    <p className="text-xs text-[#6E5D54]">Saved Addresses</p>
                    <p className="font-serif-display text-3xl font-semibold text-[#453832] tabular-nums mt-1">
                      {myAddresses.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif-display text-2xl font-semibold text-[#453832]">
                    Recent Orders
                  </h2>
                  <button
                    type="button"
                    onClick={() => navigate('my-orders')}
                    className="text-xs font-semibold underline"
                  >
                    View All Orders
                  </button>
                </div>

                {myOrders.slice(0, 2).map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-xl bg-[#FFF9F0] border border-[#453832]/10 flex flex-wrap items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <p className="font-mono-tabular font-bold text-[#453832]">
                        {ord.orderNumber}
                      </p>
                      <p className="text-[#453832]/70">
                        {new Date(ord.createdAt).toLocaleDateString()} · {ord.items.length} item(s)
                      </p>
                    </div>
                    <div className="tabular-nums">
                      <span className="font-semibold">{ord.orderStatus}</span>
                      <span className="mx-2">·</span>
                      <span className="font-bold">PKR {ord.totalAmount.toLocaleString()}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        navigate('order-details', {
                          orderId: ord.id,
                          orderNumber: ord.orderNumber,
                        })
                      }
                      className="px-4 py-2 rounded-lg bg-[#453832] text-[#FFF9F0] font-semibold"
                    >
                      Order Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBPAGE: EDIT PROFILE */}
          {subpage === 'edit-profile' && currentUser && (
            <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 sm:p-8 space-y-6">
              <h1 className="font-serif-display text-3xl font-semibold text-[#453832]">
                Edit Profile Information
              </h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateCustomerProfile(profName, profPhone, profEmail);
                }}
                className="space-y-4 max-w-lg"
              >
                <div>
                  <label className="block text-xs font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profName}
                    onChange={(e) => setProfName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profEmail}
                    onChange={(e) => setProfEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={profPhone}
                    onChange={(e) => setProfPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {/* SUBPAGE: SAVED ADDRESSES */}
          {subpage === 'saved-addresses' && currentUser && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
                <h1 className="font-serif-display text-3xl font-semibold text-[#453832]">
                  Saved Shipping Addresses
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 rounded-xl bg-[#FFF9F0] border border-[#453832]/12 flex flex-col justify-between text-xs space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between font-semibold text-[#453832]">
                          <span>{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-[11px] text-[#5A7252]">Default</span>
                          )}
                        </div>
                        <p className="mt-1 font-medium">{addr.fullName}</p>
                        <p className="text-[#453832]/75">
                          {addr.houseBuilding}, {addr.street}, {addr.area}
                        </p>
                        <p className="text-[#453832]/75">
                          {addr.city}, {addr.province} {addr.postalCode}
                        </p>
                        <p className="text-[#6E5D54] mt-1">{addr.phone}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteCustomerAddress(addr.id)}
                        className="text-[#B94A48] hover:underline self-start"
                      >
                        Remove Address
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Address Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveCustomerAddress({
                    label: addrLabel,
                    fullName: currentUser.fullName,
                    phone: currentUser.phone,
                    houseBuilding: addrHouse,
                    street: addrStreet,
                    area: addrArea,
                    city: addrCity,
                    province: addrProvince,
                    postalCode: addrPostal,
                    isDefault: myAddresses.length === 0,
                  });
                  setAddrHouse('');
                  setAddrStreet('');
                  setAddrArea('');
                }}
                className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4"
              >
                <h2 className="font-serif-display text-2xl font-semibold text-[#453832]">
                  Add a New Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    value={addrLabel}
                    onChange={(e) => setAddrLabel(e.target.value)}
                    placeholder="Label (Home, Office)"
                    className="px-3.5 py-2 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                  />
                  <input
                    type="text"
                    required
                    value={addrHouse}
                    onChange={(e) => setAddrHouse(e.target.value)}
                    placeholder="House / Building *"
                    className="px-3.5 py-2 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                  />
                  <input
                    type="text"
                    required
                    value={addrStreet}
                    onChange={(e) => setAddrStreet(e.target.value)}
                    placeholder="Street / Sector *"
                    className="px-3.5 py-2 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                  />
                  <input
                    type="text"
                    required
                    value={addrArea}
                    onChange={(e) => setAddrArea(e.target.value)}
                    placeholder="Area / Neighborhood *"
                    className="px-3.5 py-2 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                  />
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    placeholder="City *"
                    className="px-3.5 py-2 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                  />
                  <select
                    value={addrProvince}
                    onChange={(e) => setAddrProvince(e.target.value as Address['province'])}
                    className="px-3.5 py-2 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                  >
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="Islamabad Capital Territory">Islamabad Capital Territory</option>
                    <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save New Address</span>
                </button>
              </form>
            </div>
          )}

          {/* SUBPAGE: MY ORDERS */}
          {subpage === 'my-orders' && (
            <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
              <h1 className="font-serif-display text-3xl font-semibold text-[#453832]">
                My Order History
              </h1>
              {myOrders.length === 0 ? (
                <p className="text-xs text-[#453832]/70 py-8">
                  You have not placed any orders yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {myOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-xl bg-[#FFF9F0] border border-[#453832]/12 space-y-3 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#453832]/10 pb-3">
                        <div>
                          <span className="font-mono-tabular font-bold text-sm text-[#453832]">
                            {ord.orderNumber}
                          </span>
                          <span className="mx-2 text-[#453832]/40">·</span>
                          <span className="text-[#453832]/70">
                            Placed on {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="tabular-nums font-semibold">
                          <span>Status: {ord.orderStatus}</span>
                          <span className="mx-2">·</span>
                          <span>Total: PKR {ord.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-1">
                          {ord.items.map((item) => (
                            <p key={item.id} className="text-[#453832]/85">
                              • {item.productName} ({item.variantName || 'Standard'}) ×{' '}
                              {item.quantity}
                            </p>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate('order-tracking', { orderNumber: ord.orderNumber })
                            }
                            className="px-3.5 py-2 rounded-lg border border-[#453832]/20 bg-white font-semibold"
                          >
                            Track Parcel
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              navigate('order-details', {
                                orderId: ord.id,
                                orderNumber: ord.orderNumber,
                              })
                            }
                            className="px-4 py-2 rounded-lg bg-[#453832] text-[#FFF9F0] font-semibold"
                          >
                            View Receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SUBPAGE: ORDER DETAILS */}
          {subpage === 'order-details' && selectedOrder && (
            <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#453832]/10 pb-4">
                <div>
                  <p className="text-xs text-[#6E5D54]">Historical Order Snapshot</p>
                  <h1 className="font-serif-display text-3xl font-semibold text-[#453832]">
                    Order {selectedOrder.orderNumber}
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('my-orders')}
                  className="text-xs font-semibold underline"
                >
                  ← Back to My Orders
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#FFF9F0] space-y-1">
                  <p className="font-semibold text-[#453832]">Shipping Destination</p>
                  <p>{selectedOrder.shippingAddress.fullName}</p>
                  <p>
                    {selectedOrder.shippingAddress.houseBuilding},{' '}
                    {selectedOrder.shippingAddress.street}
                  </p>
                  <p>
                    {selectedOrder.shippingAddress.city},{' '}
                    {selectedOrder.shippingAddress.province}
                  </p>
                  <p>{selectedOrder.shippingAddress.phone}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FFF9F0] space-y-1">
                  <p className="font-semibold text-[#453832]">Order & Payment Info</p>
                  <p>Order Status: {selectedOrder.orderStatus}</p>
                  <p>Payment Status: {selectedOrder.paymentStatus}</p>
                  <p>Payment Method: {selectedOrder.paymentMethod}</p>
                  <p className="text-[#5A7252] font-medium">
                    Demo Mode: Marked as Test Order
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="font-serif-display text-xl font-semibold">Ordered Items</h2>
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-[#453832]/10 flex flex-col sm:flex-row justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-sm text-[#453832]">
                        {item.productName} × {item.quantity}
                      </p>
                      <p className="text-[#6E5D54]">
                        Variant: {item.variantName || 'Standard'} · SKU: {item.sku}
                      </p>
                      {item.customization?.isCustomGift && (
                        <div className="mt-2 p-3 rounded-lg bg-[#F7E7E7]/50 space-y-1">
                          <p className="font-semibold">
                            Custom Gift for: {item.customization.recipientName}
                          </p>
                          <p>Personalization: {item.customization.personalMessage}</p>
                          <p className="italic">
                            Gift Card: “{item.customization.giftCardMessage}”
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="font-mono-tabular font-bold text-[#453832]">
                      PKR {item.lineTotal.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBPAGE: WISHLIST */}
          {subpage === 'wishlist' && (
            <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-6">
              <h1 className="font-serif-display text-3xl font-semibold text-[#453832]">
                My Saved Wishlist ({wishlistedProducts.length})
              </h1>
              {wishlistedProducts.length === 0 ? (
                <div className="py-10 text-center space-y-3">
                  <p className="text-xs text-[#453832]/70">
                    Your wishlist is currently empty. Save your favorite handmade pieces while
                    browsing.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('shop')}
                    className="px-5 py-2.5 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
                  >
                    Explore Handmade Gifts
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-4 rounded-xl bg-[#FFF9F0] border border-[#453832]/10 flex gap-4 items-center"
                    >
                      <ResilientImage
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-20 h-20 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <p className="font-serif-display text-lg font-semibold text-[#453832] truncate">
                          {prod.name}
                        </p>
                        <p className="text-xs font-mono-tabular font-semibold">
                          PKR {(prod.discountPrice || prod.price).toLocaleString()}
                        </p>
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => moveWishlistToCart(prod.id)}
                            className="px-3 py-1.5 rounded-lg bg-[#453832] text-[#FFF9F0] text-[11px] font-semibold"
                          >
                            Move to Bag
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(prod.id)}
                            className="px-3 py-1.5 rounded-lg border border-[#453832]/20 text-[11px]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SUBPAGE: MY REVIEWS */}
          {subpage === 'my-reviews' && (
            <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-4">
              <h1 className="font-serif-display text-3xl font-semibold text-[#453832]">
                My Product Reviews
              </h1>
              {myReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-[#FFF9F0] border border-[#453832]/10 space-y-1.5 text-xs"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#453832]">{rev.productName}</span>
                    <span className="text-[#6E5D54]">{rev.rating} / 5 Stars</span>
                  </div>
                  <p className="font-serif-display text-base font-semibold">“{rev.title}”</p>
                  <p className="text-[#453832]/80">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 10. ORDER TRACKING PAGE (Standalone Lookup + Timeline)
// ============================================================================
export const OrderTrackingPage: React.FC = () => {
  const { orders, navParams } = useStore();
  const [queryNum, setQueryNum] = useState(navParams.orderNumber || 'HH-2026-1048');

  const matchedOrder =
    orders.find((o) => o.orderNumber.toUpperCase() === queryNum.trim().toUpperCase()) ||
    orders[0];

  const steps: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
  ];
  const currentStepIdx = steps.indexOf(matchedOrder.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <p className="text-xs font-semibold text-[#6E5D54]">Live Parcel Status Lookup</p>
        <h1 className="font-serif-display text-4xl font-semibold text-[#453832]">
          Track Your Handmade Gift Order
        </h1>
        <p className="text-xs text-[#453832]/75">
          Enter your order number (e.g., HH-2026-1042, HH-2026-1048, HH-2026-1051) to view
          live studio progress.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#453832]/10 p-6">
        <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="text"
            value={queryNum}
            onChange={(e) => setQueryNum(e.target.value)}
            placeholder="Enter Order Number (e.g. HH-2026-1048)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs font-mono-tabular uppercase"
          />
          <div className="flex gap-2">
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setQueryNum(o.orderNumber)}
                className="px-3 py-2 rounded-lg bg-[#F7E7E7] text-[11px] font-mono-tabular font-semibold"
              >
                {o.orderNumber}
              </button>
            ))}
          </div>
        </div>

        {matchedOrder && (
          <div className="mt-8 pt-8 border-t border-[#453832]/10 space-y-6">
            <div className="flex flex-wrap justify-between gap-4 text-xs">
              <div>
                <p className="text-[#6E5D54]">Tracking Order</p>
                <p className="font-mono-tabular text-lg font-bold text-[#453832]">
                  {matchedOrder.orderNumber}
                </p>
              </div>
              <div>
                <p className="text-[#6E5D54]">Recipient</p>
                <p className="font-semibold text-[#453832]">{matchedOrder.customerName}</p>
              </div>
              <div>
                <p className="text-[#6E5D54]">Destination City</p>
                <p className="font-semibold text-[#453832]">
                  {matchedOrder.shippingAddress.city}
                </p>
              </div>
              <div>
                <p className="text-[#6E5D54]">Current Stage</p>
                <p className="font-semibold text-[#5A7252]">{matchedOrder.orderStatus}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="grid grid-cols-5 gap-2 pt-2">
              {steps.map((st, idx) => {
                const completed = currentStepIdx >= idx;
                return (
                  <div
                    key={st}
                    className={`p-3 rounded-xl border text-center text-xs ${
                      completed
                        ? 'bg-[#453832] text-[#FFF9F0] border-[#453832] font-semibold'
                        : 'bg-[#FFF9F0] text-[#453832]/50 border-[#453832]/10'
                    }`}
                  >
                    {idx + 1}. {st}
                  </div>
                );
              })}
            </div>

            {/* Status History Timeline */}
            <div className="space-y-3 pt-4">
              <h3 className="font-serif-display text-xl font-semibold">
                Studio Activity Log
              </h3>
              {matchedOrder.statusHistory.map((h) => (
                <div
                  key={h.id}
                  className="p-3.5 rounded-xl bg-[#FFF9F0] border border-[#453832]/10 flex items-start justify-between gap-4 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#7A8B71] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#453832]">{h.status}</p>
                      <p className="text-[#453832]/75">{h.note}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#6E5D54] tabular-nums shrink-0">
                    {new Date(h.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
