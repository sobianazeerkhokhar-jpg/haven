/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowRight, Mail, Phone, MapPin, Clock, HelpCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ResilientImage } from '../components/ResilientImage';
import { GENERATED_IMAGES } from '../data/seedData';

// ============================================================================
// 11. ABOUT US PAGE
// ============================================================================
export const AboutPage: React.FC = () => {
  const { settings, navigate } = useStore();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <p className="text-xs font-semibold text-[#6E5D54]">Our Artisanal Heritage</p>
        <h1
          className="font-serif-display text-4xl sm:text-5xl font-semibold text-[#453832]"
          style={{ textWrap: 'balance' }}
        >
          {settings.brandStoryHeadline}
        </h1>
        <p className="text-sm sm:text-base text-[#453832]/80 leading-relaxed">
          {settings.brandStoryBody}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white rounded-2xl border border-[#453832]/10 overflow-hidden">
        <div className="lg:col-span-6 h-full min-h-[340px]">
          <ResilientImage
            src={GENERATED_IMAGES.storyStudio}
            alt="Handmade Haven artisan crafting studio"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-6 p-8 sm:p-12 space-y-5">
          <h2 className="font-serif-display text-3xl font-semibold text-[#453832]">
            Crafted by Hand, Never Mass-Produced
          </h2>
          <p className="text-xs sm:text-sm text-[#453832]/80 leading-relaxed">
            Founded in Lahore, Handmade Haven brings together a collective of eight independent
            female artisans specializing in botanical resin casting, fine crochet floristry,
            small-batch soy chandlery, and linen bookbinding.
          </p>
          <p className="text-xs sm:text-sm text-[#453832]/80 leading-relaxed">
            Every creation is inspected by hand, wrapped in unbleached linen or rigid keepsake
            boxes, and finished with a real botanical wax seal before leaving our workbench.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#453832]/10 text-xs">
            <div>
              <p className="font-serif-display text-2xl font-bold text-[#453832]">8</p>
              <p className="text-[#6E5D54]">Studio Artisans</p>
            </div>
            <div>
              <p className="font-serif-display text-2xl font-bold text-[#453832]">24+</p>
              <p className="text-[#6E5D54]">Signature Designs</p>
            </div>
            <div>
              <p className="font-serif-display text-2xl font-bold text-[#453832]">100%</p>
              <p className="text-[#6E5D54]">Plastic-Free Wrap</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('custom-gift-builder')}
              className="px-6 py-3 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
            >
              Design a Custom Gift With Us →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 12. CONTACT US PAGE
// ============================================================================
export const ContactPage: React.FC = () => {
  const { settings, submitContactMessage } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContactMessage(name, email, phone, subject, message);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <p className="text-xs font-semibold text-[#6E5D54]">Studio Concierge</p>
        <h1 className="font-serif-display text-4xl font-semibold text-[#453832]">
          Get in Touch With Our Makers
        </h1>
        <p className="text-xs text-[#453832]/75">
          Have a question about custom bridal favors, corporate gifting hampers, or an existing
          order? Send us a note below and it will appear directly in our Admin Messages inbox.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#453832]/10 p-6 sm:p-8 space-y-6">
          <h2 className="font-serif-display text-2xl font-semibold text-[#453832]">
            Studio Contact Information
          </h2>
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#7A8B71] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#453832]">Studio Address</p>
                <p className="text-[#453832]/75">{settings.studioAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#7A8B71] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#453832]">Telephone & WhatsApp</p>
                <p className="text-[#453832]/75">{settings.supportPhone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#7A8B71] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#453832]">Concierge Email</p>
                <p className="text-[#453832]/75">{settings.supportEmail}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#7A8B71] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#453832]">Artisan Studio Hours</p>
                <p className="text-[#453832]/75">{settings.workingHours}</p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-white rounded-2xl border border-[#453832]/10 p-6 sm:p-8 space-y-4"
        >
          <h2 className="font-serif-display text-2xl font-semibold text-[#453832]">
            Send a Message to the Studio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              />
            </div>
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
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Custom Bridal Order / General Inquiry"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Message *</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your gifting requirements, dates, or questions..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
          >
            Send Inquiry
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 13. FAQ, SHIPPING & RETURNS, PRIVACY POLICY, TERMS & CONDITIONS
// ============================================================================
export const PolicyAndFaqPage: React.FC<{
  type: 'faq' | 'shipping-returns' | 'privacy-policy' | 'terms-conditions';
}> = ({ type }) => {
  const { settings } = useStore();

  const faqs = [
    {
      q: 'How long do customized handmade orders take to prepare?',
      a: 'Standard studio pieces ship within 2–3 working days. Bespoke items created through our Custom Gift Builder (such as hand-stamped pendants, custom resin coasters, or multi-stem crochet bouquets) require 4–6 working days of artisan preparation.',
    },
    {
      q: 'Are your soy candles and crochet flowers 100% handmade?',
      a: 'Yes. Every crochet flower is stitched petal by petal from combed mercerized cotton yarn, and our candles are hand-poured in small batches using 100% pure soy wax and untreated wooden wicks.',
    },
    {
      q: 'Can I include a handwritten note without showing the invoice price?',
      a: 'Absolutely. All Handmade Haven parcels are packed as gifts with zero paper price tags inside the box. Your handwritten cotton-rag card is sealed with a real botanical wax stamp.',
    },
    {
      q: 'What payment methods are supported?',
      a: 'We support Cash on Delivery (COD) nationwide across Pakistan as well as Direct Bank / Raast Transfers. (Currently operating in Demonstration Mode for test orders).',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {type === 'faq' && (
        <>
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold text-[#6E5D54]">Customer Care</p>
            <h1 className="font-serif-display text-4xl font-semibold text-[#453832]">
              Frequently Asked Questions
            </h1>
          </div>
          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-2"
              >
                <h3 className="font-serif-display text-xl font-semibold text-[#453832] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#7A8B71] shrink-0" />
                  <span>{item.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#453832]/80 leading-relaxed pl-6">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {type === 'shipping-returns' && (
        <div className="bg-white rounded-2xl border border-[#453832]/10 p-8 space-y-5">
          <h1 className="font-serif-display text-4xl font-semibold text-[#453832]">
            Shipping & Returns Policy
          </h1>
          <div className="space-y-4 text-xs sm:text-sm text-[#453832]/80 leading-relaxed">
            <h2 className="font-serif-display text-2xl font-semibold text-[#453832]">
              1. Nationwide Delivery & Packaging
            </h2>
            <p>
              We deliver across Pakistan via insured fragile-care courier partners. Standard
              delivery is PKR {settings.standardShippingFee} and complimentary on all orders
              above PKR {settings.freeShippingThreshold.toLocaleString()}. Estimated delivery
              time is {settings.estimatedDeliveryDays}.
            </p>
            <h2 className="font-serif-display text-2xl font-semibold text-[#453832]">
              2. Returns & Damaged Parcel Replacements
            </h2>
            <p>
              Non-customized items may be exchanged or returned within 7 days of delivery in
              their original unworn, unlit condition. Because personalized gifts (custom
              initials, bespoke inscriptions, and custom gift cards) are crafted specifically for
              you, they are eligible for replacement only in the rare event of transit damage.
            </p>
          </div>
        </div>
      )}

      {type === 'privacy-policy' && (
        <div className="bg-white rounded-2xl border border-[#453832]/10 p-8 space-y-5">
          <h1 className="font-serif-display text-4xl font-semibold text-[#453832]">
            Privacy Policy
          </h1>
          <div className="space-y-4 text-xs sm:text-sm text-[#453832]/80 leading-relaxed">
            <p>
              At {settings.storeName}, we respect your privacy and protect all personal customer
              information, recipient gift messages, and uploaded reference photos.
            </p>
            <h2 className="font-serif-display text-2xl font-semibold text-[#453832]">
              Data Isolation & Security
            </h2>
            <p>
              Your account credentials are hashed using PBKDF2-SHA256 / Werkzeug password
              hashing, and your order history and saved addresses are strictly isolated to your
              authenticated session. We never store raw payment card details or sell customer
              data to third parties.
            </p>
          </div>
        </div>
      )}

      {type === 'terms-conditions' && (
        <div className="bg-white rounded-2xl border border-[#453832]/10 p-8 space-y-5">
          <h1 className="font-serif-display text-4xl font-semibold text-[#453832]">
            Terms & Conditions
          </h1>
          <div className="space-y-4 text-xs sm:text-sm text-[#453832]/80 leading-relaxed">
            <p>
              Welcome to {settings.storeName}. By using our storefront and Custom Gift Builder,
              you agree to the following terms:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Handmade Variations:</strong> Because every item is crafted by hand using
                natural pearls, pressed wildflowers, and dyed yarns, subtle organic variations in
                petal placement and stone grain are normal and celebrated.
              </li>
              <li>
                <strong>Server-Side Price Verification:</strong> All prices are denominated in
                PKR. Final totals, coupon discounts, and inventory availability are verified on
                the server at checkout.
              </li>
              <li>
                <strong>Demonstration Environment Notice:</strong> This preview operates in demo
                mode with sample PKR prices and clearly labeled test orders.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 14. BLOG LISTING & INDIVIDUAL BLOG ARTICLE PAGES
// ============================================================================
export const BlogPage: React.FC<{ mode: 'list' | 'article' }> = ({ mode }) => {
  const { blogArticles, navParams, navigate } = useStore();

  const activeArticle =
    blogArticles.find((b) => b.slug === navParams.blogSlug) || blogArticles[0];

  if (mode === 'article' && activeArticle) {
    return (
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <button
          type="button"
          onClick={() => navigate('blog')}
          className="text-xs font-semibold text-[#6E5D54] hover:text-[#453832]"
        >
          ← Back to Artisan Journal
        </button>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-[#6E5D54]">
            <span>{activeArticle.category}</span>
            <span>·</span>
            <span>{activeArticle.publishedAt}</span>
            <span>·</span>
            <span>{activeArticle.readTime}</span>
          </div>
          <h1 className="font-serif-display text-3xl sm:text-5xl font-semibold text-[#453832] leading-tight">
            {activeArticle.title}
          </h1>
          <p className="text-xs text-[#453832]/70">
            By <span className="font-semibold text-[#453832]">{activeArticle.author}</span> (
            {activeArticle.authorRole})
          </p>
        </div>

        <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-[#453832]/10">
          <ResilientImage
            src={activeArticle.image}
            alt={activeArticle.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="bg-white rounded-2xl border border-[#453832]/10 p-6 sm:p-10 space-y-5 text-sm sm:text-base text-[#453832]/85 leading-relaxed">
          {activeArticle.content.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </article>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <p className="text-xs font-semibold text-[#6E5D54]">Notes from the Workbench</p>
        <h1 className="font-serif-display text-4xl sm:text-5xl font-semibold text-[#453832]">
          The Handmade Haven Journal
        </h1>
        <p className="text-xs text-[#453832]/75">
          Stories on slow craftsmanship, botanical materials, and the art of thoughtful gifting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        {blogArticles.map((art) => (
          <div
            key={art.id}
            className="bg-white rounded-2xl border border-[#453832]/10 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[4/3] overflow-hidden">
                <ResilientImage
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-[#6E5D54]">
                  <span>{art.category}</span>
                  <span>·</span>
                  <span>{art.readTime}</span>
                </div>
                <h2 className="font-serif-display text-2xl font-semibold text-[#453832]">
                  {art.title}
                </h2>
                <p className="text-xs text-[#453832]/75 leading-relaxed line-clamp-3">
                  {art.excerpt}
                </p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <button
                type="button"
                onClick={() => navigate('blog-article', { blogSlug: art.slug })}
                className="text-xs font-semibold text-[#453832] flex items-center gap-1.5 hover:text-[#7A8B71]"
              >
                <span>Read Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 15. 404 ERROR PAGE
// ============================================================================
export const NotFoundPage: React.FC = () => {
  const { navigate } = useStore();
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
      <p className="font-mono-tabular text-xs font-semibold text-[#6E5D54]">ERROR 404</p>
      <h1 className="font-serif-display text-4xl sm:text-5xl font-semibold text-[#453832]">
        This Page Could Not Be Found
      </h1>
      <p className="text-sm text-[#453832]/75">
        The handmade creation or page you are looking for may have been moved or archived.
      </p>
      <div className="pt-2 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="px-6 py-3 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
        >
          Return to Homepage
        </button>
        <button
          type="button"
          onClick={() => navigate('shop')}
          className="px-6 py-3 rounded-xl border border-[#453832]/20 bg-white text-xs font-semibold"
        >
          Browse Catalog
        </button>
      </div>
    </div>
  );
};
