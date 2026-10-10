// App Component:
// The main root application component for the Munthings website.
// Renders the separate /admin portal when URL is '/admin',
// or the storefront (Home, Shop, Contact, Cart, Wishlist) on all other paths.

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
import { AdminPage } from './components/AdminPage.jsx';
import { UnauthorizedModal } from './components/UnauthorizedModal.jsx';
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

// Designated Studio Administrator UID (strictly lxumuDReWmMb1UAi3wGKSoM4nTr2)
export const ADMIN_UID = 'lxumuDReWmMb1UAi3wGKSoM4nTr2';

export const checkIsAdmin = (user) => {
  if (!user || !user.uid) return false;
  const cleanUid = String(user.uid).replace(/^;/, '').trim();
  return cleanUid === ADMIN_UID || user.uid === `;${ADMIN_UID}`;
};

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
  // Current URL path tracking (/admin vs storefront)
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window === 'undefined') return '/';
    return (window.location.pathname || '/').toLowerCase();
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath((window.location.pathname || '/').toLowerCase());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const isAdminRoute =
    currentPath === '/admin' ||
    currentPath === '/admin/' ||
    (typeof window !== 'undefined' &&
      (window.location.hash === '#/admin' || window.location.hash === '#admin'));

  // Active storefront page tab: 'home', 'shop', or 'contact'
  const [activeTab, setActiveTab] = useState('home');

  // Studio Profile & Current User (restored globally via onAuthStateChanged)
  const [currentUser, setCurrentUser] = useState(null);

  // Pop-up alert notice displayed when an unauthorized account attempts to log in
  const [unauthorizedUserNotice, setUnauthorizedUserNotice] = useState(null);

  // Firestore remote data
  const [firestoreProducts, setFirestoreProducts] = useState([]);
  const [firestoreReviews, setFirestoreReviews] = useState([]);

  // Listen to Auth State Globally: Non-admin users are logged out immediately
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Logged in user UID:", user.uid);
        console.log("Email:", user.email);
        const isAdmin = checkIsAdmin(user);

        if (!isAdmin) {
          // Immediately log out unauthorized user and trigger pop-up
          console.warn("Unauthorized user attempted login. Logging out immediately:", user.email, user.uid);
          const deniedInfo = {
            email: user.email || 'No email provided',
            uid: user.uid,
          };
          try {
            await logoutUser();
          } catch (e) {
            console.warn("Logout error:", e);
          }
          setCurrentUser(null);
          setUnauthorizedUserNotice(deniedInfo);
          return;
        }

        // Verified Studio Admin UID: lxumuDReWmMb1UAi3wGKSoM4nTr2
        const userInfo = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email?.split('@')[0] || "Studio Admin",
          role: 'admin',
          isAdmin: true,
        };
        setCurrentUser(userInfo);
      } else {
        // User is signed out
        console.log("No user signed in");
        setCurrentUser(null);
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

  // Custom products added via Studio Admin
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

  // Custom reviews added via Studio Admin
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

  // Shopping cart items stored permanently in browser localStorage
  const [cart, setCart] = useState(() => loadSavedCart());

  // Wishlisted product IDs stored in browser localStorage
  const [wishlist, setWishlist] = useState(() => loadSavedWishlist());

  // Drawer and Modal visibility states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
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

  // Add and Delete Product Handlers with Firestore synchronization
  const handleAddProduct = async (newProduct) => {
    if (!currentUser?.isAdmin) {
      console.warn('Unauthorized: only the designated studio admin can add items');
      return;
    }
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
    if (!currentUser?.isAdmin) {
      console.warn('Unauthorized: only the designated studio admin can delete items');
      return;
    }
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

  // Combine default catalog with Firestore remote products and custom products
  const allProducts = [
    ...customProducts,
    ...firestoreProducts.filter((fp) => !customProducts.some((cp) => cp.id === fp.id)),
    ...PRODUCTS.filter(
      (p) =>
        !customProducts.some((cp) => cp.id === p.id) &&
        !firestoreProducts.some((fp) => fp.id === p.id)
    ),
  ];

  // Combine default reviews with Firestore remote reviews and custom reviews
  const allReviews = [
    ...customReviews,
    ...firestoreReviews.filter((fr) => !customReviews.some((cr) => cr.id === fr.id)),
    ...REVIEWS.filter(
      (r) =>
        !customReviews.some((cr) => cr.id === r.id) &&
        !firestoreReviews.some((fr) => fr.id === r.id)
    ),
  ];

  // Cart actions
  const handleAddToCart = (product, options = {}) => {
    const selectedSize = options.selectedSize || product.availableSizes?.[0] || '25mm';
    const surface = options.surface || product.availableSurfaces?.[0] || 'Glossy';
    const includePackaging = Boolean(options.includePackaging);
    const unitPrice = options.unitPrice ?? product.price ?? 15.00;
    const packagingPrice = options.packagingPrice ?? 0;
    const quantityToAdd = options.quantity ?? 1;

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.surface === surface &&
          item.includePackaging === includePackaging
      );

      if (existingItemIndex > -1) {
        const updated = [...prevCart];
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: updated[existingItemIndex].quantity + quantityToAdd,
        };
        return updated;
      }

      return [
        ...prevCart,
        {
          product,
          quantity: quantityToAdd,
          selectedSize,
          surface,
          includePackaging,
          unitPrice,
          packagingPrice,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(index);
      return;
    }
    setCart((prevCart) => {
      const updated = [...prevCart];
      updated[index] = { ...updated[index], quantity: newQty };
      return updated;
    });
  };

  const handleRemoveFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const handleToggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const totalCartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const navigateToStorefront = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
    }
    setCurrentPath('/');
  };

  /* ================================================================ */
  /* ROUTE 1: SEPARATE ADMIN PAGE (/admin in URL)                     */
  /* ================================================================ */
  if (isAdminRoute) {
    return (
      <>
        <AdminPage
          currentUser={currentUser}
          onNavigateHome={navigateToStorefront}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          customProducts={customProducts}
          onAddReview={handleAddReview}
          onDeleteReview={handleDeleteReview}
          customReviews={customReviews}
          allProducts={allProducts}
        />

        {/* Pop-up alert for unauthorized login attempts */}
        <UnauthorizedModal
          isOpen={Boolean(unauthorizedUserNotice)}
          userInfo={unauthorizedUserNotice}
          onClose={() => setUnauthorizedUserNotice(null)}
          onRetry={() => setUnauthorizedUserNotice(null)}
        />
      </>
    );
  }

  /* ================================================================ */
  /* ROUTE 2: CLEAN PUBLIC STOREFRONT (No admin button or popup)      */
  /* ================================================================ */
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-stone-800 font-sans selection:bg-amber-300 selection:text-stone-900">
      {/* Top Navigation Bar: Home, Shop, Contact Me, Liked Items & Cart (Clean Storefront) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        openWishlist={() => setIsWishlistOpen(true)}
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

      {/* Pop-up alert for unauthorized login attempts */}
      <UnauthorizedModal
        isOpen={Boolean(unauthorizedUserNotice)}
        userInfo={unauthorizedUserNotice}
        onClose={() => setUnauthorizedUserNotice(null)}
        onRetry={() => {
          setUnauthorizedUserNotice(null);
          if (typeof window !== 'undefined') {
            window.history.pushState({}, '', '/admin');
            setCurrentPath('/admin');
          }
        }}
      />
    </div>
  );
}
