// Navbar Component:
// The main top navigation header for the website.
// Includes the brand logo, page navigation tabs (Home, Shop, Contact Me),
// Liked items button, and the shopping cart button with an item counter badge.

import React from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { MunthingsLogo } from './MunthingsLogo.jsx';

export const Navbar = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  wishlistCount,
  openWishlist,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b border-amber-200/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Logo Button */}
        <button
          onClick={() => setActiveTab('home')}
          className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1 transition-transform active:scale-95 cursor-pointer"
          aria-label="Munthings Home"
        >
          <MunthingsLogo size={42} showSubtitle={true} />
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1.5 rounded-2xl border border-stone-200/80">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === 'home'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Home
            {activeTab === 'home' && (
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === 'shop'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Shop Pins &amp; Stickers
            {activeTab === 'shop' && (
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === 'contact'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Contact Me
            {activeTab === 'contact' && (
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Liked Items & Shopping Cart Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Liked Items Button with dynamic live counter */}
          <button
            onClick={openWishlist}
            aria-label={`View liked items (${wishlistCount})`}
            className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl transition-all cursor-pointer active:scale-95 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-rose-400 ${
              wishlistCount > 0
                ? 'bg-rose-50/90 hover:bg-rose-100 text-rose-950 border-rose-200 shadow-2xs'
                : 'bg-stone-100/70 hover:bg-stone-100 text-stone-600 border-stone-200/80'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-stone-600'
              }`}
            />
            <span className="hidden sm:inline">Liked</span>
            {wishlistCount > 0 && (
              <span className="bg-rose-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger Button */}
          <button
            onClick={openCart}
            aria-label={`Shopping cart with ${cartCount} items`}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs shadow-xs hover:shadow transition-all cursor-pointer active:scale-95 border border-amber-500/40 focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <ShoppingBag className="w-4 h-4 text-stone-950" />
            <span className="hidden sm:inline">Cart</span>
            <span className="bg-stone-950 text-white text-[11px] font-bold px-2 py-0.5 rounded-full min-w-5 text-center">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="flex md:hidden border-t border-amber-100 px-4 py-2 gap-2 text-xs font-semibold bg-[#FFFDF7]/80 justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'home' ? 'bg-amber-100 text-amber-950 font-bold' : ''
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('shop')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'shop' ? 'bg-amber-100 text-amber-950 font-bold' : ''
          }`}
        >
          Shop
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'contact' ? 'bg-amber-100 text-amber-950 font-bold' : ''
          }`}
        >
          Contact Me
        </button>
      </div>
    </header>
  );
};
