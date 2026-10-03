// WishlistModal Component:
// A slide-over panel that allows users to see all the items they have liked/favorited.
// Users can review their saved pins & stickers, see prices, add items to cart, or remove them.

import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistModal = ({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
}) => {
  // If not open, don't render anything
  if (!isOpen) return null;

  // Filter the full catalog to get the list of liked products
  const likedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop overlay */}
      <div
        className="absolute inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-amber-200">
          {/* Header Bar */}
          <div className="p-5 border-b border-amber-100 flex items-center justify-between bg-[#FFFDF7]">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              <h2 className="font-display font-bold text-lg text-stone-900">
                Liked Items ({likedProducts.length})
              </h2>
            </div>
            <div className="flex items-center gap-1">
              {likedProducts.length > 0 && (
                <button
                  onClick={() => {
                    likedProducts.forEach((p) => onToggleWishlist(p.id));
                  }}
                  className="text-xs text-stone-400 hover:text-rose-600 font-medium px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Close wishlist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Liked Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-left">
            {likedProducts.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                  <Heart className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-base text-stone-900">
                  No liked items yet
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Click the heart icon on any button pin or sticker card to save your favorites here!
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              likedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 rounded-2xl border border-stone-100 bg-[#FFFDF7] hover:border-amber-200 transition-colors"
                >
                  {/* Product thumbnail */}
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-xl object-cover bg-amber-100/40 shrink-0 cursor-pointer"
                    onClick={() => {
                      onClose();
                      onQuickView(product);
                    }}
                  />

                  {/* Product details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => {
                            onClose();
                            onQuickView(product);
                          }}
                          className="font-display font-semibold text-xs text-stone-900 hover:text-amber-800 cursor-pointer line-clamp-1"
                        >
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onToggleWishlist(product.id)}
                          className="flex items-center gap-1 text-stone-400 hover:text-rose-600 text-[11px] font-semibold px-2 py-0.5 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove from liked"
                          aria-label={`Remove ${product.name} from liked items`}
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                      <div className="text-[11px] text-amber-800 font-medium">
                        {product.category === 'button-pin' ? 'Button Pin' : product.category === 'sticker' ? 'Vinyl Sticker' : 'Pin & Sticker Pack'}
                      </div>
                    </div>

                    {/* Price and Add to Cart action */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                      <div className="font-display font-bold text-sm text-stone-900 tabular-nums">
                        ₱{product.price.toFixed(2)}
                      </div>

                      <button
                        onClick={() => {
                          onAddToCart(product);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg shadow-2xs active:scale-95 transition-all cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer action if items are liked */}
          {likedProducts.length > 0 && (
            <div className="p-5 border-t border-amber-100 bg-[#FFFDF7] space-y-2">
              <button
                onClick={() => {
                  likedProducts.forEach((p) => onAddToCart(p));
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-display font-bold text-xs tracking-wide shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Add All ({likedProducts.length}) to Cart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
