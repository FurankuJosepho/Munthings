// CheckoutModal Component:
// Allows customers to send their order directly to Barth's Studio via email.
// Generates the exact email structure: Subject, Detials order, Name, Adress, contact.

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Send, Mail, Copy, Check, ShoppingBag, Edit3 } from 'lucide-react';

export const CheckoutModal = ({
  isOpen,
  onClose,
  items,
  onOrderComplete,
}) => {
  // Step state: 'form' for entering order details, 'success' for sent confirmation
  const [step, setStep] = useState('form');
  const [copied, setCopied] = useState(false);
  const [savedOrderSnapshot, setSavedOrderSnapshot] = useState(null);

  const studioEmail = 'fhpc.frank@gmail.com';

  // Format the item details string
  const formatOrderDetails = (itemsList = items) => {
    if (!itemsList || itemsList.length === 0) return '• No items in cart';
    return itemsList
      .map(
        (it) =>
          `• Product: ${it.product.name}
  Size: ${it.selectedSize || '25mm'}
  Surface: ${it.surface || 'Glossy'}
  Packaging: ${it.includePackaging ? 'Individual Packaging (Plastic & Label)' : 'Standard'}
  Quantity: ${it.quantity} pc${it.quantity > 1 ? 's' : ''}
  Unit Price: ₱${(it.unitPrice ?? it.product.price).toFixed(2)}
  Item Total: ₱${((it.unitPrice ?? it.product.price) * it.quantity).toFixed(2)}`
      )
      .join('\n\n');
  };

  // Form values matching user requested email structure
  const [formData, setFormData] = useState({
    subject: 'Order: Adobo Pins',
    detailsOrder: '',
    name: 'Frank Joseph G.',
    address: 'Manila, Philippines',
    contact: 'frank21garcia29@gmail.com',
  });

  // Calculate order subtotal and shipping
  const subtotal = items.reduce(
    (acc, it) => acc + (it.unitPrice ?? it.product.price) * it.quantity,
    0
  );
  const shipping = subtotal >= 500 ? 0 : 60.0;
  const total = subtotal + shipping;

  // Initialize and keep detailsOrder synced with cart items while on form step
  useEffect(() => {
    if (items && items.length > 0 && step === 'form') {
      setFormData((prev) => ({
        ...prev,
        detailsOrder: formatOrderDetails(items),
      }));
    }
  }, [items, step]);

  // If closed, return null
  if (!isOpen) return null;

  // Build the complete email text matching the user's requested structure:
  // Subject
  // Detials order
  // Name
  // Adress
  // contact
  const generateEmailBody = (detailsText = formData.detailsOrder) => {
    return `Detials order:
${detailsText || formatOrderDetails(items)}

Subtotal: ₱${subtotal.toFixed(2)}
Shipping: ${shipping === 0 ? 'FREE' : `₱${shipping.toFixed(2)}`}
Total Amount: ₱${total.toFixed(2)}

Name: ${formData.name}
Adress: ${formData.address}
contact: ${formData.contact}`;
  };

  // Full email preview text (including Subject)
  const fullEmailText = `Subject: ${formData.subject}

${generateEmailBody()}`;

  // Handle Send Order submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const orderDetailsContent = formData.detailsOrder || formatOrderDetails(items);
    const emailBody = `Detials order:
${orderDetailsContent}

Subtotal: ₱${subtotal.toFixed(2)}
Shipping: ${shipping === 0 ? 'FREE' : `₱${shipping.toFixed(2)}`}
Total Amount: ₱${total.toFixed(2)}

Name: ${formData.name}
Adress: ${formData.address}
contact: ${formData.contact}`;

    const completeEmail = `Subject: ${formData.subject}

${emailBody}`;

    // Save persistent snapshot so confirmation screen and copy button retain the exact details
    setSavedOrderSnapshot({
      subject: formData.subject,
      body: emailBody,
      fullText: completeEmail,
    });

    const subjectEncoded = encodeURIComponent(formData.subject || `Order from ${formData.name}`);
    const bodyEncoded = encodeURIComponent(emailBody);

    // Launch email client to send order to the studio
    window.location.href = `mailto:${studioEmail}?subject=${subjectEncoded}&body=${bodyEncoded}`;

    setStep('success');
    onOrderComplete();
  };

  // Copy email text to clipboard
  const handleCopy = () => {
    const textToCopy = savedOrderSnapshot?.fullText || fullEmailText;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Close modal and reset to form step
  const handleClose = () => {
    setStep('form');
    setSavedOrderSnapshot(null);
    onClose();
  };

  const displayText = savedOrderSnapshot?.fullText || fullEmailText;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="relative bg-white rounded-3xl max-w-xl w-full border border-amber-200 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 border-b border-amber-100 flex items-center justify-between bg-[#FFFDF7]">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-amber-600" />
            <h2 className="font-display font-bold text-lg text-stone-900">
              {step === 'form' ? 'Send Order' : 'Order Sent via Email!'}
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
          /* Step 1: Send Order Form matching requested email structure */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
            {/* Quick Order Overview */}
            <div className="bg-[#FAF5EA] p-3.5 rounded-xl border border-amber-200/60 text-xs text-stone-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-700" />
                <span className="font-bold text-stone-900">{items.length} items</span> in your cart
              </div>
              <div className="font-display font-bold text-sm text-stone-950 tabular-nums">
                Total: ₱{total.toFixed(2)}
              </div>
            </div>

            {/* Form Fields: Subject, Detials order, Name, Adress, contact */}
            <div className="space-y-3.5">
              {/* 1. Subject */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Order: Adobo Pins"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 bg-stone-50/50 font-medium"
                />
              </div>

              {/* 2. Detials order */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                    Detials order
                  </label>
                  <span className="text-[10px] text-amber-800 font-semibold bg-amber-100/90 px-2 py-0.5 rounded border border-amber-200">
                    Exact Details Sent in Email
                  </span>
                </div>
                <textarea
                  required
                  rows={6}
                  value={formData.detailsOrder}
                  onChange={(e) => setFormData({ ...formData, detailsOrder: e.target.value })}
                  placeholder="Order items and specifications"
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 font-mono leading-relaxed outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 resize-y"
                />
                <div className="mt-1 flex justify-between text-[11px] text-stone-500">
                  <span>Subtotal: ₱{subtotal.toFixed(2)} · Shipping: {shipping === 0 ? 'FREE' : `₱${shipping.toFixed(2)}`}</span>
                  <span className="font-bold text-stone-900">Total: ₱{total.toFixed(2)}</span>
                </div>
              </div>

              {/* 3. Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Full Name"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50"
                />
              </div>

              {/* 4. Adress */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Adress
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Shipping address (Street, Barangay, City, Postal Code)"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 resize-none"
                />
              </div>

              {/* 5. contact */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  contact
                </label>
                <input
                  type="text"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="Email address or Mobile number (e.g. 0917-xxx-xxxx / email@example.com)"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50"
                />
              </div>
            </div>

            {/* Send Order Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-display font-bold text-sm tracking-wide shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Send Order (₱{total.toFixed(2)})</span>
              </button>
              <p className="text-[11px] text-stone-500 text-center mt-2">
                This will open your email app addressed to <strong>{studioEmail}</strong> with your order details pre-filled.
              </p>
            </div>
          </form>
        ) : (
          /* Step 2: Order Sent Confirmation Screen with formatted email preview */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-display font-bold text-2xl text-stone-900">
              Order Ready to Send!
            </h3>

            <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
              Your email client was opened addressed to <strong>{studioEmail}</strong> with the exact details below:
            </p>

            {/* Email Structure Preview Card - Displays exact captured order details */}
            <div className="bg-[#FAF5EA] p-4 rounded-2xl border border-amber-200/80 text-left font-mono text-[11px] text-stone-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto select-all shadow-inner">
              {displayText}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                onClick={handleCopy}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-600" />
                    <span>Copy Order Email</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  const subjectEncoded = encodeURIComponent(savedOrderSnapshot?.subject || formData.subject);
                  const bodyEncoded = encodeURIComponent(savedOrderSnapshot?.body || generateEmailBody());
                  window.location.href = `mailto:${studioEmail}?subject=${subjectEncoded}&body=${bodyEncoded}`;
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-100 hover:bg-amber-200/80 text-amber-950 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-amber-900" />
                <span>Re-open Email</span>
              </button>

              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-display font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


