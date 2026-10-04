// HomePage Component:
// The landing page of the Munthings store.
// Features a warm welcome hero, bestsellers preview, quality pillars, and happy customer reviews.

import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Heart, Sun, Award, Plus, MessageSquarePlus, X } from 'lucide-react';
import { ProductCard } from './ProductCard.jsx';
import { REVIEWS, heroPinsStickersImg } from '../data/products.js';

// Calculate dynamic relative time elapsed since the review was put/posted
export const getTimeAgo = (dateInput) => {
  if (!dateInput) return 'Recently';

  const timestamp = Date.parse(dateInput);
  if (isNaN(timestamp)) {
    return dateInput;
  }

  const now = Date.now();
  const diffInSeconds = Math.max(0, Math.floor((now - timestamp) / 1000));

  if (diffInSeconds < 45) return 'Just now';
  if (diffInSeconds < 90) return '1 minute ago';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours === 1) return '1 hour ago';
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks === 1) return '1 week ago';
  if (diffInWeeks < 4) {
    return `${diffInWeeks} weeks ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths === 1) return '1 month ago';
  if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
};

export const HomePage = ({
  products,
  onNavigate,
  onAddToCart,
  onQuickView,
  wishlist,
  onToggleWishlist,
}) => {
  // Grab the first 3 products to highlight on the home page
  const featuredProducts = products.slice(0, 3);

  // Reviews state with localStorage persistence
  const [reviewsList, setReviewsList] = useState(() => {
    try {
      const saved = localStorage.getItem('munthings_user_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading reviews:', e);
    }
    return REVIEWS;
  });

  // Live timer tick to ensure relative time dynamically updates as minutes pass
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  // State for adding a review
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [commentText, setCommentText] = useState('');

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: authorName.trim() || 'Verified Customer',
      rating,
      comment: commentText.trim(),
      itemPurchased: 'Adobo Pins',
      createdAt: new Date().toISOString(),
      verified: true,
    };

    const updated = [newRev, ...reviewsList];
    setReviewsList(updated);
    try {
      localStorage.setItem('munthings_user_reviews', JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving review:', err);
    }

    setAuthorName('');
    setCommentText('');
    setRating(5);
    setIsReviewModalOpen(false);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-6 sm:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Quiet artist tag */}
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/70 px-3.5 py-1.5 rounded-full shadow-2xs">
                <Sun className="w-3.5 h-3.5 text-amber-700" />
                <span>Original Art by Barth&apos;s Studio</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-stone-900 tracking-tight leading-[1.08] text-balance">
                Vibrant stickers &amp; glossy button pins.
              </h1>

              {/* Friendly Introduction */}
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
                Munthings creates hand-pressed round button pins with shiny protective mylar and durable 100% waterproof vinyl stickers — illustrated with love by Barth&apos;s Studio.
              </p>

              {/* Call-to-Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('shop')}
                  className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-display font-bold text-sm tracking-wide shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>Shop Stickers &amp; Button Pins</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('contact')}
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-amber-50/80 text-stone-800 font-semibold text-sm border border-amber-300 shadow-2xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>Contact Barth&apos;s Studio</span>
                </button>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl aspect-16/11 bg-[#F5EED9]">
                <img
                  src={heroPinsStickersImg}
                  alt="Munthings button pins and waterproof vinyl stickers arranged on warm yellow desk"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Floating Studio Quality Badge */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-amber-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-stone-950 font-bold shrink-0 shadow-xs">
                    <Sparkles className="w-5 h-5 text-stone-950" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">
                      Hand-Pressed with Care
                    </div>
                    <div className="text-[11px] text-stone-500">
                      High-gloss mylar face &amp; rust-resistant tinplate steel.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Bestsellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
              Barth&apos;s Studio Bestsellers
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-stone-900">
              Popular Stickers &amp; Button Pins
            </h2>
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span>View All {products.length} Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      </section>

      {/* 3. The Munthings Quality Section */}
      <section className="bg-amber-100/60 border-y border-amber-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">
              The Munthings Quality
            </span>
            <h2 className="font-display font-bold text-3xl text-stone-900 mt-1">
              Durable, Glossy &amp; Made to Last
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Whether you pin them to your favorite denim jacket, lanyard, or backpack, or stick them on your water bottle or laptop, Munthings flair is made to stay vibrant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Button Pins */}
            <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-xs flex flex-col justify-between text-left">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-300 text-stone-900 flex items-center justify-center font-bold mb-4">
                  <ShieldCheck className="w-6 h-6 text-stone-900" />
                </div>
                <h3 className="font-display font-bold text-lg text-stone-900 mb-2">
                  Hand-Pressed Button Pins
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Pressed individually with commercial-grade steel components. High-clarity mylar shields the artwork from scratches and moisture, with a snug safety clasp.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-100 text-[11px] font-semibold text-teal-800">
                1.25&quot; and 1.5&quot; Round Badges
              </div>
            </div>

            {/* Feature 2: Vinyl Stickers */}
            <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-xs flex flex-col justify-between text-left">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-300 text-stone-900 flex items-center justify-center font-bold mb-4">
                  <Award className="w-6 h-6 text-stone-900" />
                </div>
                <h3 className="font-display font-bold text-lg text-stone-900 mb-2">
                  Heavy 6mil Weatherproof Vinyl
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Thick outdoor vinyl with a protective UV barrier. They are 100% waterproof, sunlight-resistant, dishwasher safe, and peel off cleanly without residue.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-100 text-[11px] font-semibold text-teal-800">
                Die-Cut &amp; Kiss-Cut Sheets
              </div>
            </div>

            {/* Feature 3: Original Studio Art */}
            <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-xs flex flex-col justify-between text-left">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-300 text-stone-900 flex items-center justify-center font-bold mb-4">
                  <Heart className="w-6 h-6 text-stone-900" />
                </div>
                <h3 className="font-display font-bold text-lg text-stone-900 mb-2">
                  Illustrated by Barth’s Studio
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Every celestial moon, smiling boba cup, and sunny petal starts as an original hand-drawn sketch in the studio. Small batches, big heart.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-100 text-[11px] font-semibold text-teal-800">
                Independent Artist Made
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Special Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 rounded-3xl p-8 sm:p-12 text-stone-950 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xs">
          <div className="space-y-3 max-w-xl text-left">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-stone-950 text-amber-300 rounded-md">
              Special Grab Bag
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-950">
              Get the Button Pin &amp; Sticker Grab Bag
            </h2>
            <p className="text-sm sm:text-base text-stone-800">
              Includes 3 bestselling button pins, 5 waterproof vinyl stickers, and a mini collector card packed in a sunshine glassine pouch for only ₱299.
            </p>
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="px-7 py-4 bg-stone-950 hover:bg-stone-900 text-amber-300 font-display font-bold text-sm tracking-wide rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center gap-2.5 whitespace-nowrap cursor-pointer shrink-0"
          >
            <span>Explore the Shop</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
              Happy Collectors
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-stone-900">
              Loved by Customers
            </h2>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200/80 text-amber-950 font-bold text-xs rounded-xl border border-amber-300 transition-colors shadow-2xs cursor-pointer active:scale-95"
          >
            <MessageSquarePlus className="w-4 h-4 text-amber-800" />
            <span>Write a Review</span>
          </button>
        </div>

        <div className={`grid gap-6 ${reviewsList.length === 1 ? 'max-w-xl mx-auto' : 'grid-cols-1 md:grid-cols-3'}`}>
          {reviewsList.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs flex flex-col justify-between text-left"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded">
                    Purchased: {review.itemPurchased}
                  </span>
                  <div className="flex text-amber-400 text-xs">
                    {'★'.repeat(review.rating)}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="font-bold text-stone-900">{review.author}</span>
                <span
                  title={review.createdAt ? new Date(review.createdAt).toLocaleString() : review.date}
                  className="text-stone-500 font-medium tabular-nums"
                >
                  {getTimeAgo(review.createdAt || review.date)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Write a Review Modal */}
        {isReviewModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsReviewModalOpen(false)}
          >
            <div
              className="relative bg-white rounded-3xl max-w-md w-full border border-amber-200 shadow-2xl p-6 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <MessageSquarePlus className="w-5 h-5 text-amber-600" />
                  <h3 className="font-display font-bold text-lg text-stone-900">
                    Write a Review
                  </h3>
                </div>
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddReview} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frank G."
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-xl cursor-pointer transition-transform hover:scale-110 ${
                          star <= rating ? 'text-amber-400' : 'text-stone-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="text-xs text-stone-500 ml-2 font-bold">{rating} / 5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Review
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="What did you love about your button pins?"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
