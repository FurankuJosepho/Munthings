// ContactPage Component:
// Allows customers and boutique owners to message Barth's Studio.
// Includes a contact form and studio direct contact details.

import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Mail, Instagram, Clock } from 'lucide-react';
import { MunthingsLogo } from './MunthingsLogo.jsx';

export const ContactPage = () => {
  const targetEmail = 'munthingsbybarthsstudio@gmail.com';

  // Form input state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Submission state to display thank you card
  const [submitted, setSubmitted] = useState(false);

  // Handle contact form submission and route to fhpc.frank@gmail.com
  const handleSubmit = (e) => {
    e.preventDefault();

    const emailSubject = encodeURIComponent(
      formData.name && formData.subject
        ? `${formData.name} - ${formData.subject}`
        : `${formData.name || formData.subject || 'Message'}`
    );
    const body = encodeURIComponent(
      `${formData.message}`
    );

    window.location.href = `mailto:${targetEmail}?subject=${emailSubject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* 1. Header Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/70 px-3 py-1 rounded-full mb-2">
          <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
          <span>Get in Touch</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-stone-900">
          Contact Barth&apos;s Studio
        </h1>
        <p className="text-sm text-stone-600 mt-2">
          Have a question about custom button pins, wholesale stickers for your shop, or an existing order? Send a note below.
        </p>
      </div>

      {/* 2. Main Grid: Contact Form & Studio Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs">
          {submitted ? (
            /* Success confirmation screen */
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-2xl text-stone-900">
                Message Sent to munthingsbybarthsstudio@gmail.com!
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Thank you for reaching out to Munthings! Your message has been sent to{' '}
                <span className="font-semibold text-stone-900">{targetEmail}</span>. Barth will review your message and reply to{' '}
                <span className="font-semibold text-stone-900">{formData.email}</span> within 24–48 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                  });
                }}
                className="mt-4 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            /* Input Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <h2 className="font-display font-bold text-xl text-stone-900 mb-2">
                Send a Message
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Chen"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none bg-stone-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Inquiry about button pins, stickers, or custom designs..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none bg-stone-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what you have in mind or any questions you have..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none bg-stone-50/50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-display font-bold text-sm tracking-wide shadow-sm hover:shadow transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Studio Info Card & Direct Contact */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="bg-[#FAF5EA] rounded-3xl p-6 sm:p-7 border border-amber-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <MunthingsLogo size={52} showSubtitle={false} />
              <div>
                <h3 className="font-display font-bold text-lg text-stone-900 leading-tight">
                  Munthings by Barth&apos;s Studio
                </h3>
                <p className="text-xs text-teal-800 font-semibold mt-0.5">
                  Hand-Pressed Button Pins &amp; Waterproof Stickers
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Munthings is a small independent studio founded by Barth, handcrafting cheerful celestial moon artwork, botanical designs, and nostalgic illustrations onto round button pins and waterproof stickers.
            </p>

            <div className="space-y-3 pt-3 border-t border-amber-200/60 text-xs text-stone-700">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Studio Email</span>
                  <a href={`mailto:${targetEmail}`} className="font-semibold text-stone-900 hover:underline">
                    {targetEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Instagram className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Instagram</span>
                  <span className="font-semibold text-stone-900">
                    @munthings.studio
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Studio Hours</span>
                  <span className="font-medium text-stone-800">
                    Monday – Friday, 9:00 AM – 5:00 PM PST
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
