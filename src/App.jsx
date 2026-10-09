// App Component:
// The main root application component for the Munthings website.
// Manages the active page tab ('home', 'shop', or 'contact'),
// the shopping cart, the wishlist, and the product quick-view modal.

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { HomePage } from './components/HomePage.jsx';
import { ShopPage } from './components/ShopPage.jsx';
import { ContactPage } from './components/ContactPage.jsx';
import { Footer } from './components/Footer.jsx';
import { CartDrawer } from './components/CartDrawer.jsx';
import { CheckoutModal } from './components/CheckoutModal.jsx';
import { ProductModal } from './components/ProductModal.jsx';
import { WishlistModal } from './components/WishlistModal.jsx';
import { ProfileModal } from './components/ProfileModal.jsx';
import { PRODUCTS, REVIEWS } from './data/products.js';
import {
  db,
  auth,
  logoutUser,
  handleFirestoreError,
  OperationType,
} from './lib/firebase.js';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Storage keys for persisting cart and wishlist across sessions
const CART_STORAGE_KEYS = ['munthings_user_cart', 'munthings_cart', 'cart'];
const WISHLIST_STORAGE_KEYS = ['munthings_user_wishlist', 'munthings_wishlist', 'wishlist'];
const CUSTOM_PRODUCTS_KEY = 'munthings_custom_products';
const CUSTOM_REVIEWS_KEY = 'munthings_custom_reviews';
const CURRENT_USER_KEY = 'munthings_current_user';

// Robust cart loader from browser localStorage
const loadSavedCart = () => {
  if (typeof window === 'undefined') return [];
  for (const key of CART_STORAGE_KEYS) {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) continue;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
          .filter(Boolean)
          .map((item) => {
            const prodId = item?.product?.id || item?.id;
            const freshProduct = PRODUCTS.find((p) => p.id === prodId) || item.product || PRODUCTS[0];
            const size = item.selectedSize || freshProduct?.availableSizes?.[0] || '25mm';
            const surface = item.surface || (freshProduct?.availableSurfaces?.[0] || 'Glossy');
            const includePackaging = Boolean(item.includePackaging);
            const unitPrice = typeof item.unitPrice === 'number' && !isNaN(item.unitPrice)
              ? item.unitPrice
              : (freshProduct?.price ?? 15.00);
            const packagingPrice = typeof item.packagingPrice === 'number'
              ? item.packagingPrice
              : 0;
            const qty = typeof item.quantity === 'number' && item.quantity > 0
              ? item.quantity
              : 1;

            return {
              product: freshProduct,
              quantity: qty,
              selectedSize: size,
              surface,
              includePackaging,
              unitPrice,
              packagingPrice,
            };
          });
      }
    } catch (err) {
      console.warn('Error reading cart from localStorage key:', key, err);
    }
  }
  return [];
};

// Robust wishlist loader from browser localStorage
const loadSavedWishlist = () => {
  if (typeof window === 'undefined') return [];
  for (const key of WISHLIST_STORAGE_KEYS) {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) continue;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (err) {
      console.warn('Error reading wishlist from localStorage key:', key, err);
    }
  }
  return [];
};

export default function App() {
  // Current active page: 'home', 'shop', or 'contact'
  const [activeTab, setActiveTab] = useState('home');

  // Studio Admin Profile & Current User
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading current user:', e);
    }
    return null;
  });

  // Firestore remote data
  const [firestoreProducts, setFirestoreProducts] = useState([]);
  const [firestoreReviews, setFirestoreReviews] = useState([]);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userInfo = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email?.split('@')[0] || "Studio Admin",
          role: 'admin',
        };
        setCurrentUser(userInfo);
        try {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userInfo));
        } catch (e) {
          console.error(e);
        }
      } else {
        setCurrentUser(null);
        try {
          localStorage.removeItem(CURRENT_USER_KEY);
        } catch (e) {
          console.error(e);
        }
      }
    });
    return () => unsub();
  }, []);

  // Real-time synchronization with Firestore products collection
  useEffect(() => {
    let unsub = () => {};
    try {
      unsub = onSnapshot(
        collection(db, 'products'),
        (snapshot) => {
          const prods = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));
          setFirestoreProducts(prods);
        },
        (error) => {
          if (error?.code === 'permission-denied') {
            console.warn('Firestore products read restricted or unauthenticated, falling back to local catalog.');
            return;
          }
          handleFirestoreError(error, OperationType.GET, 'products');
        }
      );
    } catch (err) {
      console.warn('Could not initialize products listener:', err);
    }
    return () => unsub();
  }, [currentUser]);

  // Real-time synchronization with Firestore reviews collection
  useEffect(() => {
    let unsub = () => {};
    try {
      unsub = onSnapshot(
        collection(db, 'reviews'),
        (snapshot) => {
          const revs = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));
          setFirestoreReviews(revs);
        },
        (error) => {
          if (error?.code === 'permission-denied') {
            console.warn('Firestore reviews read restricted or unauthenticated, falling back to local reviews.');
            return;
          }
          handleFirestoreError(error, OperationType.GET, 'reviews');
        }
      );
    } catch (err) {
      console.warn('Could not initialize reviews listener:', err);
    }
    return () => unsub();
  }, [currentUser]);

  // Custom products added via Studio Profile
  const [customProducts, setCustomProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading custom products:', e);
    }
    return [];
  });

  // Custom reviews added via Studio Profile
  const [customReviews, setCustomReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_REVIEWS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading custom reviews:', e);
    }
    return [];
  });

  // Combined product catalog and reviews (Firestore + local custom + defaults)
  const allProducts = [
    ...firestoreProducts,
    ...customProducts.filter((cp) => !firestoreProducts.some((fp) => fp.id === cp.id)),
    ...PRODUCTS.filter((p) => !firestoreProducts.some((fp) => fp.id === p.id)),
  ];

  const allReviews = [
    ...firestoreReviews,
    ...customReviews.filter((cr) => !firestoreReviews.some((fr) => fr.id === cr.id)),
    ...REVIEWS.filter((r) => !firestoreReviews.some((fr) => fr.id === r.id)),
  ];

  // Shopping cart items stored permanently in browser localStorage
  const [cart, setCart] = useState(() => loadSavedCart());

  // Wishlisted product IDs stored in browser localStorage
  const [wishlist, setWishlist] = useState(() => loadSavedWishlist());

  // Drawer and Modal visibility states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Sync custom products with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(customProducts));
    } catch (e) {
      console.error('Error saving custom products:', e);
    }
  }, [customProducts]);

  // Sync custom reviews with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_REVIEWS_KEY, JSON.stringify(customReviews));
    } catch (e) {
      console.error('Error saving custom reviews:', e);
    }
  }, [customReviews]);

  // Handle Login and Logout
  const handleLogin = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Error saving user:', e);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn('Firebase signout error:', e);
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch (e) {
      console.error('Error removing user:', e);
    }
  };

  // Add and Delete Product Handlers with Firestore synchronization
  const handleAddProduct = async (newProduct) => {
    setCustomProducts((prev) => [newProduct, ...prev]);
    try {
      await setDoc(doc(db, 'products', newProduct.id), {
        ...newProduct,
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser?.uid || 'studio_admin',
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${newProduct.id}`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    setCustomProducts((prev) => prev.filter((p) => p.id !== productId));
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
    }
  };

  // Add and Delete Review Handlers with Firestore synchronization
  const handleAddReview = async (newReview) => {
    setCustomReviews((prev) => [newReview, ...prev]);
    try {
      await setDoc(doc(db, 'reviews', newReview.id), {
        ...newReview,
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser?.uid || 'customer',
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `reviews/${newReview.id}`);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    setCustomReviews((prev) => prev.filter((r) => r.id !== reviewId));
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `reviews/${reviewId}`);
    }
  };

  // Keep cart permanently synced with localStorage across both keys
  useEffect(() => {
    try {
      const serialized = JSON.stringify(cart);
      localStorage.setItem('munthings_user_cart', serialized);
      localStorage.setItem('munthings_cart', serialized);
    } catch (e) {
      console.error('Error saving cart to localStorage:', e);
    }
  }, [cart]);

  // Keep wishlist permanently synced with localStorage across both keys
  useEffect(() => {
    try {
      const serialized = JSON.stringify(wishlist);
      localStorage.setItem('munthings_user_wishlist', serialized);
      localStorage.setItem('munthings_wishlist', serialized);
    } catch (e) {
      console.error('Error saving wishlist to localStorage:', e);
    }
  }, [wishlist]);

  // Smoothly scroll to the top of the page whenever the user switches tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Function to add a product to the shopping cart
  const handleAddToCart = (product, quantity = 1, selectedSize = null, options = {}) => {
    const size = selectedSize || (product.availableSizes ? product.availableSizes[0] : null);
    const surface = options.surface || (product.availableSurfaces ? product.availableSurfaces[0] : null);
    const includePackaging = Boolean(options.includePackaging);
    const unitPrice = options.unitPrice ?? product.price;
    const packagingPrice = options.packagingPrice ?? 0;

    setCart((prev) => {
      const existing = prev.find(
        (it) =>
          it.product.id === product.id &&
          it.selectedSize === size &&
          it.surface === surface &&
          it.includePackaging === includePackaging
      );
      if (existing) {
        return prev.map((it) =>
          it === existing
            ? { ...it, quantity: it.quantity + quantity }
            : it
        );
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedSize: size,
          surface,
          includePackaging,
          unitPrice,
          packagingPrice,
        },
      ];
    });
  };

  // Function to change quantity of an item in the cart
  const handleUpdateQuantity = (productId, selectedSize, quantity, surface = null, includePackaging = false) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId, selectedSize, surface, includePackaging);
      return;
    }
    setCart((prev) =>
      prev.map((it) =>
        it.product.id === productId &&
        it.selectedSize === selectedSize &&
        it.surface === surface &&
        Boolean(it.includePackaging) === Boolean(includePackaging)
          ? { ...it, quantity }
          : it
      )
    );
  };

  // Function to remove an item entirely from the cart
  const handleRemoveFromCart = (productId, selectedSize, surface = null, includePackaging = false) => {
    setCart((prev) =>
      prev.filter(
        (it) =>
          !(
            it.product.id === productId &&
            it.selectedSize === selectedSize &&
            it.surface === surface &&
            Boolean(it.includePackaging) === Boolean(includePackaging)
          )
      )
    );
  };

  // Function to toggle a product on/off the wishlist
  const handleToggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Calculate total number of items across all products in cart
  const totalCartCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-stone-800 font-sans selection:bg-amber-300 selection:text-stone-900">
      {/* Top Navigation Bar: Home, Shop, Contact Me, Profile/Login, and Cart */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        openWishlist={() => setIsWishlistOpen(true)}
        currentUser={currentUser}
        openProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Page Content based on activeTab */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            products={allProducts}
            onNavigate={setActiveTab}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            reviews={allReviews}
          />
        )}

        {activeTab === 'shop' && (
          <ShopPage
            products={allProducts}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activeTab === 'contact' && <ContactPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={setActiveTab} />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onNavigateToShop={() => setActiveTab('shop')}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderComplete={() => setCart([])}
      />

      {/* Product Quick-View Dialog */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Liked Items (Wishlist) Slide-over Drawer */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        products={allProducts}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* Studio Profile & Admin Management Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        customProducts={customProducts}
        onAddReview={handleAddReview}
        onDeleteReview={handleDeleteReview}
        customReviews={customReviews}
        allProducts={allProducts}
      />
    </div>
  );
}
