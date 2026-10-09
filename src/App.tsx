/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { StorefrontLayout } from './components/StorefrontLayout';
import {
  HomePage,
  CatalogPage,
  ProductDetailsPage,
  CustomGiftBuilderPage,
} from './pages/StorefrontPages1';
import {
  CartPage,
  CheckoutPage,
  OrderConfirmationPage,
  CustomerAuthPage,
  CustomerAccountHub,
  OrderTrackingPage,
} from './pages/StorefrontPages2';
import {
  AboutPage,
  ContactPage,
  PolicyAndFaqPage,
  BlogPage,
  NotFoundPage,
} from './pages/StorefrontPages3';
import { AdminPortal } from './pages/AdminPortal';
import { PythonArchitecturePage } from './pages/PythonArchitecturePage';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStore();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-[#453832] text-[#FFF9F0] px-4 py-3 rounded-xl shadow-lg border border-[#FFF9F0]/15 flex items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2.5">
            {t.type === 'success' && (
              <CheckCircle2 className="w-4 h-4 text-[#A8B5A0] shrink-0" />
            )}
            {t.type === 'error' && (
              <AlertCircle className="w-4 h-4 text-[#F7E7E7] shrink-0" />
            )}
            {t.type === 'info' && <Info className="w-4 h-4 text-[#F7E7E7] shrink-0" />}
            <span>{t.message}</span>
          </div>
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            className="text-[#FFF9F0]/60 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

const RouterView: React.FC = () => {
  const { currentPage } = useStore();

  // Admin Portal Routes (21 pages)
  if (currentPage.startsWith('admin-')) {
    return <AdminPortal />;
  }

  // Storefront Routes (27 pages)
  return (
    <StorefrontLayout>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'shop' && <CatalogPage mode="shop" />}
      {currentPage === 'category' && <CatalogPage mode="category" />}
      {currentPage === 'search-results' && <CatalogPage mode="search" />}
      {currentPage === 'product-details' && <ProductDetailsPage />}
      {currentPage === 'custom-gift-builder' && <CustomGiftBuilderPage />}
      {currentPage === 'cart' && <CartPage />}
      {currentPage === 'checkout' && <CheckoutPage />}
      {currentPage === 'order-confirmation' && <OrderConfirmationPage />}
      {currentPage === 'login' && <CustomerAuthPage mode="login" />}
      {currentPage === 'register' && <CustomerAuthPage mode="register" />}
      {currentPage === 'forgot-password' && <CustomerAuthPage mode="forgot-password" />}
      {(currentPage === 'my-account' ||
        currentPage === 'edit-profile' ||
        currentPage === 'saved-addresses' ||
        currentPage === 'my-orders' ||
        currentPage === 'order-details' ||
        currentPage === 'wishlist' ||
        currentPage === 'my-reviews') && <CustomerAccountHub subpage={currentPage} />}
      {currentPage === 'order-tracking' && <OrderTrackingPage />}
      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'contact' && <ContactPage />}
      {currentPage === 'faq' && <PolicyAndFaqPage type="faq" />}
      {currentPage === 'shipping-returns' && (
        <PolicyAndFaqPage type="shipping-returns" />
      )}
      {currentPage === 'privacy-policy' && <PolicyAndFaqPage type="privacy-policy" />}
      {currentPage === 'terms-conditions' && (
        <PolicyAndFaqPage type="terms-conditions" />
      )}
      {currentPage === 'blog' && <BlogPage mode="list" />}
      {currentPage === 'blog-article' && <BlogPage mode="article" />}
      {currentPage === 'python-architecture' && <PythonArchitecturePage />}
      {currentPage === 'not-found' && <NotFoundPage />}
    </StorefrontLayout>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <RouterView />
      <ToastContainer />
    </StoreProvider>
  );
}

