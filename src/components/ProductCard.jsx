// ProductCard Component:
// Renders an individual product item in a card format.
// Displays the image, title, price, category, rating, wishlist toggle, and "Add to Cart" button.

import React, { useState } from 'react';
import { Star, Plus, Eye, Check, Heart } from 'lucide-react';

export const ProductCard = ({
  product,
  onAddToCart,
  onQuickView,
  isWishlisted,
  onToggleWishlist,
}) => {
  // Temporary state to show "Added!" confirmation when clicked
  const [justAdded, setJustAdded] = useState(false);

  // Handle adding product to shopping cart
  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  // Friendly human-readable category text
  const categoryLabel = {
    'button-pin': 'Button Pin Badge',
    'sticker': 'Waterproof Vinyl Sticker',
    'pack': 'Sticker & Pin Pack',
  }[product.category] || 'Barth\'s Studio Flair';

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-white rounded-2xl border border-amber-200/70 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-left"
    >
      {/* Product Image Area */}
      <div className="relative aspect-4/3 w-full bg-[#FAF5EA] overflow-hidden">
        {/* Optional promotional badge (e.g. Bestseller, Classic) */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10 text-[11px] font-bold uppercase tracking-wider text-amber-950 bg-amber-300/90 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-xs">
            {product.badge}
          </div>
        )}

        {/* Wishlist toggle heart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-xs text-stone-500 hover:text-rose-500 shadow-xs transition-colors hover:scale-110 active:scale-95"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-stone-500'
            }`}
          />
        </button>

        {/* Product photo */}
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Quick View button shown on hover */}
        <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/95 text-stone-900 text-xs font-semibold rounded-lg shadow-sm hover:bg-white active:scale-95 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category & customer rating */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5 font-medium">
            <span className="text-amber-800 font-semibold tracking-wide uppercase text-[11px]">
              {categoryLabel}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="tabular-nums font-semibold text-stone-700">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-stone-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product name */}
          <h3 className="font-display font-semibold text-stone-900 text-base leading-snug line-clamp-1 group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>

          {/* Short product description */}
          <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Available button pin sizes with price tags */}
        {product.availableSizes && product.availableSizes.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-amber-900/70 uppercase tracking-wider">
              <span>Sizes &amp; Rates:</span>
              <span className="text-teal-700 font-semibold lowercase">glossy / matte</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.availableSizes.map((size) => {
                const sizePriceMap = {
                  '25mm': '₱15',
                  '32mm': '₱18',
                  '44mm': '₱23',
                  '58mm': '₱25',
                  '75mm': '₱38',
                };
                return (
                  <span
                    key={size}
                    className="text-[11px] font-semibold text-amber-950 bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 rounded-md flex items-center gap-1"
                  >
                    <span>{size}</span>
                    {sizePriceMap[size] && (
                      <span className="text-stone-600 font-normal">({sizePriceMap[size]})</span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Sticker Size Badge */}
        {product.category === 'sticker' && (
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-amber-900/70 uppercase tracking-wider">
              Sticker Size:
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[11px] font-semibold text-stone-900 bg-amber-100/90 border border-amber-300/80 px-2.5 py-0.5 rounded-md">
                1.5 inches
              </span>
            </div>
          </div>
        )}

        {/* Highlighted feature / specification pill */}
        <div className="text-[11px] text-teal-800 bg-teal-50/70 rounded-md px-2.5 py-1 font-medium flex items-center justify-between border border-teal-100">
          <span className="text-stone-500">Spec:</span>
          <span className="truncate max-w-[200px] font-semibold">
            {product.category === 'button-pin'
              ? 'Glossy or Matte · Tinplate steel'
              : (product.pinType || product.stickerFinish || product.dimensions)}
          </span>
        </div>

        {/* Price and Add to Cart action */}
        <div className="flex items-center justify-between pt-2 border-t border-amber-100/80">
          <div>
            <div className="text-[11px] text-stone-400 uppercase font-semibold">
              {product.priceRange ? 'Price' : 'Price'}
            </div>
            <div className="font-display font-bold text-lg text-stone-950 tabular-nums leading-tight">
              {product.priceRange ? product.priceRange : `₱${product.price.toFixed(2)}`}
            </div>
            {product.category === 'button-pin' && (
              <div className="text-[10px] text-amber-800 font-medium">
                Bulk rates down to ₱8.00/pc
              </div>
            )}
          </div>

          <button
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-xs hover:shadow active:scale-95'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
