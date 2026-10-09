/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { useStore, PageRoute } from '../context/StoreContext';

export const StorefrontLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    settings,
    categories,
    currentPage,
    navigate,
    cartTotals,
    wishlistProductIds,
    currentUser,
    currentAdmin,
    subscribeNewsletter,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [footerEmail, setFooterEmail] = useState('');

  const activeCategories = categories
    .filter((c) => c.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = searchInput.trim();
    if (!raw) return;
    // Private Owner Shortcut: Sobia can type "sobia-admin" or "@sobia" in the search bar to open her hidden Studio Admin login
    if (
      raw.toLowerCase() === 'sobia-admin' ||
      raw.toLowerCase() === '@sobia' ||
      raw.toLowerCase() === 'studio-sobia'
    ) {
      setSearchInput('');
      setSearchOpen(false);
      setMobileMenuOpen(false);
      navigate(currentAdmin ? 'admin-dashboard' : 'admin-login');
      return;
    }
    navigate('search-results', { searchQuery: raw });
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    subscribeNewsletter(footerEmail);
    setFooterEmail('');
  };

  const navLinkClass = (target: PageRoute) =>
    `whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
      currentPage === target
        ? 'border-[#453832] text-[#453832] font-semibold'
        : 'border-transparent text-[#453832]/75 hover:text-[#453832]'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0] text-[#453832]">
      {/* Editable Announcement Bar (<= 36px height) */}
      {settings.announcementEnabled && (
        <div className="bg-[#F7E7E7] text-[#453832] text-xs py-2 px-4 border-b border-[#453832]/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <p className="truncate font-medium mx-auto text-center">
              {settings.announcementText}
            </p>
            <div className="hidden lg:flex items-center gap-4 shrink-0 text-[11px] text-[#453832]/80">
              <button
                type="button"
                onClick={() => navigate('order-tracking')}
                className="hover:underline whitespace-nowrap"
              >
                Track Order
              </button>
              {currentAdmin && (
                <>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={() => navigate('admin-dashboard')}
                    className="hover:underline whitespace-nowrap font-semibold text-[#453832]"
                  >
                    Sobia’s Studio Admin (Unlocked)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation Bar (Strict 3-Zone Contract) */}
      <header className="sticky top-0 z-40 bg-[#FFF9F0]/95 backdrop-blur-md border-b border-[#453832]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single Text Element Wordmark */}
          <button
            type="button"
            onClick={() => navigate('home')}
            className="font-serif-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#453832] whitespace-nowrap shrink-0 text-left focus:outline-none"
          >
            {settings.storeName}
          </button>

          {/* Zone 2: 5 Concise Single-Line Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <button
              type="button"
              onClick={() => navigate('home')}
              className={navLinkClass('home')}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => navigate('shop')}
              className={navLinkClass('shop')}
            >
              Shop
            </button>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCategoriesDropdownOpen((v) => !v)}
                className={`flex items-center gap-1 whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                  currentPage === 'category'
                    ? 'border-[#453832] text-[#453832] font-semibold'
                    : 'border-transparent text-[#453832]/75 hover:text-[#453832]'
                }`}
              >
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute left-0 top-full pt-2 w-60 z-50">
                  <div className="bg-white rounded-xl border border-[#453832]/12 shadow-lg py-2">
                    {activeCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          navigate('category', { categorySlug: cat.slug });
                          setCategoriesDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#453832]/85 hover:bg-[#FFF9F0] hover:text-[#453832] flex items-center justify-between transition-colors"
                      >
                        <span className="font-medium">{cat.name}</span>
                        <span className="text-[11px] text-[#453832]/45">Explore</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate('custom-gift-builder')}
              className={navLinkClass('custom-gift-builder')}
            >
              Custom Gifts
            </button>

            <button
              type="button"
              onClick={() => navigate('about')}
              className={navLinkClass('about')}
            >
              About Us
            </button>

            <button
              type="button"
              onClick={() => navigate('contact')}
              className={navLinkClass('contact')}
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Shopping Utility Icons & Primary Cart Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search gifts"
              className="p-2 rounded-lg text-[#453832]/80 hover:text-[#453832] hover:bg-[#F7E7E7]/50 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate(currentUser ? 'my-account' : 'login')}
              aria-label="My Account"
              className="p-2 rounded-lg text-[#453832]/80 hover:text-[#453832] hover:bg-[#F7E7E7]/50 transition-colors flex items-center gap-1.5"
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden xl:inline text-xs font-medium whitespace-nowrap">
                {currentUser ? currentUser.fullName.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('wishlist')}
              aria-label={`Wishlist (${wishlistProductIds.length} items)`}
              className="p-2 rounded-lg text-[#453832]/80 hover:text-[#453832] hover:bg-[#F7E7E7]/50 transition-colors flex items-center gap-1 tabular-nums"
            >
              <Heart className="w-4 h-4" />
              <span className="text-xs font-medium">{wishlistProductIds.length}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('cart')}
              className="px-3.5 py-2 rounded-lg bg-[#453832] text-[#FFF9F0] text-xs font-medium hover:bg-[#453832]/90 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 tabular-nums"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Bag ({cartTotals.itemCount})</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle Menu"
              className="md:hidden p-2 rounded-lg text-[#453832] hover:bg-[#F7E7E7]/60"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-t border-[#453832]/10 bg-white px-4 py-3">
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-3xl mx-auto flex items-center gap-3"
            >
              <Search className="w-4 h-4 text-[#453832]/50 shrink-0" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search handmade jewelry, crochet flowers, soy candles, resin keepsakes..."
                autoFocus
                className="w-full text-sm bg-transparent text-[#453832] placeholder-[#453832]/45 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#453832] text-[#FFF9F0] text-xs font-medium whitespace-nowrap"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs text-[#453832]/60 hover:text-[#453832] px-2"
              >
                Close
              </button>
            </form>
          </div>
        )}

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#453832]/10 bg-white px-4 py-5 space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search handmade gifts..."
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-[#453832]/15 bg-[#FFF9F0]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#453832] text-[#FFF9F0] text-xs font-medium"
              >
                Go
              </button>
            </form>

            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              <button
                type="button"
                onClick={() => {
                  navigate('home');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-[#FFF9F0]"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('shop');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-[#FFF9F0]"
              >
                Shop All Gifts
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('custom-gift-builder');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-[#FFF9F0]"
              >
                Custom Gift Builder
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('blog');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-[#FFF9F0]"
              >
                Studio Journal (Blog)
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('about');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-[#FFF9F0]"
              >
                About Us
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('contact');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-[#FFF9F0]"
              >
                Contact Us
              </button>
            </div>

            <div className="pt-3 border-t border-[#453832]/10">
              <p className="text-xs font-semibold text-[#453832]/50 mb-2">Shop by Category</p>
              <div className="grid grid-cols-2 gap-1.5">
                {activeCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      navigate('category', { categorySlug: cat.slug });
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-xs px-3 py-1.5 rounded-md text-[#453832]/80 hover:bg-[#F7E7E7]/50"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#453832]/10 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  navigate(currentUser ? 'my-account' : 'login');
                  setMobileMenuOpen(false);
                }}
                className="font-semibold text-[#453832]"
              >
                {currentUser ? `Account (${currentUser.fullName})` : 'Customer Login / Register'}
              </button>
              {currentAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    navigate('admin-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="text-[#7A8B71] font-semibold"
                >
                  Sobia Studio Admin →
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Page View */}
      <main className="flex-1">{children}</main>

      {/* Complete Storefront Footer */}
      <footer className="bg-[#453832] text-[#FFF9F0] mt-20 border-t border-[#453832]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Column 1: Brand & Newsletter */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-serif-display text-3xl font-semibold text-[#FFF9F0]">
                {settings.storeName}
              </h2>
              <p className="text-sm text-[#FFF9F0]/80 max-w-sm leading-relaxed">
                {settings.tagline} Handcrafted in small studio batches using pure soy wax,
                combed organic cotton, freshwater pearls, and pressed botanicals.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="pt-2 max-w-sm">
                <label
                  htmlFor="footer-newsletter"
                  className="block text-xs text-[#FFF9F0]/70 mb-2"
                >
                  Join our studio notes for seasonal collections & gifting inspiration:
                </label>
                <div className="flex gap-2">
                  <input
                    id="footer-newsletter"
                    type="email"
                    required
                    value={footerEmail}
                    onChange={(e) => setFooterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-3.5 py-2 rounded-lg bg-[#FFF9F0]/10 border border-[#FFF9F0]/20 text-sm text-[#FFF9F0] placeholder-[#FFF9F0]/45 focus:outline-none focus:border-[#F7E7E7]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#F7E7E7] text-[#453832] text-xs font-semibold hover:bg-white transition-colors whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>

            {/* Column 2: Categories */}
            <div>
              <h3 className="font-serif-display text-lg font-semibold text-[#F7E7E7] mb-4">
                Collections
              </h3>
              <ul className="space-y-2.5 text-xs text-[#FFF9F0]/80">
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('shop')}
                    className="hover:text-white transition-colors"
                  >
                    Shop All Products
                  </button>
                </li>
                {activeCategories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => navigate('category', { categorySlug: cat.slug })}
                      className="hover:text-white transition-colors"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('custom-gift-builder')}
                    className="hover:text-white transition-colors text-[#F7E7E7] font-medium"
                  >
                    Custom Gift Builder
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Customer Care & Account */}
            <div>
              <h3 className="font-serif-display text-lg font-semibold text-[#F7E7E7] mb-4">
                Customer Care
              </h3>
              <ul className="space-y-2.5 text-xs text-[#FFF9F0]/80">
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('my-account')}
                    className="hover:text-white transition-colors"
                  >
                    My Account
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('order-tracking')}
                    className="hover:text-white transition-colors"
                  >
                    Order Tracking
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('wishlist')}
                    className="hover:text-white transition-colors"
                  >
                    Saved Wishlist
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('faq')}
                    className="hover:text-white transition-colors"
                  >
                    Frequently Asked Questions
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('shipping-returns')}
                    className="hover:text-white transition-colors"
                  >
                    Shipping & Returns Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('blog')}
                    className="hover:text-white transition-colors"
                  >
                    Artisan Journal (Blog)
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Studio Info & Policies */}
            <div>
              <h3 className="font-serif-display text-lg font-semibold text-[#F7E7E7] mb-4">
                Studio & Policies
              </h3>
              <ul className="space-y-2.5 text-xs text-[#FFF9F0]/80">
                <li>{settings.studioAddress}</li>
                <li>{settings.supportPhone}</li>
                <li>{settings.supportEmail}</li>
                <li className="text-[#FFF9F0]/60">{settings.workingHours}</li>
                <li className="pt-2 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('privacy-policy')}
                    className="hover:text-white underline underline-offset-4"
                  >
                    Privacy Policy
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('terms-conditions')}
                    className="hover:text-white underline underline-offset-4"
                  >
                    Terms & Conditions
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-[#FFF9F0]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF9F0]/65">
            <p>
              <button
                type="button"
                onClick={() => navigate(currentAdmin ? 'admin-dashboard' : 'admin-login')}
                title="Private Owner Portal (Sobia Only)"
                className="cursor-default select-none hover:text-[#FFF9F0]/80"
              >
                ©
              </button>{' '}
              {new Date().getFullYear()} {settings.storeName}. All rights reserved. Prices in{' '}
              {settings.currencyCode} (Demonstration Storefront — Test Orders Only).
            </p>
            <div className="flex items-center gap-5">
              {currentAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => navigate('python-architecture')}
                    className="flex items-center gap-1.5 text-[#F7E7E7] hover:text-white transition-colors"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Python Flask + SQLAlchemy Project Files</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('admin-dashboard')}
                    className="flex items-center gap-1.5 text-[#A8B5A0] hover:text-white transition-colors font-medium"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Sobia’s Studio Admin (Active)</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
