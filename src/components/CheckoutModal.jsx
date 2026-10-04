// CheckoutModal Component:
// A simulated checkout dialog where customers enter their shipping details,
// review their order total, and receive an instant order confirmation receipt.

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, Package, CreditCard } from 'lucide-react';

export const CheckoutModal = ({
  isOpen,
  onClose,
  items,
  onOrderComplete,
}) => {
  // Step state: 'form' for address entry, 'success' for order confirmation
  const [step, setStep] = useState('form');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Shipping form values
  const [formData, setFormData] = useState({
    name: 'Frank Garcia',
    email: 'frank21garcia29@gmail.com',
    address: '742 Evergreen Terrace',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
  });

  // If closed, return null
  if (!isOpen) return null;

  // Calculate order subtotal and shipping
  const subtotal = items.reduce(
    (acc, it) => acc + (it.unitPrice ?? it.product.price) * it.quantity,
    0
  );
  const shipping = subtotal >= 500 ? 0 : 60.0;
  const total = subtotal + shipping;

  // Handle order submission simulation
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Generate a friendly order number like MUN-58291
      const randomOrder = `MUN-${Math.floor(10000 + Math.random() * 90000)}`;
      setOrderId(randomOrder);
      setStep('success');
      onOrderComplete();
    }, 1200);
  };

  // Close modal and reset to form step
  const handleClose = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="relative bg-white rounded-3xl max-w-xl w-full border border-amber-200 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 border-b border-amber-100 flex items-center justify-between bg-[#FFFDF7]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <h2 className="font-display font-bold text-lg text-stone-900">
              {step === 'form' ? 'Checkout' : 'Order Confirmed!'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'form' ? (
          /* Step 1: Shipping Address & Order Summary Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
            {/* Quick Order Overview */}
            <div className="bg-[#FAF5EA] p-3.5 rounded-xl border border-amber-200/60 text-xs text-stone-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900">{items.length} items</span> in order
              </div>
              <div className="font-display font-bold text-sm text-stone-950 tabular-nums">
                Total: ₱{total.toFixed(2)}
              </div>
            </div>

            {/* Shipping Address Inputs */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-800">
                1. Shipping Address
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Email for Tracking
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Notice */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-800">
                2. Payment Method
              </h3>
              <div className="p-3 rounded-xl border border-amber-300 bg-amber-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-semibold text-stone-800">
                    Instant Secure Checkout (Demo Mode)
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
            </div>

            {/* Submit Order Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-display font-bold text-sm tracking-wide shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Packing your order...</span>
              ) : (
                <span>Pay &amp; Place Order (₱{total.toFixed(2)})</span>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: Order Confirmation Receipt */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="font-display font-bold text-2xl text-stone-900">
              Thank You for Your Order!
            </h3>

            <div className="inline-block bg-amber-100 text-amber-950 font-mono font-bold px-4 py-1.5 rounded-lg text-sm">
              Order {orderId}
            </div>

            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              We&apos;ve sent your order receipt and tracking updates to{' '}
              <span className="font-semibold text-stone-900">{formData.email}</span>. Barth&apos;s Studio is packaging your button pins and stickers with care!
            </p>

            <div className="bg-[#FAF5EA] p-4 rounded-2xl border border-amber-200/80 text-xs text-stone-700 max-w-sm mx-auto text-left space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-stone-900">
                <Truck className="w-4 h-4 text-amber-700" />
                <span>Estimated Delivery: 3–5 Business Days</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500">
                <Package className="w-4 h-4 text-amber-700" />
                <span>Packaged in 100% recyclable protective mailer</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="mt-4 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-display font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Continue Exploring Munthings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
