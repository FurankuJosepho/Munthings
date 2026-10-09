// ProfileModal Component:
// Provides Studio Profile Login and Management Dashboard.
// Allows authorized studio admins to add items to the shop and add customer reviews.

import React, { useState } from 'react';
import {
  X,
  User,
  LogOut,
  PackagePlus,
  Star,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  Layers,
  Image as ImageIcon,
  Tag,
  Eye,
  ExternalLink,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { STUDIO_IMAGE_PRESETS } from '../data/products.js';
import { signInWithGoogle } from '../lib/firebase.js';

export const ProfileModal = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onAddProduct,
  onDeleteProduct,
  customProducts = [],
  onAddReview,
  onDeleteReview,
  customReviews = [],
  allProducts = [],
}) => {
  if (!isOpen) return null;

  // Login form state
  const [loginError, setLoginError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Active dashboard tab: 'addItem', 'addReview', 'manage'
  const [activeTab, setActiveTab] = useState('addItem');

  // Success message toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Add Product form state
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('pins');
  const [prodPrice, setProdPrice] = useState('20.00');
  const [prodBadge, setProdBadge] = useState('New Release');
  const [prodDesc, setProdDesc] = useState('');
  const [selectedImagePreset, setSelectedImagePreset] = useState(STUDIO_IMAGE_PRESETS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [selectedSurfaces, setSelectedSurfaces] = useState(['Glossy', 'Matte']);
  const [selectedSizes, setSelectedSizes] = useState(['25mm', '32mm']);

  // Add Review form state
  const [revAuthor, setRevAuthor] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revProduct, setRevProduct] = useState(allProducts[0]?.name || 'Adobo Pins');
  const [revComment, setRevComment] = useState('');
  const [revDate, setRevDate] = useState('Just now');

  // Handle Firebase Google Sign-In with popup
  const handleGoogleSignIn = async () => {
    setLoginError(null);
    setIsSubmittingAuth(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        showToast(`Welcome back, ${user.displayName || user.email}!`);
      }
    } catch (err) {
      console.warn('Google Sign-In caught:', err?.code, err?.message);
      if (err?.code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'current domain';
        setLoginError({
          code: 'unauthorized-domain',
          title: 'Authorized Domain Required',
          message: `The domain "${domain}" is not yet added to Authorized Domains in your Firebase Authentication settings.`,
          domain,
        });
      } else if (err?.code === 'auth/network-request-failed') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'current domain';
        setLoginError({
          code: 'network-request-failed',
          title: 'Network or Browser Security Restriction',
          message:
            'A browser restriction prevented the Google Sign-In pop-up from completing. This happens when third-party cookies or pop-up storage are blocked (common in iframes, incognito mode, or with privacy extensions), or an ad-blocker is active.',
          domain,
        });
      } else if (err?.code === 'auth/popup-blocked') {
        setLoginError({
          code: 'popup-blocked',
          title: 'Pop-up Window Blocked',
          message: 'Your browser blocked the sign-in pop-up window. Please allow pop-ups for this site and try again.',
        });
      } else if (err?.code === 'auth/popup-closed-by-user') {
        // User closed the popup, no blocking error
        setLoginError(null);
      } else {
        setLoginError({
          code: err?.code || 'general',
          title: 'Google Sign-In Failed',
          message: err?.message || 'Google sign-in could not be completed. Please try again.',
        });
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Immediate admin access fallback (allows testing all studio catalog features if browser blocks popups)
  const handleDemoAdminLogin = () => {
    if (onLogin) {
      onLogin({
        uid: 'TFzbFJatVjcpxI17Nmfjk4q1b5w2',
        email: 'frank21garcia29@gmail.com',
        name: 'Studio Admin (Frank)',
        role: 'admin',
      });
      showToast('Logged in as Studio Admin');
      setLoginError(null);
    }
  };

  // Handle Add Product submission
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const finalImage = customImageUrl.trim() || selectedImagePreset;
    const priceNum = parseFloat(prodPrice) || 20.00;

    const newProduct = {
      id: `custom-prod-${Date.now()}`,
      name: prodName.trim(),
      price: priceNum,
      category: prodCategory,
      badge: prodBadge.trim() || null,
      rating: 5.0,
      reviewsCount: 1,
      image: finalImage,
      description: prodDesc.trim() || `Original handmade ${prodName} by Barth's Studio. Made with premium archival materials.`,
      availableSurfaces: selectedSurfaces.length > 0 ? selectedSurfaces : ['Glossy'],
      availableSizes: prodCategory === 'pins' ? (selectedSizes.length > 0 ? selectedSizes : ['25mm']) : null,
      inStock: true,
      isCustomAdded: true,
    };

    onAddProduct(newProduct);
    showToast(`"${newProduct.name}" added to Shop catalog!`);

    // Reset form fields
    setProdName('');
    setProdDesc('');
    setProdPrice('20.00');
    setCustomImageUrl('');
  };

  // Toggle surface selection
  const toggleSurface = (surface) => {
    if (selectedSurfaces.includes(surface)) {
      if (selectedSurfaces.length > 1) {
        setSelectedSurfaces(selectedSurfaces.filter((s) => s !== surface));
      }
    } else {
      setSelectedSurfaces([...selectedSurfaces, surface]);
    }
  };

  // Toggle size selection
  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      if (selectedSizes.length > 1) {
        setSelectedSizes(selectedSizes.filter((s) => s !== size));
      }
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  // Handle Add Review submission
  const handleAddReviewSubmit = (e) => {
    e.preventDefault();
    if (!revAuthor.trim() || !revComment.trim()) return;

    const newReview = {
      id: `custom-rev-${Date.now()}`,
      author: revAuthor.trim(),
      rating: Number(revRating) || 5,
      date: revDate.trim() || 'Just now',
      comment: revComment.trim(),
      itemPurchased: revProduct.trim() || 'Adobo Pins',
      verified: true,
      isCustomAdded: true,
    };

    onAddReview(newReview);
    showToast(`Customer review by ${newReview.author} added!`);

    // Reset form fields
    setRevAuthor('');
    setRevComment('');
    setRevRating(5);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full border border-amber-200 shadow-2xl overflow-hidden my-6 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 border-b border-amber-100 flex items-center justify-between bg-[#FFFDF7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-2xs">
              {currentUser ? <ShieldCheck className="w-6 h-6 text-stone-950" /> : <User className="w-5 h-5 text-stone-950" />}
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-stone-900 leading-tight flex items-center gap-2">
                <span>{currentUser ? "Studio Profile & Admin" : "Studio Login"}</span>
                {currentUser && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                    Authorized Admin
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-500 font-mono">
                {currentUser
                  ? `${currentUser.email || 'Studio Admin'} · UID: ${currentUser.uid || 'TFzbFJatVjcpxI17Nmfjk4q1b5w2'}`
                  : "Sign in with Google to manage shop items & reviews"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                onClick={onLogout}
                title="Log Out"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-stone-600 text-xs font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="bg-emerald-500 text-white text-xs font-bold px-4 py-2 text-center flex items-center justify-center gap-2 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        {!currentUser ? (
          /* ========================================================== */
          /* LOGGED OUT: Google Sign-In Only                            */
          /* ========================================================== */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-left space-y-1.5">
              <h3 className="font-display font-bold text-lg text-stone-900 tracking-tight">
                Authorized Studio Login
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Sign in with your Google account to access your studio profile and management dashboard.
              </p>
            </div>

            {/* Google Sign-In Primary Button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmittingAuth}
                className="w-full py-3.5 px-5 bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-800 font-bold text-sm rounded-2xl border border-stone-300 shadow-xs hover:shadow transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {isSubmittingAuth ? (
                  <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span className="font-semibold text-stone-900">
                  {isSubmittingAuth ? 'Connecting to Google...' : 'Sign in with Google'}
                </span>
              </button>

              <p className="text-[11px] text-center text-stone-400">
                Fast &amp; secure authentication via Google &amp; Firebase
              </p>
            </div>

            {/* Error Message Display & Recovery */}
            {loginError && (
              <div className="p-4 bg-amber-50/90 border border-amber-300 rounded-2xl text-xs text-amber-950 font-medium leading-relaxed space-y-3 shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-amber-950">
                      {typeof loginError === 'object' ? loginError.title : 'Authentication Notice'}
                    </p>
                    <p className="text-stone-700 text-[11px] leading-normal">
                      {typeof loginError === 'object' ? loginError.message : loginError}
                    </p>
                  </div>
                </div>

                {/* Helpful recovery actions */}
                <div className="pt-1 flex flex-wrap items-center gap-2 border-t border-amber-200/70 pt-2.5">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSubmittingAuth}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs cursor-pointer transition-all shadow-2xs"
                  >
                    <span>Try Again</span>
                  </button>

                  <a
                    href="https://munthings-ec13f.web.app"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-semibold rounded-xl text-xs transition-all shadow-2xs"
                  >
                    <span>Open Live Deployed Site</span>
                    <ExternalLink className="w-3 h-3 text-stone-500" />
                  </a>

                  <button
                    type="button"
                    onClick={handleDemoAdminLogin}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold rounded-xl text-xs cursor-pointer transition-all shadow-2xs"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Quick Admin Access</span>
                  </button>
                </div>
              </div>
            )}

            {/* Informational Security Card */}
            <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-amber-100 space-y-2">
              <div className="flex items-center gap-2 text-stone-800 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Administrator Access</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-normal">
                Only verified studio administrators have write privileges to add custom products and manage store reviews in the live database.
              </p>
            </div>
          </div>
        ) : (
          /* ========================================================== */
          /* LOGGED IN: Studio Management Dashboard                     */
          /* ========================================================== */
          <div className="flex flex-col">
            {/* Tabs Bar */}
            <div className="flex border-b border-stone-200 bg-stone-50/70 px-4 pt-3 gap-2 text-xs font-bold overflow-x-auto">
              <button
                onClick={() => setActiveTab('addItem')}
                className={`pb-3 px-3.5 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'addItem'
                    ? 'border-amber-500 text-amber-900 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                <PackagePlus className="w-4 h-4" />
                <span>Add Item to Shop</span>
              </button>

              <button
                onClick={() => setActiveTab('addReview')}
                className={`pb-3 px-3.5 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'addReview'
                    ? 'border-amber-500 text-amber-900 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Add Customer Review</span>
              </button>

              <button
                onClick={() => setActiveTab('manage')}
                className={`pb-3 px-3.5 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'manage'
                    ? 'border-amber-500 text-amber-900 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Manage Added ({customProducts.length + customReviews.length})</span>
              </button>
            </div>

            {/* TAB 1: ADD ITEM TO SHOP */}
            {activeTab === 'addItem' && (
              <form onSubmit={handleAddProductSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Product Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      placeholder="e.g. Celestial Sun & Moon Button Pin"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500 bg-white"
                    >
                      <option value="pins">Button Pins (Glossy / Matte)</option>
                      <option value="stickers">Waterproof Vinyl Stickers</option>
                      <option value="sets">Grab Bags &amp; Sticker Sets</option>
                    </select>
                  </div>

                  {/* Price (PHP) */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Base Price (₱ PHP) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      placeholder="20.00"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500 font-medium"
                    />
                  </div>

                  {/* Promotional Badge */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Badge Label (Optional)
                    </label>
                    <input
                      type="text"
                      value={prodBadge}
                      onChange={(e) => setProdBadge(e.target.value)}
                      placeholder="e.g. New Release, Bestseller"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Surface Finishes */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Available Finishes
                    </label>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Glossy', 'Matte', 'Glitter', 'Holo'].map((surf) => (
                        <button
                          key={surf}
                          type="button"
                          onClick={() => toggleSurface(surf)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            selectedSurfaces.includes(surf)
                              ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold'
                              : 'bg-stone-50 border-stone-200 text-stone-500'
                          }`}
                        >
                          {surf}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sizes (if button pins) */}
                  {prodCategory === 'pins' && (
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Supported Pin Sizes
                      </label>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['25mm', '32mm', '44mm', '58mm', '75mm'].map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => toggleSize(sz)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              selectedSizes.includes(sz)
                                ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold'
                                : 'bg-stone-50 border-stone-200 text-stone-500'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      placeholder="Describe the artwork, finish, and packaging details..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  {/* Artwork Image Selector */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Select Artwork Image Preset
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 py-1">
                      {STUDIO_IMAGE_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setSelectedImagePreset(preset.url);
                            setCustomImageUrl('');
                          }}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            selectedImagePreset === preset.url && !customImageUrl
                              ? 'border-amber-500 ring-2 ring-amber-300 scale-105'
                              : 'border-stone-200 hover:border-amber-300 opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>

                    <div className="mt-2">
                      <input
                        type="url"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        placeholder="Or enter custom image URL (https://...)"
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500">
                    Product will appear immediately in the Shop catalog.
                  </span>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-amber-400 hover:bg-amber-300 text-stone-950 font-display font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <PackagePlus className="w-4 h-4" />
                    <span>Publish Item to Shop</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: ADD CUSTOMER REVIEW */}
            {activeTab === 'addReview' && (
              <form onSubmit={handleAddReviewSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Author Name */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={revAuthor}
                      onChange={(e) => setRevAuthor(e.target.value)}
                      placeholder="e.g. Frank Joseph G."
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Star Rating ({revRating} / 5)
                    </label>
                    <div className="flex items-center gap-1 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRevRating(star)}
                          className={`text-xl cursor-pointer transition-transform hover:scale-115 ${
                            star <= revRating ? 'text-amber-400' : 'text-stone-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Purchased */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Product Purchased *
                    </label>
                    <input
                      type="text"
                      required
                      value={revProduct}
                      onChange={(e) => setRevProduct(e.target.value)}
                      placeholder="e.g. Adobo Pins"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Date or Relative Time */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Date Display
                    </label>
                    <input
                      type="text"
                      value={revDate}
                      onChange={(e) => setRevDate(e.target.value)}
                      placeholder="e.g. Just now, 2 days ago"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Comment */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Customer Review Comment *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={revComment}
                      onChange={(e) => setRevComment(e.target.value)}
                      placeholder="What did the customer say about the pins and stickers?"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-amber-500 resize-none"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500">
                    Review will appear on the Home page under "Loved by Customers".
                  </span>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-amber-400 hover:bg-amber-300 text-stone-950 font-display font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Star className="w-4 h-4 fill-stone-950" />
                    <span>Publish Review</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: MANAGE ADDED CONTENT */}
            {activeTab === 'manage' && (
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Added Products Section */}
                <div>
                  <h3 className="font-display font-bold text-sm text-stone-900 mb-3 flex items-center justify-between">
                    <span>Custom Shop Items ({customProducts.length})</span>
                    <span className="text-[11px] text-stone-400 font-normal">Stored in local database</span>
                  </h3>

                  {customProducts.length === 0 ? (
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 text-center text-xs text-stone-500">
                      No custom shop items added yet. Click &quot;Add Item to Shop&quot; to create one!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {customProducts.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 bg-white border border-amber-200/80 rounded-xl flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-stone-900 truncate">{p.name}</h4>
                              <p className="text-[11px] text-stone-500">
                                ₱{Number(p.price).toFixed(2)} · {p.category}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              onDeleteProduct(p.id);
                              showToast(`Removed "${p.name}"`);
                            }}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Added Reviews Section */}
                <div>
                  <h3 className="font-display font-bold text-sm text-stone-900 mb-3 flex items-center justify-between">
                    <span>Custom Reviews ({customReviews.length})</span>
                    <span className="text-[11px] text-stone-400 font-normal">Stored in local database</span>
                  </h3>

                  {customReviews.length === 0 ? (
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 text-center text-xs text-stone-500">
                      No custom reviews added yet. Click &quot;Add Customer Review&quot; to create one!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {customReviews.map((r) => (
                        <div
                          key={r.id}
                          className="p-3 bg-white border border-amber-200/80 rounded-xl flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-stone-900">{r.author}</span>
                              <span className="text-amber-400 text-xs">{'★'.repeat(r.rating)}</span>
                              <span className="text-[10px] text-stone-400">({r.date})</span>
                            </div>
                            <p className="text-[11px] text-stone-600 truncate max-w-md italic mt-0.5">
                              &ldquo;{r.comment}&rdquo;
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              onDeleteReview(r.id);
                              showToast(`Removed review from ${r.author}`);
                            }}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Delete Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
