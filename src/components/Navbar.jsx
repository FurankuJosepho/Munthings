// Navbar Component:
// The main top navigation header for the website.
// Includes the brand logo, page navigation tabs (Home, Shop, Contact Me),
// and the shopping cart button with an item counter badge.

import React from 'react';
import { ShoppingBag, Heart, User } from 'lucide-react';
import { MunthingsLogo } from './MunthingsLogo.jsx';

export const Navbar = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  wishlistCount,
  openWishlist,
  currentUser,
  openProfile,
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

        {/* Zone 2: Clean 3 Navigation Links (Home, Shop, Contact Me) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-stone-600">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors hover:text-amber-800 whitespace-nowrap cursor-pointer relative py-2 ${
              activeTab === 'home'
                ? 'text-stone-950 font-bold'
                : 'text-stone-600'
            }`}
          >
            Home
            {activeTab === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`transition-colors hover:text-amber-800 whitespace-nowrap cursor-pointer relative py-2 ${
              activeTab === 'shop'
                ? 'text-stone-950 font-bold'
                : 'text-stone-600'
            }`}
          >
            Shop Stickers &amp; Button Pins
            {activeTab === 'shop' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`transition-colors hover:text-amber-800 whitespace-nowrap cursor-pointer relative py-2 ${
              activeTab === 'contact'
                ? 'text-stone-950 font-bold'
                : 'text-stone-600'
            }`}
          >
            Contact Me
            {activeTab === 'contact' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Profile Symbol, Liked Items & Cart Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Profile Symbol Button (icon only, no text) */}
          <button
            onClick={openProfile}
            aria-label={currentUser ? "Studio Profile (Admin Active)" : "Studio Profile Login"}
            title={currentUser ? "Studio Profile (Admin Active)" : "Studio Profile Login"}
            className={`relative p-2 sm:p-2.5 border rounded-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amber-400 ${
              currentUser
                ? 'bg-amber-100/90 hover:bg-amber-200 text-amber-950 border-amber-300 shadow-2xs'
                : 'bg-stone-100/70 hover:bg-stone-100 text-stone-700 hover:text-stone-900 border-stone-200/80'
            }`}
          >
            <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            {currentUser && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </button>

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
                wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-stone-400'
              }`}
            />
            <span className="hidden sm:inline">Liked</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[11px] font-bold tabular-nums min-w-[18px] text-center transition-colors ${
                wishlistCount > 0
                  ? 'bg-rose-500 text-white shadow-2xs'
                  : 'bg-stone-200 text-stone-600'
              }`}
            >
              {wishlistCount}
            </span>
          </button>

          {/* Cart Button */}
          <button
            onClick={openCart}
            aria-label={`Open shopping cart, ${cartCount} items`}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-semibold text-xs tracking-wide rounded-xl shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <ShoppingBag className={`w-4 h-4 text-amber-400 ${cartCount > 0 ? 'scale-110' : ''} transition-transform`} />
            <span className="hidden xs:inline">Cart</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold tabular-nums min-w-[20px] text-center transition-all ${
              cartCount > 0
                ? 'bg-amber-400 text-stone-950 shadow-xs scale-100'
                : 'bg-stone-800 text-stone-400'
            }`}>
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar for small screens */}
      <div className="md:hidden flex items-center justify-around border-t border-amber-200/50 bg-[#FFFDF7] px-2 py-2 text-xs font-semibold text-stone-600">
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
        <button
          onClick={openProfile}
          aria-label={currentUser ? "Studio Profile (Admin Active)" : "Studio Profile Login"}
          title={currentUser ? "Studio Profile (Admin Active)" : "Studio Profile Login"}
          className={`p-2 rounded-lg transition-colors flex items-center justify-center relative ${
            currentUser ? 'bg-amber-200/70 text-amber-950' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <User className="w-4 h-4" />
          {currentUser && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-white" />
          )}
        </button>
      </div>
    </header>
  );
};
