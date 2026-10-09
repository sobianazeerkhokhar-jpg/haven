/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  Star,
  SlidersHorizontal,
  Search,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  ZoomIn,
  Truck,
  ShieldCheck,
  Sparkles,
  Check,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ResilientImage } from '../components/ResilientImage';
import { GENERATED_IMAGES } from '../data/seedData';

// ============================================================================
// 1. HOME PAGE (All sections A through L)
// ============================================================================
export const HomePage: React.FC = () => {
  const {
    settings,
    categories,
    products,
    reviews,
    navigate,
    subscribeNewsletter,
  } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const publishedProducts = useMemo(
    () => products.filter((p) => p.status === 'published'),
    [products]
  );

  const activeCategories = useMemo(
    () => categories.filter((c) => c.isActive).sort((a, b) => a.displayOrder - b.displayOrder),
    [categories]
  );

  const bestsellingProducts = useMemo(
    () => publishedProducts.filter((p) => p.isBestseller).slice(0, 6),
    [publishedProducts]
  );

  const newArrivalProducts = useMemo(
    () => publishedProducts.filter((p) => p.isNewArrival).slice(0, 3),
    [publishedProducts]
  );

  const featuredProducts = useMemo(
    () => publishedProducts.filter((p) => p.isFeatured).slice(0, 3),
    [publishedProducts]
  );

  const approvedReviews = useMemo(
    () => reviews.filter((r) => r.status === 'approved').slice(0, 3),
    [reviews]
  );

  return (
    <div className="space-y-24 pb-8">
      {/* SECTION B: HERO BANNER (Split 2-Column with Balanced Proportions) */}
      <section className="relative bg-gradient-to-b from-[#F7E7E7]/45 to-[#FFF9F0] border-b border-[#453832]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left Copy Column */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <div className="text-xs font-medium text-[#6E5D54] tracking-wide">
                Handcrafted Boutique · Small-Batch Studio Creations
              </div>

              <h1
                className="font-serif-display text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold text-[#453832] leading-[1.08]"
                style={{ textWrap: 'balance' }}
              >
                {settings.heroHeadline}
              </h1>

              <p className="text-base sm:text-lg text-[#453832]/80 max-w-xl leading-relaxed">
                {settings.heroSubheadline}
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate('shop')}
                  className="px-7 py-3.5 rounded-xl bg-[#453832] text-[#FFF9F0] text-sm font-semibold hover:bg-[#453832]/90 transition-all flex items-center gap-2.5 whitespace-nowrap shadow-xs"
                >
                  <span>{settings.heroPrimaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('custom-gift-builder')}
                  className="px-7 py-3.5 rounded-xl bg-white border border-[#453832]/20 text-[#453832] text-sm font-semibold hover:bg-[#F7E7E7]/60 transition-colors whitespace-nowrap"
                >
                  {settings.heroSecondaryCta}
                </button>
              </div>

              {/* Clean Unboxed Trust Metrics */}
              <div className="pt-6 border-t border-[#453832]/10 grid grid-cols-3 gap-6 text-xs text-[#453832]/75">
                <div>
                  <p className="font-serif-display text-2xl font-semibold text-[#453832] tabular-nums">
                    100%
                  </p>
                  <p className="mt-0.5">Hand-crafted in our studio</p>
                </div>
                <div>
                  <p className="font-serif-display text-2xl font-semibold text-[#453832] tabular-nums">
                    4.9 / 5.0
                  </p>
                  <p className="mt-0.5">Verified customer rating</p>
                </div>
                <div>
                  <p className="font-serif-display text-2xl font-semibold text-[#453832] tabular-nums">
                    Wax-Sealed
                  </p>
                  <p className="mt-0.5">Keepsake gift packaging</p>
                </div>
              </div>
            </div>

            {/* Right Visual Anchor */}
            <div className="lg:col-span-6">
              <div className="relative h-full min-h-[340px] sm:min-h-[420px] rounded-2xl overflow-hidden border border-[#453832]/10 shadow-md bg-[#F7E7E7]">
                <ResilientImage
                  src={settings.heroBannerImage}
                  alt="Curated handmade gifts flat-lay with crochet tulips, soy candle, and resin coasters"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#453832]/50 via-transparent to-transparent flex items-end p-6">
                  <div className="bg-[#FFF9F0]/95 backdrop-blur-md rounded-xl p-4 max-w-sm border border-[#453832]/10">
                    <p className="text-xs text-[#453832]/65">Featured Keepsake</p>
                    <p className="font-serif-display text-lg font-semibold text-[#453832]">
                      The Curated Birthday & Anniversary Collection
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('category', { categorySlug: 'gift-hampers' })}
                      className="mt-1.5 text-xs font-semibold text-[#453832] underline underline-offset-4 hover:text-[#7A8B71]"
                    >
                      Explore Gift Hampers →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: SHOP BY CATEGORY (6 Categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs text-[#6E5D54] font-medium mb-1">Six Artisan Disciplines</p>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#453832]">
              Shop by Category
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('shop')}
            className="text-sm font-medium text-[#453832] hover:text-[#7A8B71] flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View all {publishedProducts.length} creations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCategories.map((cat) => {
            const count = publishedProducts.filter((p) => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => navigate('category', { categorySlug: cat.slug })}
                className="group text-left bg-white rounded-xl border border-[#453832]/10 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#F7E7E7]/40">
                  <ResilientImage
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#453832]/60 mb-1">
                      <span>Collection</span>
                      <span className="tabular-nums">{count} Products</span>
                    </div>
                    <h3 className="font-serif-display text-2xl font-semibold text-[#453832] group-hover:text-[#7A8B71] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#453832]/75 mt-1.5 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#453832]/8 flex items-center justify-between text-xs font-semibold text-[#453832]">
                    <span>Browse {cat.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION D: BESTSELLING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs text-[#6E5D54] font-medium mb-1">Most Loved by Our Community</p>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#453832]">
              Bestselling Creations
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('shop')}
            className="text-sm font-medium text-[#453832] underline underline-offset-4 hover:text-[#7A8B71]"
          >
            Shop all bestsellers
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {bestsellingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION F: PERSONALIZED GIFT BUILDER PROMOTION */}
      <section className="bg-[#F7E7E7]/65 border-y border-[#453832]/10 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <p className="text-xs font-semibold text-[#453832]/70">
                Interactive Bespoke Studio Experience
              </p>
              <h2
                className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#453832] leading-tight"
                style={{ textWrap: 'balance' }}
              >
                Design a One-of-a-Kind Custom Gift in Four Guided Steps
              </h2>
              <p className="text-sm sm:text-base text-[#453832]/80 max-w-2xl leading-relaxed">
                Select your artisan base piece, choose your variant, compose a handwritten
                calligraphy gift card note, pick your wax-sealed wrapping style, and upload an
                optional reference photo for our makers.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
                <div className="bg-white/80 p-3.5 rounded-xl border border-[#453832]/10">
                  <span className="font-mono-tabular font-semibold text-[#453832]">01.</span>
                  <p className="font-semibold text-[#453832] mt-1">Select Item</p>
                  <p className="text-[#453832]/65 mt-0.5">Choose category & piece</p>
                </div>
                <div className="bg-white/80 p-3.5 rounded-xl border border-[#453832]/10">
                  <span className="font-mono-tabular font-semibold text-[#453832]">02.</span>
                  <p className="font-semibold text-[#453832] mt-1">Personalize</p>
                  <p className="text-[#453832]/65 mt-0.5">Recipient & engraving</p>
                </div>
                <div className="bg-white/80 p-3.5 rounded-xl border border-[#453832]/10">
                  <span className="font-mono-tabular font-semibold text-[#453832]">03.</span>
                  <p className="font-semibold text-[#453832] mt-1">Gift Wrap</p>
                  <p className="text-[#453832]/65 mt-0.5">Ribbon, wax seal & card</p>
                </div>
                <div className="bg-white/80 p-3.5 rounded-xl border border-[#453832]/10">
                  <span className="font-mono-tabular font-semibold text-[#453832]">04.</span>
                  <p className="font-semibold text-[#453832] mt-1">Review & Add</p>
                  <p className="text-[#453832]/65 mt-0.5">Saved with your order</p>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => navigate('custom-gift-builder')}
                  className="px-7 py-3.5 rounded-xl bg-[#453832] text-[#FFF9F0] text-sm font-semibold hover:bg-[#453832]/90 transition-colors inline-flex items-center gap-2"
                >
                  <span>Launch Custom Gift Builder</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-[#453832]/12 shadow-md bg-white">
                <ResilientImage
                  src={GENERATED_IMAGES.hampersStationery}
                  alt="Custom handmade gift hamper with wax seal and crochet bouquet"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E & G: NEW ARRIVALS & FEATURED COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Featured Studio Picks */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs text-[#6E5D54] font-medium mb-1">Curated Signature Pieces</p>
              <h2 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#453832]">
                {settings.featuredCollectionTitle}
              </h2>
              <p className="text-sm text-[#453832]/75 mt-1 max-w-2xl">
                {settings.featuredCollectionSubtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* New Arrivals */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs text-[#6E5D54] font-medium mb-1">Fresh from the Workbench</p>
              <h2 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#453832]">
                New Studio Arrivals
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('shop')}
              className="text-sm font-medium text-[#453832] underline underline-offset-4 hover:text-[#7A8B71]"
            >
              Explore full catalog
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {newArrivalProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION H & I: OUR BRAND STORY & WHY CHOOSE HANDMADE HAVEN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#453832]/10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-6 min-h-[320px]">
              <ResilientImage
                src={GENERATED_IMAGES.storyStudio}
                alt="Artisan tying a sage green ribbon on a handmade gift box"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center space-y-6">
              <p className="text-xs font-medium text-[#6E5D54]">Our Heritage & Craft Philosophy</p>
              <h2
                className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#453832] leading-tight"
                style={{ textWrap: 'balance' }}
              >
                {settings.brandStoryHeadline}
              </h2>
              <p className="text-sm sm:text-base text-[#453832]/80 leading-relaxed">
                {settings.brandStoryBody}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#453832]/8">
                  <h3 className="font-serif-display text-lg font-semibold text-[#453832]">
                    Botanical & Pure Materials
                  </h3>
                  <p className="text-xs text-[#453832]/70 mt-1 leading-relaxed">
                    100% pure soy wax, combed organic cotton yarn, real meadow florals, and
                    freshwater pearls.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#453832]/8">
                  <h3 className="font-serif-display text-lg font-semibold text-[#453832]">
                    Heirloom Gift Presentation
                  </h3>
                  <p className="text-xs text-[#453832]/70 mt-1 leading-relaxed">
                    Every order arrives in linen-textured packaging with satin ribbons and
                    stamped botanical wax seals.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('about')}
                  className="text-sm font-semibold text-[#453832] underline underline-offset-4 hover:text-[#7A8B71]"
                >
                  Read Our Full Studio Story →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION J: CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs text-[#6E5D54] font-medium mb-1">Verified Collector Notes</p>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#453832]">
            Words from Our Customers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-xl border border-[#453832]/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-[#D4A359] mb-3">
                  {Array.from({ length: rev.rating }).map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <h3 className="font-serif-display text-xl font-semibold text-[#453832] mb-2">
                  “{rev.title}”
                </h3>
                <p className="text-xs text-[#453832]/80 leading-relaxed">{rev.comment}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#453832]/8 text-xs text-[#453832]/65 flex items-center justify-between">
                <span className="font-semibold text-[#453832]">{rev.customerName}</span>
                <span>{rev.productName}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION K: NEWSLETTER SIGNUP */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#A8B5A0]/20 rounded-2xl border border-[#453832]/12 p-8 sm:p-12 text-center space-y-4">
          <p className="text-xs font-medium text-[#453832]/75">The Artisan Dispatch</p>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#453832]">
            Receive Early Access to Small-Batch Releases
          </h2>
          <p className="text-sm text-[#453832]/75 max-w-lg mx-auto">
            Join our community for seasonal gifting guides, studio behind-the-scenes, and a 10%
            welcome code (<span className="font-mono-tabular font-semibold">HAVEN10</span>).
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              subscribeNewsletter(newsletterEmail);
              setNewsletterEmail('');
            }}
            className="max-w-md mx-auto pt-2 flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#453832]/20 text-sm text-[#453832] focus:outline-none focus:border-[#453832]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold hover:bg-[#453832]/90 transition-colors whitespace-nowrap"
            >
              Join the Studio List
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

// ============================================================================
// 2. SHOP ALL PRODUCTS / CATEGORY LISTING / SEARCH RESULTS PAGE
// ============================================================================
export const CatalogPage: React.FC<{ mode: 'shop' | 'category' | 'search' }> = ({ mode }) => {
  const { products, categories, navParams, navigate } = useStore();

  const [searchQuery, setSearchQuery] = useState(navParams.searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    mode === 'category' && navParams.categorySlug ? navParams.categorySlug : 'all'
  );
  const [maxPrice, setMaxPrice] = useState<number>(8000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-asc' | 'price-desc'>('popular');
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const itemsPerPage = 9;

  // Sync category slug when navigating between category dropdown links
  React.useEffect(() => {
    if (mode === 'category' && navParams.categorySlug) {
      setSelectedCategory(navParams.categorySlug);
      setCurrentPageNum(1);
    } else if (mode === 'search' && navParams.searchQuery !== undefined) {
      setSearchQuery(navParams.searchQuery);
      setCurrentPageNum(1);
    } else if (mode === 'shop') {
      setSelectedCategory('all');
    }
  }, [mode, navParams.categorySlug, navParams.searchQuery]);

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.status === 'published')
      .filter((p) => {
        if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) return false;
        const effective = p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price;
        if (effective > maxPrice) return false;
        if (onlyInStock && p.stock <= 0) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.categoryName.toLowerCase().includes(q);
          const matchMat = p.materials.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat && !matchMat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice && a.discountPrice < a.price ? a.discountPrice : a.price;
        const priceB = b.discountPrice && b.discountPrice < b.price ? b.discountPrice : b.price;
        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // Popularity default
        return b.reviewCount - a.reviewCount;
      });
  }, [products, selectedCategory, maxPrice, onlyInStock, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPageNum - 1) * itemsPerPage,
    currentPageNum * itemsPerPage
  );

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setMaxPrice(8000);
    setOnlyInStock(false);
    setSearchQuery('');
    setSortBy('popular');
    setCurrentPageNum(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="bg-[#F7E7E7]/50 rounded-2xl p-8 mb-10 border border-[#453832]/10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-[#6E5D54] mb-2">
            <button type="button" onClick={() => navigate('home')} className="hover:underline">
              Home
            </button>
            <span>/</span>
            <span>
              {mode === 'category' && activeCategoryObj
                ? activeCategoryObj.name
                : mode === 'search'
                ? 'Search Results'
                : 'Shop All Gifts'}
            </span>
          </div>
          <h1 className="font-serif-display text-3xl sm:text-5xl font-semibold text-[#453832]">
            {mode === 'category' && activeCategoryObj
              ? activeCategoryObj.name
              : mode === 'search'
              ? `Search Results ${searchQuery ? `for “${searchQuery}”` : ''}`
              : 'All Handmade Creations'}
          </h1>
          <p className="text-sm text-[#453832]/80 mt-2 leading-relaxed">
            {mode === 'category' && activeCategoryObj
              ? activeCategoryObj.description
              : 'Explore our complete collection of 24+ small-batch handmade gifts, crochet bouquets, botanical candles, resin art, and keepsake hampers.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-xl border border-[#453832]/10 p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-[#453832]/10 pb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#453832]">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter Catalog</span>
            </div>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-[#6E5D54] hover:text-[#453832] underline"
            >
              Reset All
            </button>
          </div>

          {/* Keyword Filter */}
          <div>
            <label className="block text-xs font-semibold text-[#453832] mb-2">
              Search Keyword
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#453832]/45 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPageNum(1);
                }}
                placeholder="Pearl, crochet, candle..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-[#453832]/15 bg-[#FFF9F0] focus:outline-none focus:border-[#453832]"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <p className="text-xs font-semibold text-[#453832] mb-2.5">Categories</p>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setCurrentPageNum(1);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-[#453832] text-[#FFF9F0] font-semibold'
                    : 'text-[#453832]/80 hover:bg-[#FFF9F0]'
                }`}
              >
                <span>All Categories</span>
                <span className="tabular-nums">
                  {products.filter((p) => p.status === 'published').length}
                </span>
              </button>
              {categories
                .filter((c) => c.isActive)
                .map((cat) => {
                  const count = products.filter(
                    (p) => p.status === 'published' && p.categorySlug === cat.slug
                  ).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setCurrentPageNum(1);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        selectedCategory === cat.slug
                          ? 'bg-[#453832] text-[#FFF9F0] font-semibold'
                          : 'text-[#453832]/80 hover:bg-[#FFF9F0]'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="tabular-nums">{count}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-[#453832]">Max Price</span>
              <span className="font-mono-tabular font-semibold text-[#453832]">
                PKR {maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={600}
              max={8000}
              step={100}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPageNum(1);
              }}
              className="w-full accent-[#453832]"
            />
            <div className="flex justify-between text-[11px] text-[#453832]/55 tabular-nums mt-1">
              <span>PKR 600</span>
              <span>PKR 8,000</span>
            </div>
          </div>

          {/* Availability Filter */}
          <div className="pt-2 border-t border-[#453832]/10">
            <label className="flex items-center gap-2.5 text-xs text-[#453832] cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => {
                  setOnlyInStock(e.target.checked);
                  setCurrentPageNum(1);
                }}
                className="rounded border-[#453832]/30 accent-[#453832]"
              />
              <span>In-stock items only</span>
            </label>
          </div>
        </aside>

        {/* Right Product Grid & Sorting Bar */}
        <div className="lg:col-span-9 space-y-6">
          {/* Toolbar */}
          <div className="bg-white rounded-xl border border-[#453832]/10 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-[#453832]/75 tabular-nums">
              Showing <span className="font-semibold text-[#453832]">{paginatedProducts.length}</span>{' '}
              of <span className="font-semibold text-[#453832]">{filteredProducts.length}</span>{' '}
              handmade products
            </p>

            <div className="flex items-center gap-2 text-xs">
              <label htmlFor="sort-select" className="text-[#453832]/70">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-1.5 rounded-lg border border-[#453832]/15 bg-[#FFF9F0] text-[#453832] font-medium focus:outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid or Empty State */}
          {paginatedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#453832]/10 p-12 text-center space-y-4">
              <h3 className="font-serif-display text-2xl font-semibold text-[#453832]">
                No handmade treasures match your current filters
              </h3>
              <p className="text-xs text-[#453832]/70 max-w-md mx-auto">
                Try expanding your price range, clearing the search term, or browsing all six
                artisan categories.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-5 py-2.5 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={currentPageNum === 1}
                onClick={() => setCurrentPageNum((p) => Math.max(1, p - 1))}
                className="p-2 rounded-lg border border-[#453832]/15 bg-white disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const page = idx + 1;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPageNum(page)}
                    className={`w-9 h-9 rounded-lg text-xs font-semibold tabular-nums transition-colors ${
                      currentPageNum === page
                        ? 'bg-[#453832] text-[#FFF9F0]'
                        : 'bg-white border border-[#453832]/15 text-[#453832] hover:bg-[#F7E7E7]/50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                type="button"
                disabled={currentPageNum === totalPages}
                onClick={() => setCurrentPageNum((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-lg border border-[#453832]/15 bg-white disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. PRODUCT DETAILS PAGE (PDP with Contiguous Purchase Module, Zoom, Reviews)
// ============================================================================
export const ProductDetailsPage: React.FC = () => {
  const {
    products,
    reviews,
    navParams,
    navigate,
    addToCart,
    wishlistProductIds,
    toggleWishlist,
    submitProductReview,
    settings,
  } = useStore();

  const product = useMemo(() => {
    return (
      products.find(
        (p) => p.slug === navParams.productSlug || p.id === navParams.productId
      ) || products[0]
    );
  }, [products, navParams]);

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  React.useEffect(() => {
    setSelectedImageIdx(0);
    setSelectedVariantId(product.variants[0]?.id || '');
    setQuantity(1);
  }, [product]);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const basePrice =
    product.discountPrice && product.discountPrice < product.price
      ? product.discountPrice
      : product.price;
  const unitPrice = basePrice + (selectedVariant?.priceDelta || 0);
  const availableStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isWishlisted = wishlistProductIds.includes(product.id);

  const productReviews = useMemo(
    () => reviews.filter((r) => r.productId === product.id && r.status === 'approved'),
    [reviews, product.id]
  );

  const relatedProducts = useMemo(
    () =>
      products
        .filter(
          (p) =>
            p.status === 'published' &&
            p.categoryId === product.categoryId &&
            p.id !== product.id
        )
        .slice(0, 3),
    [products, product]
  );

  const handleBuyNow = () => {
    const ok = addToCart(product, quantity, selectedVariantId);
    if (ok) {
      navigate('checkout');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;
    submitProductReview(product.id, reviewRating, reviewTitle.trim(), reviewComment.trim());
    setReviewTitle('');
    setReviewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#6E5D54]">
        <button type="button" onClick={() => navigate('home')} className="hover:underline">
          Home
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={() => navigate('category', { categorySlug: product.categorySlug })}
          className="hover:underline"
        >
          {product.categoryName}
        </button>
        <span>/</span>
        <span className="text-[#453832] font-medium truncate">{product.name}</span>
      </nav>

      {/* Main Contiguous Purchase Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left: Image Gallery & Interactive Zoom */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-[#453832]/10">
            <ResilientImage
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
            />
            <button
              type="button"
              onClick={() => setIsZoomed((z) => !z)}
              className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-xs font-medium text-[#453832] flex items-center gap-1.5 shadow-xs"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>{isZoomed ? 'Reset Zoom' : 'Zoom Detail'}</span>
            </button>
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-24 aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIdx === idx
                      ? 'border-[#453832] shadow-xs'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <ResilientImage
                    src={imgUrl}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#453832]/10 p-6 sm:p-8 space-y-6">
          <div>
            {/* Clean Unboxed Metadata */}
            <div className="flex items-center gap-2 text-xs text-[#6E5D54] mb-2 tabular-nums">
              <span>SKU: {product.sku}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-[#453832] font-medium">
                <Star className="w-3.5 h-3.5 fill-[#D4A359] text-[#D4A359]" />
                {product.rating.toFixed(1)} ({productReviews.length} reviews)
              </span>
              <span>·</span>
              <span className={availableStock > 0 ? 'text-[#5A7252] font-medium' : 'text-[#B94A48]'}>
                {availableStock > 0 ? `In Stock (${availableStock} available)` : 'Out of Stock'}
              </span>
            </div>

            <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#453832]">
              {product.name}
            </h1>

            <div className="mt-3 flex items-baseline gap-3 tabular-nums">
              <span className="text-2xl font-bold text-[#453832]">
                PKR {unitPrice.toLocaleString()}
              </span>
              {product.discountPrice && product.discountPrice < product.price && (
                <span className="text-sm text-[#453832]/45 line-through">
                  PKR {(product.price + (selectedVariant?.priceDelta || 0)).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-[#453832]/80 leading-relaxed">{product.description}</p>

          {/* Variant Selector */}
          {product.variants.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-[#453832]/10">
              <label className="block text-xs font-semibold text-[#453832]">
                Select Option / Variant:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => {
                      setSelectedVariantId(variant.id);
                      setQuantity(1);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      selectedVariantId === variant.id
                        ? 'border-[#453832] bg-[#FFF9F0] font-semibold text-[#453832]'
                        : 'border-[#453832]/15 text-[#453832]/80 hover:border-[#453832]/40'
                    }`}
                  >
                    <span>{variant.name}</span>
                    {variant.priceDelta > 0 && (
                      <span className="font-mono-tabular text-[11px] text-[#6E5D54]">
                        +PKR {variant.priceDelta}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Action Buttons */}
          <div className="space-y-4 pt-2 border-t border-[#453832]/10">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#453832]/20 rounded-xl bg-[#FFF9F0]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2.5 text-sm font-semibold text-[#453832]"
                >
                  −
                </button>
                <span className="px-4 py-2.5 text-sm font-semibold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                  className="px-3.5 py-2.5 text-sm font-semibold text-[#453832]"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                disabled={availableStock === 0}
                onClick={() => addToCart(product, quantity, selectedVariantId)}
                className="flex-1 py-3 px-6 rounded-xl bg-[#453832] text-[#FFF9F0] text-sm font-semibold hover:bg-[#453832]/90 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Add to Wishlist"
                className="p-3 rounded-xl border border-[#453832]/20 hover:bg-[#F7E7E7]/50 transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted ? 'fill-[#C86D6D] text-[#C86D6D]' : 'text-[#453832]'
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                disabled={availableStock === 0}
                onClick={handleBuyNow}
                className="py-2.5 px-4 rounded-xl bg-[#A8B5A0]/30 border border-[#453832]/15 text-[#453832] text-xs font-semibold hover:bg-[#A8B5A0]/45 transition-colors"
              >
                Buy Now (Express Checkout)
              </button>

              {product.allowCustomization && (
                <button
                  type="button"
                  onClick={() => navigate('custom-gift-builder', { productId: product.id })}
                  className="py-2.5 px-4 rounded-xl bg-[#F7E7E7] border border-[#453832]/15 text-[#453832] text-xs font-semibold hover:bg-[#F7E7E7]/80 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Customize as a Gift Box</span>
                </button>
              )}
            </div>
          </div>

          {/* Materials, Dimensions & Delivery Details */}
          <div className="pt-4 border-t border-[#453832]/10 space-y-3 text-xs text-[#453832]/80">
            <div>
              <span className="font-semibold text-[#453832]">Materials: </span>
              <span>{product.materials}</span>
            </div>
            <div>
              <span className="font-semibold text-[#453832]">Dimensions: </span>
              <span>{product.dimensions}</span>
            </div>
            <div>
              <span className="font-semibold text-[#453832]">Care Instructions: </span>
              <span>{product.careInstructions}</span>
            </div>
            <div className="pt-2 flex flex-wrap gap-4 text-[#453832]/70">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#7A8B71]" />
                Delivery: {settings.estimatedDeliveryDays}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#7A8B71]" />
                Free delivery over PKR {settings.freeShippingThreshold.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 border-t border-[#453832]/10">
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-serif-display text-3xl font-semibold text-[#453832]">
            Customer Reviews ({productReviews.length})
          </h2>
          <p className="text-xs text-[#453832]/75">
            Share your experience with this handmade piece. All verified reviews help our
            artisan studio refine every detail.
          </p>

          <form
            onSubmit={handleReviewSubmit}
            className="bg-white p-6 rounded-xl border border-[#453832]/10 space-y-4"
          >
            <h3 className="font-serif-display text-xl font-semibold text-[#453832]">
              Write a Review
            </h3>
            <div>
              <label className="block text-xs font-semibold mb-1">Rating</label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#453832]/20 bg-[#FFF9F0]"
              >
                <option value={5}>5 Stars — Exceptional</option>
                <option value={4}>4 Stars — Lovely</option>
                <option value={3}>3 Stars — Good</option>
                <option value={2}>2 Stars — Fair</option>
                <option value={1}>1 Star — Needs Improvement</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Review Headline</label>
              <input
                type="text"
                required
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Summarize your thoughts..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#453832]/20 bg-[#FFF9F0]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Your Review</label>
              <textarea
                rows={3}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Tell us about the quality, packaging, or gifting experience..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#453832]/20 bg-[#FFF9F0]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
            >
              Submit Review
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {productReviews.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-[#453832]/10 text-center text-xs text-[#453832]/70">
              No reviews yet for this piece. Be the first to share your thoughts!
            </div>
          ) : (
            productReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-xl border border-[#453832]/10 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[#D4A359]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[#453832]/55">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-serif-display text-lg font-semibold text-[#453832]">
                  {rev.title}
                </h4>
                <p className="text-xs text-[#453832]/80 leading-relaxed">{rev.comment}</p>
                <p className="text-[11px] text-[#6E5D54] pt-1">
                  — {rev.customerName} · Verified Studio Collector
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-[#453832]/10">
          <h2 className="font-serif-display text-3xl font-semibold text-[#453832] mb-6">
            You May Also Cherish
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// ============================================================================
// 4. MULTI-STEP CUSTOM GIFT BUILDER PAGE
// ============================================================================
export const CustomGiftBuilderPage: React.FC = () => {
  const { categories, products, navParams, addToCart, navigate, notify } = useStore();

  const initialProduct = useMemo(() => {
    if (navParams.productId) {
      const found = products.find((p) => p.id === navParams.productId);
      if (found) return found;
    }
    return products.find((p) => p.allowCustomization) || products[0];
  }, [products, navParams.productId]);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    initialProduct.categoryId
  );
  const [selectedProductId, setSelectedProductId] = useState<string>(initialProduct.id);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    initialProduct.variants[0]?.id || ''
  );

  const [recipientName, setRecipientName] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [giftCardMessage, setGiftCardMessage] = useState('');
  const [wrappingStyle, setWrappingStyle] = useState<
    'classic-cream-ribbon' | 'blush-botanical-wax' | 'sage-linen-keepsake'
  >('blush-botanical-wax');
  const [targetBudget, setTargetBudget] = useState('PKR 3,000 – PKR 5,000');
  const [referenceImageName, setReferenceImageName] = useState('');
  const [referenceImagePreview, setReferenceImagePreview] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const activeProduct =
    products.find((p) => p.id === selectedProductId) || initialProduct;
  const categoryProducts = products.filter(
    (p) => p.categoryId === selectedCategoryId && p.status === 'published'
  );

  const wrappingOptions = [
    {
      id: 'classic-cream-ribbon' as const,
      name: 'Classic Unbleached Linen & Satin Ribbon',
      price: 0,
      desc: 'Complimentary signature studio wrap with kraft tag.',
    },
    {
      id: 'blush-botanical-wax' as const,
      name: 'Blush Silk Ribbon + Gold Botanical Wax Seal',
      price: 250,
      desc: 'Hand-stamped real gold wax seal with dried lavender sprig.',
    },
    {
      id: 'sage-linen-keepsake' as const,
      name: 'Heirloom Rigid Keepsake Box + Sage Ribbon',
      price: 450,
      desc: 'Magnetic rigid linen presentation box for lifelong storage.',
    },
  ];

  const selectedWrapObj =
    wrappingOptions.find((w) => w.id === wrappingStyle) || wrappingOptions[0];

  const baseUnitPrice =
    activeProduct.discountPrice && activeProduct.discountPrice < activeProduct.price
      ? activeProduct.discountPrice
      : activeProduct.price;
  const variantDelta =
    activeProduct.variants.find((v) => v.id === selectedVariantId)?.priceDelta || 0;
  const totalCustomPrice = baseUnitPrice + variantDelta + selectedWrapObj.price;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      notify('Please upload a JPG, PNG, or WEBP image file.', 'error');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      notify('Image file size must be under 4 MB.', 'error');
      return;
    }
    setReferenceImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setReferenceImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
    notify(`Attached reference image "${file.name}" (Demo Upload Mode).`, 'info');
  };

  const handleCompleteGift = () => {
    if (!recipientName.trim()) {
      notify("Please enter the recipient's name in Step 2.", 'error');
      setStep(2);
      return;
    }
    if (!giftCardMessage.trim()) {
      notify('Please write a gift card note in Step 2.', 'error');
      setStep(2);
      return;
    }

    const ok = addToCart(activeProduct, 1, selectedVariantId, {
      isCustomGift: true,
      recipientName: recipientName.trim(),
      personalMessage: personalMessage.trim() || 'Standard Studio Finish',
      giftCardMessage: giftCardMessage.trim(),
      wrappingStyle,
      wrappingPrice: selectedWrapObj.price,
      targetBudget,
      referenceImageName: referenceImageName || undefined,
      referenceImagePreview: referenceImagePreview || undefined,
      specialInstructions: specialInstructions.trim(),
    });

    if (ok) {
      navigate('cart');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <p className="text-xs font-semibold text-[#6E5D54]">Bespoke Gifting Atelier</p>
        <h1 className="font-serif-display text-3xl sm:text-5xl font-semibold text-[#453832]">
          Custom Gift Builder
        </h1>
        <p className="text-sm text-[#453832]/75">
          Personalize any handmade piece with custom engraving/stitching notes, handwritten
          cotton-rag gift cards, and botanical wax-sealed wrapping.
        </p>
      </div>

      {/* Stepper Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { num: 1 as const, label: '01. Choose Gift & Variant' },
          { num: 2 as const, label: '02. Recipient & Card Note' },
          { num: 3 as const, label: '03. Wrapping & Reference' },
          { num: 4 as const, label: '04. Review Keepsake' },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setStep(s.num)}
            className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all ${
              step === s.num
                ? 'bg-[#453832] text-[#FFF9F0] border-[#453832]'
                : step > s.num
                ? 'bg-[#A8B5A0]/25 text-[#453832] border-[#453832]/15'
                : 'bg-white text-[#453832]/60 border-[#453832]/10'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Builder Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#453832]/10 p-6 sm:p-8 space-y-6">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-serif-display text-2xl font-semibold text-[#453832]">
                Step 1: Choose Category, Product & Variant
              </h2>

              <div>
                <label className="block text-xs font-semibold mb-2">
                  1. Select Gift Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories
                    .filter((c) => c.isActive)
                    .map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategoryId(cat.id);
                          const firstProd = products.find((p) => p.categoryId === cat.id);
                          if (firstProd) {
                            setSelectedProductId(firstProd.id);
                            setSelectedVariantId(firstProd.variants[0]?.id || '');
                          }
                        }}
                        className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                          selectedCategoryId === cat.id
                            ? 'bg-[#453832] text-[#FFF9F0]'
                            : 'bg-[#FFF9F0] text-[#453832] border border-[#453832]/15'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2">
                  2. Choose Base Handmade Creation
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categoryProducts.map((prod) => {
                    const pPrice =
                      prod.discountPrice && prod.discountPrice < prod.price
                        ? prod.discountPrice
                        : prod.price;
                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => {
                          setSelectedProductId(prod.id);
                          setSelectedVariantId(prod.variants[0]?.id || '');
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                          selectedProductId === prod.id
                            ? 'border-[#453832] bg-[#F7E7E7]/40'
                            : 'border-[#453832]/12 hover:bg-[#FFF9F0]'
                        }`}
                      >
                        <ResilientImage
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-14 h-14 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#453832] truncate">
                            {prod.name}
                          </p>
                          <p className="text-xs text-[#6E5D54] font-mono-tabular">
                            PKR {pPrice.toLocaleString()}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeProduct.variants.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold mb-2">
                    3. Select Available Variant
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeProduct.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`p-3 rounded-xl border text-left text-xs flex justify-between ${
                          selectedVariantId === v.id
                            ? 'border-[#453832] bg-[#FFF9F0] font-semibold'
                            : 'border-[#453832]/15'
                        }`}
                      >
                        <span>{v.name}</span>
                        {v.priceDelta > 0 && <span>+PKR {v.priceDelta}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
                >
                  Continue to Personalization →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-serif-display text-2xl font-semibold text-[#453832]">
                Step 2: Recipient Details & Handwritten Gift Card
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Recipient's Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Sara Rehman"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Target Gifting Budget
                  </label>
                  <select
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                  >
                    <option value="Under PKR 2,500">Under PKR 2,500</option>
                    <option value="PKR 3,000 – PKR 5,000">PKR 3,000 – PKR 5,000</option>
                    <option value="PKR 5,000 – PKR 8,000">PKR 5,000 – PKR 8,000</option>
                    <option value="PKR 8,000+ Luxury Bespoke">PKR 8,000+ Luxury Bespoke</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Personalization / Engraving / Color Inscription on Item
                </label>
                <input
                  type="text"
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder="e.g. Initial 'S' on pendant, or pastel blush & ivory yarn tones"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Handwritten Cotton-Rag Gift Card Message * (Max 250 chars)
                </label>
                <textarea
                  rows={4}
                  maxLength={250}
                  required
                  value={giftCardMessage}
                  onChange={(e) => setGiftCardMessage(e.target.value)}
                  placeholder="Write the personal note our calligrapher will hand-letter on your wax-sealed card..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
                <p className="text-[11px] text-[#453832]/55 text-right mt-1 tabular-nums">
                  {giftCardMessage.length} / 250 characters
                </p>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-[#453832]/20 text-xs font-semibold"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
                >
                  Continue to Gift Wrapping →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-serif-display text-2xl font-semibold text-[#453832]">
                Step 3: Gift Wrapping, Reference Image & Special Instructions
              </h2>

              <div className="space-y-2.5">
                <label className="block text-xs font-semibold">Select Gift Wrapping Style</label>
                {wrappingOptions.map((wrap) => (
                  <button
                    key={wrap.id}
                    type="button"
                    onClick={() => setWrappingStyle(wrap.id)}
                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                      wrappingStyle === wrap.id
                        ? 'border-[#453832] bg-[#F7E7E7]/45'
                        : 'border-[#453832]/15 hover:bg-[#FFF9F0]'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#453832]">{wrap.name}</p>
                      <p className="text-[11px] text-[#453832]/70 mt-0.5">{wrap.desc}</p>
                    </div>
                    <span className="text-xs font-mono-tabular font-semibold text-[#453832] shrink-0 ml-4">
                      {wrap.price === 0 ? 'Complimentary' : `+PKR ${wrap.price}`}
                    </span>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Optional Reference Image Upload (Demo Upload Mode — JPG/PNG up to 4MB)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="block w-full text-xs text-[#453832] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#F7E7E7] file:text-[#453832] hover:file:bg-[#F7E7E7]/80"
                />
                {referenceImageName && (
                  <div className="mt-2 flex items-center gap-3 p-2.5 rounded-lg bg-[#FFF9F0] border border-[#453832]/15 text-xs">
                    {referenceImagePreview && (
                      <img
                        src={referenceImagePreview}
                        alt="Reference preview"
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <span className="truncate flex-1">{referenceImageName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setReferenceImageName('');
                        setReferenceImagePreview('');
                      }}
                      className="text-[#B94A48] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Special Instructions for Our Artisans
                </label>
                <textarea
                  rows={3}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any specific ribbon color preference, fragrance sensitivity, or delivery timing notes..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#453832]/20 bg-[#FFF9F0] text-xs"
                />
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-[#453832]/20 text-xs font-semibold"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-[#453832] text-[#FFF9F0] text-xs font-semibold"
                >
                  Review Customized Gift →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="font-serif-display text-2xl font-semibold text-[#453832]">
                Step 4: Review & Add Customized Keepsake to Bag
              </h2>

              <div className="bg-[#FFF9F0] rounded-xl p-5 border border-[#453832]/12 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-[#453832]/10">
                  <span className="text-[#453832]/70">Selected Creation:</span>
                  <span className="font-semibold">{activeProduct.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#453832]/10">
                  <span className="text-[#453832]/70">Recipient Name:</span>
                  <span className="font-semibold">{recipientName || 'Not entered yet'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#453832]/10">
                  <span className="text-[#453832]/70">Item Personalization:</span>
                  <span className="font-semibold">{personalMessage || 'Standard Studio Finish'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#453832]/10">
                  <span className="text-[#453832]/70">Wrapping Style:</span>
                  <span className="font-semibold">{selectedWrapObj.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#453832]/10">
                  <span className="text-[#453832]/70">Target Budget:</span>
                  <span className="font-semibold">{targetBudget}</span>
                </div>
                {referenceImageName && (
                  <div className="flex justify-between py-1 border-b border-[#453832]/10">
                    <span className="text-[#453832]/70">Reference Image:</span>
                    <span className="font-semibold">{referenceImageName} (Demo Attached)</span>
                  </div>
                )}
                <div className="pt-2">
                  <p className="text-[#453832]/70 mb-1">Gift Card Message:</p>
                  <p className="italic font-serif-display text-base text-[#453832] bg-white p-3 rounded-lg border border-[#453832]/10">
                    “{giftCardMessage || 'No gift card message entered yet.'}”
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-[#453832]/20 text-xs font-semibold"
                >
                  ← Edit Wrapping
                </button>
                <button
                  type="button"
                  onClick={handleCompleteGift}
                  className="px-7 py-3.5 rounded-xl bg-[#453832] text-[#FFF9F0] text-sm font-semibold hover:bg-[#453832]/90 flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Custom Gift to Bag (PKR {totalCustomPrice.toLocaleString()})</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Live Summary Card */}
        <aside className="lg:col-span-4 bg-white rounded-2xl border border-[#453832]/10 p-6 space-y-5">
          <p className="text-xs font-semibold text-[#6E5D54]">Live Custom Gift Preview</p>
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#FFF9F0]">
            <ResilientImage
              src={activeProduct.images[0]}
              alt={activeProduct.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-serif-display text-2xl font-semibold text-[#453832]">
              {activeProduct.name}
            </h3>
            <p className="text-xs text-[#453832]/70 mt-1">
              {activeProduct.variants.find((v) => v.id === selectedVariantId)?.name ||
                'Standard Edition'}
            </p>
          </div>

          <div className="border-t border-[#453832]/10 pt-4 space-y-2 text-xs tabular-nums">
            <div className="flex justify-between">
              <span className="text-[#453832]/70">Base Item Price</span>
              <span>PKR {(baseUnitPrice + variantDelta).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#453832]/70">Gift Wrapping & Seal</span>
              <span>
                {selectedWrapObj.price === 0
                  ? 'Free'
                  : `PKR ${selectedWrapObj.price.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#453832]/10 text-sm font-bold text-[#453832]">
              <span>Estimated Total</span>
              <span>PKR {totalCustomPrice.toLocaleString()}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
