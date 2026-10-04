// ProductModal Component:
// A pop-up dialog that displays deep product details, high-resolution photography,
// material specifications, dynamic bulk pricing calculator, and studio pricing matrix.

import React, { useState, useEffect } from 'react';
import { X, Star, Check, ShoppingBag, Sparkles, Package, Layers, Info } from 'lucide-react';
import { BUTTON_PIN_PRICING, calculateButtonPinPrice } from '../data/products.js';

export const ProductModal = ({
  product,
  onClose,
  onAddToCart,
}) => {
  // Quantity state for buying multiple items (default 50 for button pins bulk tier, or 1)
  const isButtonPin = product?.category === 'button-pin';
  const [quantity, setQuantity] = useState(50);
  const [selectedSize, setSelectedSize] = useState('25mm');
  const [selectedSurface, setSelectedSurface] = useState('Glossy');
  const [includePackaging, setIncludePackaging] = useState(false);
  const [showFullTable, setShowFullTable] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  // Sync selected size whenever product changes
  useEffect(() => {
    if (product?.availableSizes && product.availableSizes.length > 0) {
      setSelectedSize(product.availableSizes[0]);
    } else {
      setSelectedSize(null);
    }
    setQuantity(product?.category === 'button-pin' ? 50 : 1);
    setSelectedSurface('Glossy');
    setIncludePackaging(false);
  }, [product]);

  // Return null if no product is selected
  if (!product) return null;

  // Calculate dynamic pricing based on size, quantity, and packaging
  const pricing = isButtonPin
    ? calculateButtonPinPrice(selectedSize || '25mm', quantity, includePackaging)
    : {
        unitPrice: product.price,
        packagingPrice: 0,
        totalUnitPrice: product.price,
        total: product.price * quantity,
      };

  const currentSizeData = BUTTON_PIN_PRICING[selectedSize || '25mm'] || BUTTON_PIN_PRICING['25mm'];

  // Add the item with selected quantity & options to cart and close modal
  const handleAdd = () => {
    onAddToCart(product, quantity, selectedSize, {
      surface: selectedSurface,
      includePackaging,
      unitPrice: pricing.totalUnitPrice,
      packagingPrice: pricing.packagingPrice,
    });
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full border border-amber-200 shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
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

        <div className="overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Product Photo & Studio Pricing Table */}
          <div className="lg:col-span-5 bg-[#FAF5EA] p-6 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-amber-200/70">
            <div className="w-full flex flex-col items-center">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="max-h-[260px] sm:max-h-[300px] w-full object-contain rounded-2xl shadow-xs"
              />

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-200/70 px-3.5 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Handcrafted by Barth’s Studio</span>
              </div>
            </div>

            {/* Quick Price Sheet Highlight */}
            {isButtonPin && (
              <div className="w-full mt-6 bg-white rounded-2xl p-4 border border-amber-200 shadow-2xs text-left">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-600" />
                    <span>Studio Bulk Pricing Rates</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-950 bg-amber-300 px-2 py-0.5 rounded">
                    Glossy or Matte
                  </span>
                </div>
                <div className="text-[11px] text-stone-600 leading-relaxed mb-3">
                  Tiered discounts apply automatically based on order size.
                </div>

                <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-semibold">
                  {Object.entries(BUTTON_PIN_PRICING).map(([sz, data]) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <div
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 border-amber-500 text-stone-950 font-bold shadow-xs'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-amber-50'
                        }`}
                      >
                        <div>{sz}</div>
                        <div className="text-[9px] text-stone-800 font-bold mt-0.5">
                          ₱{data.tiers[0].unitPrice}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Information, Selectors & Purchase Section */}
          <div className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-between space-y-5 text-left">
            <div className="space-y-4">
              {/* Category & Star Rating */}
              <div className="flex items-center gap-2 text-xs text-stone-500">
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
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-stone-900 leading-snug">
                  {product.name}
                </h2>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Dynamic Price Display */}
              <div className="bg-[#FAF5EA] p-4 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] text-stone-500 font-semibold uppercase tracking-wider">
                    Total ({quantity} {quantity === 1 ? 'pc' : 'pcs'})
                  </div>
                  <div className="font-display font-bold text-2xl sm:text-3xl text-stone-950 tabular-nums">
                    ₱{pricing.total.toFixed(2)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-amber-900 bg-amber-200/70 px-2.5 py-1 rounded-md inline-block tabular-nums">
                    ₱{pricing.totalUnitPrice.toFixed(2)} / pc
                  </div>
                  {pricing.packagingPrice > 0 && (
                    <div className="text-[10px] text-stone-500 mt-0.5">
                      (Includes ₱{pricing.packagingPrice.toFixed(2)} packaging)
                    </div>
                  )}
                </div>
              </div>

              {/* 1. Size Selection */}
              {product.availableSizes && product.availableSizes.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Select Size:
                    </span>
                    <span className="text-xs font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md">
                      Selected: {selectedSize} (50-100 pcs: ₱{currentSizeData.tiers[0].unitPrice.toFixed(2)})
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {product.availableSizes.map((size) => {
                      const sData = BUTTON_PIN_PRICING[size] || BUTTON_PIN_PRICING['25mm'];
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-400 border-amber-500 text-stone-950 shadow-xs ring-2 ring-amber-400/50'
                              : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                          }`}
                        >
                          <div className="font-bold text-xs">{size}</div>
                          <div className="text-[10px] text-stone-600 mt-0.5">
                            ₱{sData.tiers[0].unitPrice.toFixed(0)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Surface Finish (Glossy or Matte) */}
              {isButtonPin && (
                <div className="space-y-1.5 pt-2 border-t border-amber-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Surface Finish:
                    </span>
                    <span className="text-xs font-semibold text-stone-500">
                      High-clarity protective finish
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['Glossy', 'Matte'].map((surface) => (
                      <button
                        key={surface}
                        type="button"
                        onClick={() => setSelectedSurface(surface)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          selectedSurface === surface
                            ? 'bg-amber-300 border-amber-500 text-stone-950 shadow-xs ring-2 ring-amber-400/40'
                            : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                        }`}
                      >
                        <span>{surface} Finish</span>
                        {selectedSurface === surface && (
                          <Check className="w-3.5 h-3.5 text-stone-950 stroke-[3]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Bulk Quantity Picker / Stepper */}
              <div className="space-y-1.5 pt-2 border-t border-amber-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Quantity / Bulk Tiers:
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    {quantity >= 500
                      ? '500+ PCS Tier (Best Rate)'
                      : quantity >= 300
                      ? '300 PCS Tier'
                      : quantity >= 200
                      ? '200 PCS Tier'
                      : quantity >= 50
                      ? '50-100 PCS Tier'
                      : 'Sample Order'}
                  </span>
                </div>

                {isButtonPin && (
                  <div className="grid grid-cols-4 gap-1.5 mb-2">
                    {[
                      { qty: 50, label: '50-100' },
                      { qty: 200, label: '200' },
                      { qty: 300, label: '300' },
                      { qty: 500, label: '500+' },
                    ].map((tier) => (
                      <button
                        key={tier.qty}
                        type="button"
                        onClick={() => setQuantity(tier.qty)}
                        className={`py-1.5 px-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                          quantity === tier.qty
                            ? 'bg-amber-400 border-amber-500 text-stone-950 font-bold'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-white'
                        }`}
                      >
                        {tier.label} PCS
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - (quantity > 50 ? 50 : 10)))}
                      aria-label="Decrease quantity"
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-stone-700 hover:bg-white active:scale-95 cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center text-sm font-bold tabular-nums text-stone-900 bg-transparent outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + (quantity >= 50 ? 50 : 10))}
                      aria-label="Increase quantity"
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-stone-700 hover:bg-white active:scale-95 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-stone-500">
                    Piece count (adjusts tier pricing automatically)
                  </span>
                </div>
              </div>

              {/* 4. Add-on: Individual Packaging (Plastic & Label) */}
              {isButtonPin && (
                <div className="pt-2 border-t border-amber-100">
                  <label className="flex items-start gap-3 p-3 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition-colors cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includePackaging}
                      onChange={(e) => setIncludePackaging(e.target.checked)}
                      className="mt-0.5 rounded text-amber-500 focus:ring-amber-400"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between font-bold text-stone-900">
                        <span className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-amber-700" />
                          <span>Add Individual Packaging (Plastic &amp; Label)</span>
                        </span>
                        <span className="text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded tabular-nums">
                          +₱{currentSizeData.packagingAddon.toFixed(2)} / pc
                        </span>
                      </div>
                      <p className="text-stone-500 text-[11px] mt-0.5">
                        Each pin sealed with an individual plastic sleeve and custom Munthings backing card.
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* 5. Complete Button Pins Pricing Matrix Table Modal / Expandable */}
              {isButtonPin && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowFullTable(!showFullTable)}
                    className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1.5 underline decoration-amber-400 underline-offset-4 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-amber-600" />
                    <span>{showFullTable ? 'Hide' : 'View'} Complete Button Pins Price Sheet</span>
                  </button>

                  {showFullTable && (
                    <div className="mt-3 overflow-x-auto rounded-xl border border-amber-300 shadow-xs bg-white p-2">
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead>
                          <tr className="bg-amber-100 text-stone-900 font-bold border-b border-amber-200">
                            <th className="p-2">Size</th>
                            <th className="p-2">50-100 PCS</th>
                            <th className="p-2">200 PCS</th>
                            <th className="p-2">300 PCS</th>
                            <th className="p-2">500+ PCS</th>
                            <th className="p-2">Packaging</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(BUTTON_PIN_PRICING).map(([sz, sData]) => {
                            const isRowActive = selectedSize === sz;
                            return (
                              <tr
                                key={sz}
                                className={`border-b border-stone-100 transition-colors ${
                                  isRowActive ? 'bg-amber-200/50 font-bold' : 'hover:bg-amber-50/40'
                                }`}
                              >
                                <td className="p-2 font-bold text-stone-900">{sz}</td>
                                <td className="p-2 tabular-nums">₱{sData.tiers[0].unitPrice.toFixed(2)}</td>
                                <td className="p-2 tabular-nums">₱{sData.tiers[1].unitPrice.toFixed(2)}</td>
                                <td className="p-2 tabular-nums">₱{sData.tiers[2].unitPrice.toFixed(2)}</td>
                                <td className="p-2 tabular-nums font-bold text-emerald-700">
                                  ₱{sData.tiers[3].unitPrice.toFixed(2)}
                                </td>
                                <td className="p-2 tabular-nums text-stone-600">
                                  +₱{sData.packagingAddon.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Add to Cart Action */}
            <div className="pt-4 border-t border-stone-200">
              <button
                onClick={handleAdd}
                disabled={addedNotice}
                className={`w-full py-3.5 px-6 rounded-xl font-display font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                  addedNotice
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-400 hover:bg-amber-300 active:scale-95 text-stone-950'
                }`}
              >
                {addedNotice ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>
                      Add to Cart · ₱{pricing.total.toFixed(2)} ({quantity} {quantity === 1 ? 'pc' : 'pcs'})
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
