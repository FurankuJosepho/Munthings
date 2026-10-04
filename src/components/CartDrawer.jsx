// CartDrawer Component:
// A slide-out panel showing the items currently added to the shopping cart.
// Allows customers to increase/decrease quantity, apply promo codes, and proceed to checkout.

import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Check, Tag } from 'lucide-react';

export const CartDrawer = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onNavigateToShop,
}) => {
  // Promo code states
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // If drawer is closed, don't render anything
  if (!isOpen) return null;

  // Free shipping threshold target: ₱500
  const FREE_SHIPPING_THRESHOLD = 500.0;

  // Calculate items subtotal
  const subtotal = items.reduce(
    (acc, it) => acc + (it.unitPrice ?? it.product.price) * it.quantity,
    0
  );

  // 10% discount if code MUNMOON10 is applied
  const discount = appliedPromo === 'MUNMOON10' ? subtotal * 0.1 : 0;

  // Free shipping over ₱500, otherwise flat ₱60
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 60.0;
  const finalTotal = subtotal - discount + shipping;

  // Apply promo code handler
  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'MUNMOON10') {
      setAppliedPromo('MUNMOON10');
      setPromoError('');
    } else {
      setPromoError('Try code MUNMOON10 for 10% off');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark semi-transparent background overlay */}
      <div
        className="absolute inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-amber-200">
          {/* 1. Header Bar */}
          <div className="p-5 border-b border-amber-100 flex items-center justify-between bg-[#FFFDF7]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h2 className="font-display font-bold text-lg text-stone-900">
                Your Cart ({items.reduce((acc, it) => acc + it.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-left">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-base text-stone-900">
                  Your cart is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Find cute button pins and waterproof stickers to bring a little sunshine!
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToShop();
                  }}
                  className="mt-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Browse Pins &amp; Stickers
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemKey = `${item.product.id}-${item.selectedSize || 'default'}-${item.surface || 'default'}-${item.includePackaging ? 'pkg' : 'nopkg'}`;
                const itemUnitPrice = item.unitPrice ?? item.product.price;
                return (
                  <div
                    key={itemKey}
                    className="flex gap-3 p-3 rounded-2xl border border-stone-100 bg-[#FFFDF7] hover:border-amber-200 transition-colors"
                  >
                    {/* Item Image */}
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 rounded-xl object-cover bg-amber-100/40 shrink-0"
                    />

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display font-semibold text-xs text-stone-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.product.id, item.selectedSize, item.surface, item.includePackaging)}
                            className="text-stone-400 hover:text-rose-500 p-0.5 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {item.product.category === 'button-pin' ? 'Button Pin' : item.product.category === 'sticker' ? 'Vinyl Sticker' : 'Pin & Sticker Pack'}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.selectedSize && (
                            <span className="text-[10px] font-bold text-amber-950 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300">
                              {item.selectedSize}
                            </span>
                          )}
                          {item.surface && (
                            <span className="text-[10px] font-semibold text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                              {item.surface}
                            </span>
                          )}
                          {item.includePackaging && (
                            <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                              +Packaging
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity controls & Price */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity - (item.quantity > 50 ? 50 : 1), item.surface, item.includePackaging)}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity + (item.quantity >= 50 ? 50 : 1), item.surface, item.includePackaging)}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="font-display font-bold text-xs text-stone-900 tabular-nums">
                            ₱{(itemUnitPrice * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-[10px] text-stone-400 tabular-nums">
                            ₱{itemUnitPrice.toFixed(2)}/pc
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 4. Checkout Summary Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-amber-100 bg-[#FFFDF7] space-y-4 text-left">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Promo code (try MUNMOON10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 uppercase tracking-wider bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {appliedPromo && (
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Code MUNMOON10 applied (10% off)!
                </div>
              )}
              {promoError && (
                <div className="text-[11px] text-amber-700 font-medium">
                  {promoError}
                </div>
              )}

              {/* Price breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-semibold text-stone-800">
                    ₱{subtotal.toFixed(2)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount (10%)</span>
                    <span className="tabular-nums">-₱{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="tabular-nums font-semibold text-stone-800">
                    {shipping === 0 ? 'FREE' : `₱${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
                  <span>Total</span>
                  <span className="tabular-nums font-display text-base">
                    ₱{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-display font-bold text-sm tracking-wide shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
