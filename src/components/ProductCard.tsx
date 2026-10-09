/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigate, addToCart, wishlistProductIds, toggleWishlist } = useStore();
  const isWishlisted = wishlistProductIds.includes(product.id);

  const effectivePrice =
    product.discountPrice && product.discountPrice < product.price
      ? product.discountPrice
      : product.price;

  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);

  return (
    <article className="group bg-white rounded-xl border border-[#453832]/8 overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col h-full">
      {/* Image Container (70% height emphasis) */}
      <div className="relative aspect-[4/3] w-full bg-[#FFF9F0] overflow-hidden">
        <button
          type="button"
          onClick={() => navigate('product-details', { productSlug: product.slug, productId: product.id })}
          className="w-full h-full block text-left focus:outline-none"
        >
          <ResilientImage
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </button>

        {/* Wishlist toggle button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#453832] hover:bg-white transition-colors shadow-xs"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? 'fill-[#C86D6D] text-[#C86D6D]' : 'text-[#453832]'
            }`}
          />
        </button>

        {/* Quick Add button on hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          <button
            type="button"
            disabled={product.stock === 0}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1, product.variants[0]?.id);
            }}
            className="w-full py-2 px-4 rounded-lg bg-[#453832]/95 text-[#FFF9F0] text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#453832] disabled:opacity-50 whitespace-nowrap"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.stock > 0 ? 'Quick Add to Bag' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Clean Unboxed Metadata (Zero-Pill Discipline) */}
          <div className="flex items-center justify-between text-xs text-[#453832]/65 mb-1.5">
            <span className="truncate">{product.categoryName}</span>
            <span className="flex items-center gap-1 shrink-0 tabular-nums">
              <Star className="w-3 h-3 fill-[#D4A359] text-[#D4A359]" />
              <span>{product.rating.toFixed(1)}</span>
              <span aria-hidden="true">·</span>
              <span>
                {product.isBestseller
                  ? 'Bestseller'
                  : product.isNewArrival
                  ? 'New Arrival'
                  : product.stock <= 5
                  ? `Only ${product.stock} left`
                  : 'In Stock'}
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate('product-details', { productSlug: product.slug, productId: product.id })}
            className="text-left block w-full group/title"
          >
            <h3 className="font-serif-display text-xl font-semibold text-[#453832] group-hover/title:text-[#7A8B71] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </button>

          <p className="text-xs text-[#453832]/70 mt-1 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Price Row */}
        <div className="mt-4 pt-3 border-t border-[#453832]/8 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="text-sm font-semibold text-[#453832]">
              PKR {effectivePrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#453832]/45 line-through">
                PKR {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {product.allowCustomization && (
            <button
              type="button"
              onClick={() => navigate('custom-gift-builder', { productId: product.id })}
              className="text-xs text-[#6E5D54] hover:text-[#453832] underline underline-offset-4 whitespace-nowrap"
            >
              Personalize
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
