// ProductModal Component:
// A pop-up dialog that displays deep product details, high-resolution photography,
// material specifications, and a quantity selector with an "Add to Cart" button.

import React, { useState, useEffect } from 'react';
import { X, Star, Check, ShoppingBag, Sparkles } from 'lucide-react';

export const ProductModal = ({
  product,
  onClose,
  onAddToCart,
}) => {
  // Quantity state for buying multiple items
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [addedNotice, setAddedNotice] = useState(false);

  // Sync selected size whenever product changes
  useEffect(() => {
    if (product?.availableSizes && product.availableSizes.length > 0) {
      setSelectedSize(product.availableSizes[0]);
    } else {
      setSelectedSize(null);
    }
    setQuantity(1);
  }, [product]);

  // Return null if no product is selected
  if (!product) return null;

  // Add the item with selected quantity & size to cart and close modal
  const handleAdd = () => {
    onAddToCart(product, quantity, selectedSize);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full border border-amber-200 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product view"
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-stone-900 shadow-sm transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Product Photo Showcase */}
          <div className="bg-[#FAF5EA] p-6 flex flex-col items-center justify-center relative min-h-[340px]">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="max-h-[360px] w-full object-contain rounded-xl shadow-xs"
            />

            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-200/60 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Handcrafted by Barth’s Studio</span>
            </div>
          </div>

          {/* Right Column: Information & Purchase Section */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-5 text-left">
            <div>
              {/* Category & Star Rating */}
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                <span className="text-amber-800 uppercase font-bold tracking-wider text-[11px]">
                  {product.category === 'button-pin'
                    ? 'Round Button Pin'
                    : product.category === 'sticker'
                    ? 'Weatherproof Vinyl Sticker'
                    : 'Pin & Sticker Set'}
                </span>
                <span aria-hidden="true">·</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-stone-800">{product.rating.toFixed(1)}</span>
                  <span className="text-stone-400">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Product Title */}
              <h2 className="font-display font-bold text-2xl text-stone-900 leading-snug">
                {product.name}
              </h2>

              {/* Price display & In-stock badge */}
              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-display font-bold text-2xl text-stone-900 tabular-nums">
                  ₱{(product.price * quantity).toFixed(2)}
                </span>
                {quantity > 1 && (
                  <span className="text-xs text-stone-400 tabular-nums">
                    (₱{product.price.toFixed(2)} each)
                  </span>
                )}
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  In Stock &amp; Ready to Ship
                </span>
              </div>

              {/* Product description */}
              <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Specifications checklist */}
              <div className="mt-4 space-y-1.5 border-t border-amber-100 pt-3">
                <div className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Item Specifications:
                </div>
                {product.details && product.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-stone-600">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              {/* Size Selector for Button Pins */}
              {product.availableSizes && product.availableSizes.length > 0 && (
                <div className="mt-4 pt-3 border-t border-amber-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Button Pin Size (Lanyard Fit):
                    </span>
                    <span className="text-xs font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md">
                      Selected: {selectedSize}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                          selectedSize === size
                            ? 'bg-amber-300 border-amber-500 text-stone-950 shadow-xs ring-2 ring-amber-400/50'
                            : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                        }`}
                      >
                        <span>{size}</span>
                        {selectedSize === size && (
                          <Check className="w-3.5 h-3.5 text-stone-950 stroke-[3]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sticker Size Indicator */}
              {product.category === 'sticker' && (
                <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Sticker Size:
                  </span>
                  <span className="text-xs font-bold text-stone-900 bg-amber-100/90 border border-amber-300/80 px-3 py-1 rounded-md">
                    1.5 inches
                  </span>
                </div>
              )}
            </div>

            {/* Quantity Stepper & Add Button */}
            <div className="pt-2 border-t border-stone-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-stone-700 hover:bg-white active:scale-95 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold tabular-nums text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-stone-700 hover:bg-white active:scale-95 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={addedNotice}
                  className={`flex-1 py-3 px-4 rounded-xl font-display font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                    addedNotice
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-400 hover:bg-amber-300 active:scale-95 text-stone-950'
                  }`}
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart (₱{(product.price * quantity).toFixed(2)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
