import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  LogOut,
  PackagePlus,
  Star,
  Layers,
  Image as ImageIcon,
  Tag,
  Eye,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ArrowLeft,
  AlertTriangle,
  Upload,
  X,
  ImagePlus,
  Plus,
} from 'lucide-react';
import { STUDIO_IMAGE_PRESETS } from '../data/products.js';
import { signInWithGoogle, logoutUser } from '../lib/firebase.js';
import defaultCatalogOptions from '../data/catalogOptions.json';

export const ADMIN_UID = 'lxumuDReWmMb1UAi3wGKSoM4nTr2';

export const AdminPage = ({
  currentUser,
  onNavigateHome,
  onAddProduct,
  onDeleteProduct,
  customProducts = [],
  onAddReview,
  onDeleteReview,
  customReviews = [],
  allProducts = [],
}) => {
  // Login error state
  const [loginError, setLoginError] = useState(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Active admin tab: 'addItem', 'addReview', 'manage'
  const [activeTab, setActiveTab] = useState('addItem');

  // Success message toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
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

  // Persistent Catalog Options (Categories, Finishes, Sizes) automatically stored in JSON file
  const OPTIONS_STORAGE_KEY = 'munthings_catalog_options';
  const [catalogOptions, setCatalogOptions] = useState(() => {
    try {
      const saved = localStorage.getItem(OPTIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.categories && parsed.finishes && parsed.sizes) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading catalog options:', e);
    }
    return defaultCatalogOptions;
  });

  // UI toggle states for adding new options
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingFinish, setIsAddingFinish] = useState(false);
  const [newFinishName, setNewFinishName] = useState('');
  const [isAddingSize, setIsAddingSize] = useState(false);
  const [newSizeName, setNewSizeName] = useState('');

  // Automatically persist options to catalogOptions.json and localStorage
  const persistOptions = async (updatedOptions) => {
    setCatalogOptions(updatedOptions);
    try {
      localStorage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(updatedOptions));
    } catch (e) {
      console.warn('LocalStorage error saving options:', e);
    }

    try {
      await fetch('/api/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOptions),
      });
    } catch (e) {
      console.warn('API error saving options to JSON file:', e);
    }
  };

  const handleAddCategory = (e) => {
    e?.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    if (catalogOptions.categories.some((c) => c.label.toLowerCase() === trimmed.toLowerCase())) {
      showToast(`Category "${trimmed}" already exists.`);
      return;
    }

    const updated = {
      ...catalogOptions,
      categories: [
        ...catalogOptions.categories,
        { id: trimmed, label: trimmed },
      ],
    };

    persistOptions(updated);
    setProdCategory(trimmed);
    setNewCategoryName('');
    setIsAddingCategory(false);
    showToast(`Category "${trimmed}" added and stored to JSON!`);
  };

  const handleAddFinish = (e) => {
    e?.preventDefault();
    const trimmed = newFinishName.trim();
    if (!trimmed) return;

    if (catalogOptions.finishes.some((f) => f.toLowerCase() === trimmed.toLowerCase())) {
      showToast(`Finish "${trimmed}" already exists.`);
      return;
    }

    const updated = {
      ...catalogOptions,
      finishes: [...catalogOptions.finishes, trimmed],
    };

    persistOptions(updated);
    setSelectedSurfaces((prev) => [...prev, trimmed]);
    setNewFinishName('');
    setIsAddingFinish(false);
    showToast(`Finish "${trimmed}" added and stored to JSON!`);
  };

  const handleAddSize = (e) => {
    e?.preventDefault();
    const trimmed = newSizeName.trim();
    if (!trimmed) return;

    if (catalogOptions.sizes.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      showToast(`Size "${trimmed}" already exists.`);
      return;
    }

    const updated = {
      ...catalogOptions,
      sizes: [...catalogOptions.sizes, trimmed],
    };

    persistOptions(updated);
    setSelectedSizes((prev) => [...prev, trimmed]);
    setNewSizeName('');
    setIsAddingSize(false);
    showToast(`Size "${trimmed}" added and stored to JSON!`);
  };

  // Add Review form state
  const [revAuthor, setRevAuthor] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revProduct, setRevProduct] = useState(allProducts[0]?.name || 'Adobo Pins');
  const [revComment, setRevComment] = useState('');
  const [revDate, setRevDate] = useState('Just now');

  // Handle Google Sign In on /admin page
  const handleAdminSignIn = async () => {
    setLoginError(null);
    setIsSubmittingAuth(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        const cleanUid = String(user.uid).replace(/^;/, '').trim();
        if (cleanUid !== ADMIN_UID) {
          // Immediately log out non-admin user
          console.warn('Unauthorized user attempted admin login:', user.email, user.uid);
          await logoutUser();
          setLoginError({
            type: 'unauthorized',
            title: 'Access Not Authorized',
            message: `User ${user.email} (UID: ${user.uid}) is not authorized. Please log out immediately! Admin access is strictly reserved for UID: ${ADMIN_UID}.`,
          });
          return;
        }
        showToast('Welcome back, Studio Admin!');
      }
    } catch (err) {
      console.warn('Admin Sign-In:', err?.code, err?.message);
      if (err?.code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'current domain';
        setLoginError({
          type: 'domain',
          title: 'Authorized Domain Required',
          message: `The domain "${domain}" is not authorized in Firebase Authentication. Add "${domain}" to Authorized Domains in Firebase Console.`,
        });
      } else if (err?.code === 'auth/network-request-failed') {
        setLoginError({
          type: 'network',
          title: 'Network / Browser Restriction',
          message: 'A browser restriction (such as blocked third-party cookies or an ad-blocker) prevented Google sign-in. Please allow third-party cookies or test on the live Firebase domain.',
        });
      } else if (err?.code !== 'auth/popup-closed-by-user') {
        setLoginError({
          type: 'general',
          title: 'Sign-in Failed',
          message: err?.message || 'Google sign-in could not be completed. Please try again.',
        });
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn('Logout error:', e);
    }
    showToast('Logged out of Studio Administration.');
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

  // Handle local photo import from device
  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        setCustomImageUrl(dataUrl);
        showToast(`Photo imported: ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Add Product submit
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
    showToast(`"${newProduct.name}" published to live store catalog!`);

    // Reset form fields
    setProdName('');
    setProdDesc('');
    setProdPrice('20.00');
    setCustomImageUrl('');
  };

  // Handle Add Review submit
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
    showToast(`Review by ${newReview.author} added!`);

    // Reset form fields
    setRevAuthor('');
    setRevComment('');
    setRevRating(5);
  };

  const isAdminAuthenticated = Boolean(
    currentUser?.isAdmin ||
    String(currentUser?.uid || '').replace(/^;/, '').trim() === ADMIN_UID
  );

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-stone-900 flex flex-col antialiased selection:bg-amber-200 selection:text-amber-900">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base text-stone-900 tracking-tight">
                  Munthings Studio Administration
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                  /admin
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-mono">
                {isAdminAuthenticated
                  ? `Authorized Admin · UID: ${ADMIN_UID}`
                  : 'Restricted access portal'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </button>

            {isAdminAuthenticated && (
              <button
                onClick={handleAdminLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 sm:right-8 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Admin Page Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8">
        {!isAdminAuthenticated ? (
          /* ========================================================== */
          /* LOGIN VIEW: Restricted Admin Login                        */
          /* ========================================================== */
          <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-amber-200 p-6 sm:p-8 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center mx-auto shadow-2xs">
              <ShieldCheck className="w-8 h-8 text-amber-700" />
            </div>

            <div className="space-y-2">
              <h1 className="font-display font-bold text-2xl text-stone-900 tracking-tight">
                Authorized Studio Login
              </h1>
              <p className="text-xs text-stone-500 leading-relaxed">
                This administration page is strictly locked to authorized studio personnel. Sign in with the designated Google account to manage store inventory.
              </p>
            </div>

            {/* Error Message Display */}
            {loginError && (
              <div className="p-4 bg-rose-50/90 border border-rose-200 rounded-2xl text-xs text-rose-950 font-medium text-left space-y-2 shadow-2xs">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-rose-950">{loginError.title}</p>
                    <p className="text-rose-800 text-[11px] leading-relaxed">{loginError.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Primary Google Login Button */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleAdminSignIn}
                disabled={isSubmittingAuth}
                className="w-full py-3.5 px-5 bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-800 font-bold text-sm rounded-2xl border border-stone-300 shadow-xs hover:shadow transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed group"
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
            </div>
          </div>
        ) : (
          /* ========================================================== */
          /* DASHBOARD VIEW: Authorized Admin Studio Management        */
          /* ========================================================== */
          <div className="bg-white rounded-3xl border border-amber-200 shadow-xl overflow-hidden flex flex-col">
            {/* Navigation Tabs Bar */}
            <div className="flex border-b border-stone-200 bg-stone-50/70 px-4 sm:px-6 pt-3.5 gap-2 text-xs font-bold overflow-x-auto">
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
                <span>Manage Added Items ({customProducts.length + customReviews.length})</span>
              </button>
            </div>

            {/* TAB 1: ADD ITEM TO SHOP */}
            {activeTab === 'addItem' && (
              <form onSubmit={handleAddProductSubmit} className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Product Info Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        placeholder="e.g., Sinigang Soup Button Pin"
                        required
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                            Category
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsAddingCategory(!isAddingCategory)}
                            className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>{isAddingCategory ? 'Cancel' : '+ Add'}</span>
                          </button>
                        </div>

                        {/* Inline form to add new Category */}
                        {isAddingCategory && (
                          <div className="mb-2 p-2 bg-amber-50/90 border border-amber-300 rounded-xl space-y-1.5">
                            <input
                              type="text"
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              placeholder="New category name..."
                              className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddCategory(e);
                                }
                              }}
                            />
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingCategory(false);
                                  setNewCategoryName('');
                                }}
                                className="px-2 py-1 text-[10px] font-bold text-stone-600 hover:bg-stone-200/60 rounded-md cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleAddCategory}
                                className="px-2.5 py-1 text-[10px] font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-md cursor-pointer shadow-2xs"
                              >
                                Save to JSON
                              </button>
                            </div>
                          </div>
                        )}

                        <select
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value)}
                          className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                        >
                          {catalogOptions.categories.map((cat) => (
                            <option key={cat.id || cat.label} value={cat.id || cat.label}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                          Price
                        </label>
                        <input
                          type="number"
                          step="0.50"
                          min="1.00"
                          value={prodPrice}
                          onChange={(e) => setProdPrice(e.target.value)}
                          placeholder="20.00"
                          className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Badge / Label (Optional)
                      </label>
                      <input
                        type="text"
                        value={prodBadge}
                        onChange={(e) => setProdBadge(e.target.value)}
                        placeholder="e.g., New Release, Bestseller, Limited"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        placeholder="Hand-pressed with archival inks and scratch-resistant mylar..."
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white resize-none"
                      />
                    </div>

                    {/* Available Surfaces */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                          Finish / Surfaces
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsAddingFinish(!isAddingFinish)}
                          className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{isAddingFinish ? 'Cancel' : '+ Add Finish'}</span>
                        </button>
                      </div>

                      {/* Inline form to add new Finish */}
                      {isAddingFinish && (
                        <div className="mb-2 p-2 bg-amber-50/90 border border-amber-300 rounded-xl space-y-1.5">
                          <input
                            type="text"
                            value={newFinishName}
                            onChange={(e) => setNewFinishName(e.target.value)}
                            placeholder="New finish name (e.g. Frosted, Canvas)..."
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddFinish(e);
                              }
                            }}
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingFinish(false);
                                setNewFinishName('');
                              }}
                              className="px-2 py-1 text-[10px] font-bold text-stone-600 hover:bg-stone-200/60 rounded-md cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAddFinish}
                              className="px-2.5 py-1 text-[10px] font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-md cursor-pointer shadow-2xs"
                            >
                              Save to JSON
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {catalogOptions.finishes.map((surf) => (
                          <button
                            key={surf}
                            type="button"
                            onClick={() => toggleSurface(surf)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                              selectedSurfaces.includes(surf)
                                ? 'bg-amber-400 text-stone-950 border-amber-400'
                                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            {surf}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Available Sizes */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                          Available Sizes
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsAddingSize(!isAddingSize)}
                          className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{isAddingSize ? 'Cancel' : '+ Add Size'}</span>
                        </button>
                      </div>

                      {/* Inline form to add new Size */}
                      {isAddingSize && (
                        <div className="mb-2 p-2 bg-amber-50/90 border border-amber-300 rounded-xl space-y-1.5">
                          <input
                            type="text"
                            value={newSizeName}
                            onChange={(e) => setNewSizeName(e.target.value)}
                            placeholder="New size (e.g. 50mm, 2x3 in)..."
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSize(e);
                              }
                            }}
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingSize(false);
                                setNewSizeName('');
                              }}
                              className="px-2 py-1 text-[10px] font-bold text-stone-600 hover:bg-stone-200/60 rounded-md cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAddSize}
                              className="px-2.5 py-1 text-[10px] font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-md cursor-pointer shadow-2xs"
                            >
                              Save to JSON
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {catalogOptions.sizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                              selectedSizes.includes(size)
                                ? 'bg-amber-400 text-stone-950 border-amber-400'
                                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Image Selection & Realtime Preview */}
                  <div className="space-y-4">
                    <div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                            Import Photo
                          </label>
                          {customImageUrl && (
                            <button
                              type="button"
                              onClick={() => setCustomImageUrl('')}
                              className="text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <X className="w-3 h-3" />
                              <span>Remove imported</span>
                            </button>
                          )}
                        </div>

                        {/* Import Photo File Picker */}
                        <label className="flex items-center justify-center gap-2.5 w-full py-3 px-4 bg-amber-50 hover:bg-amber-100/90 active:bg-amber-200 border-2 border-dashed border-amber-300 rounded-2xl text-xs font-bold text-amber-950 cursor-pointer transition-all shadow-2xs group">
                          <Upload className="w-4 h-4 text-amber-700 transition-transform group-hover:-translate-y-0.5" />
                          <span>
                            {customImageUrl.startsWith('data:')
                              ? 'Change Imported Photo'
                              : 'Click to Import Photo from Device'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileImport}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Live Preview Card (Enlarged showcase to eliminate empty space) */}
                    <div className="p-5 bg-[#FFFDF7] rounded-3xl border border-amber-200/90 shadow-2xs space-y-3.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider">
                          <Eye className="w-3.5 h-3.5 text-amber-600" />
                          <span>Live Storefront Preview</span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300">
                          {prodCategory || 'pins'}
                        </span>
                      </div>

                      {/* Large Product Image Preview */}
                      <div className="w-full h-52 sm:h-56 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 relative shadow-inner group">
                        <img
                          src={customImageUrl.trim() || selectedImagePreset}
                          alt="Preview"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = STUDIO_IMAGE_PRESETS[0].url;
                          }}
                        />
                        {prodBadge.trim() && (
                          <div className="absolute top-2.5 left-2.5">
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-stone-900/90 text-amber-300 backdrop-blur-xs shadow-sm">
                              {prodBadge}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Details Preview */}
                      <div className="space-y-2 text-left pt-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="font-display font-bold text-base text-stone-900 truncate">
                            {prodName.trim() || 'Your Product Title'}
                          </h4>
                          <span className="font-extrabold text-amber-700 text-lg flex-shrink-0">
                            ${parseFloat(prodPrice || '20.00').toFixed(2)}
                          </span>
                        </div>

                        {prodDesc.trim() && (
                          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                            {prodDesc}
                          </p>
                        )}

                        {/* Selected Finishes & Sizes Preview Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-semibold text-stone-600">
                          {selectedSurfaces.map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-stone-100 rounded-md border border-stone-200">
                              {s}
                            </span>
                          ))}
                          {selectedSizes.map((sz) => (
                            <span key={sz} className="px-2 py-0.5 bg-amber-50 text-amber-900 rounded-md border border-amber-200">
                              {sz}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 font-bold text-sm rounded-2xl shadow-xs hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <PackagePlus className="w-4 h-4" />
                      <span>Publish Item to Live Catalog</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* TAB 2: ADD CUSTOMER REVIEW */}
            {activeTab === 'addReview' && (
              <form onSubmit={handleAddReviewSubmit} className="p-6 sm:p-8 max-w-xl mx-auto space-y-4 w-full">
                <div className="space-y-1 text-left">
                  <h3 className="font-bold text-stone-900 text-base">Add a Customer Review</h3>
                  <p className="text-xs text-stone-500">
                    Publish verified collector feedback directly to the storefront review feed.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={revAuthor}
                    onChange={(e) => setRevAuthor(e.target.value)}
                    placeholder="e.g., Bea M."
                    required
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Rating (Stars)
                    </label>
                    <select
                      value={revRating}
                      onChange={(e) => setRevRating(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option value={5}>★★★★★ (5 Stars)</option>
                      <option value={4}>★★★★☆ (4 Stars)</option>
                      <option value={3}>★★★☆☆ (3 Stars)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Item Purchased
                    </label>
                    <input
                      type="text"
                      value={revProduct}
                      onChange={(e) => setRevProduct(e.target.value)}
                      placeholder="e.g., Adobo Pins"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Review Comment *
                  </label>
                  <textarea
                    rows={3}
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    placeholder="These pins look incredible on my backpack canvas..."
                    required
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 font-bold text-sm rounded-2xl shadow-xs hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Star className="w-4 h-4 fill-stone-950" />
                  <span>Publish Customer Review</span>
                </button>
              </form>
            )}

            {/* TAB 3: MANAGE ADDED ITEMS & REVIEWS */}
            {activeTab === 'manage' && (
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="font-bold text-sm text-stone-900 mb-3 flex items-center gap-2">
                    <PackagePlus className="w-4 h-4 text-amber-600" />
                    <span>Custom Shop Products ({customProducts.length})</span>
                  </h4>
                  {customProducts.length === 0 ? (
                    <p className="text-xs text-stone-400 italic bg-stone-50 p-4 rounded-xl border border-stone-200">
                      No custom products added yet. Use the "Add Item to Shop" tab to create your first item.
                    </p>
                  ) : (
                    <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
                      {customProducts.map((p) => (
                        <div key={p.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-stone-50 transition-colors">
                          <div className="flex items-center gap-3 truncate">
                            <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200" />
                            <div className="truncate">
                              <p className="font-bold text-xs text-stone-900 truncate">{p.name}</p>
                              <p className="text-[11px] text-stone-500 font-medium">
                                ${p.price?.toFixed(2)} · {p.category} {p.badge ? `· ${p.badge}` : ''}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              onDeleteProduct(p.id);
                              showToast(`Deleted "${p.name}"`);
                            }}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-sm text-stone-900 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-600" />
                    <span>Custom Customer Reviews ({customReviews.length})</span>
                  </h4>
                  {customReviews.length === 0 ? (
                    <p className="text-xs text-stone-400 italic bg-stone-50 p-4 rounded-xl border border-stone-200">
                      No custom reviews added yet. Use the "Add Customer Review" tab.
                    </p>
                  ) : (
                    <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
                      {customReviews.map((r) => (
                        <div key={r.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-stone-50 transition-colors">
                          <div className="truncate">
                            <p className="font-bold text-xs text-stone-900 truncate">{r.author} ({r.rating}★)</p>
                            <p className="text-[11px] text-stone-500 truncate">{r.comment}</p>
                          </div>
                          <button
                            onClick={() => {
                              onDeleteReview(r.id);
                              showToast(`Deleted review by ${r.author}`);
                            }}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                            title="Delete review"
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
      </main>
    </div>
  );
};
