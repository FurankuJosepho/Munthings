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
import { PRODUCTS } from './data/products.js';

// Storage keys for persisting cart and wishlist across sessions
const CART_STORAGE_KEYS = ['munthings_user_cart', 'munthings_cart', 'cart'];
const WISHLIST_STORAGE_KEYS = ['munthings_user_wishlist', 'munthings_wishlist', 'wishlist'];

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

  // Shopping cart items stored permanently in browser localStorage
  const [cart, setCart] = useState(() => loadSavedCart());

  // Wishlisted product IDs stored in browser localStorage
  const [wishlist, setWishlist] = useState(() => loadSavedWishlist());

  // Drawer and Modal visibility states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

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
      {/* Top Navigation Bar: Home, Shop, Contact Me, and Cart */}
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
            products={PRODUCTS}
            onNavigate={setActiveTab}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activeTab === 'shop' && (
          <ShopPage
            products={PRODUCTS}
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
        products={PRODUCTS}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        onQuickView={(p) => setQuickViewProduct(p)}
      />
    </div>
  );
}
