// Footer Component:
// The bottom footer of the website.
// Displays the brand logo, studio description, quick navigation links, and copyright text.

import React from 'react';
import { MunthingsLogo } from './MunthingsLogo.jsx';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-amber-100/40 border-t border-amber-200/80 pt-12 pb-10 text-stone-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-10 border-b border-amber-200/60">
          {/* Brand Intro & Logo */}
          <div className="space-y-3 text-left max-w-md">
            <MunthingsLogo size={46} showSubtitle={true} />
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Hand-pressed round button pins &amp; waterproof vinyl stickers illustrated by Barth’s Studio. Made to bring a little sunshine to your everyday items.
            </p>
          </div>

          {/* Quick Page Links */}
          <div className="space-y-3 text-left md:text-right">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-stone-900">
              Explore Munthings
            </h4>
            <ul className="space-y-2 text-xs font-medium text-stone-600 flex flex-col md:items-end">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-amber-800 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="hover:text-amber-800 transition-colors cursor-pointer"
                >
                  Shop Stickers &amp; Button Pins
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-amber-800 transition-colors cursor-pointer"
                >
                  Contact Me
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Line */}
        <div className="pt-6 text-xs text-stone-500 text-left">
          © {new Date().getFullYear()} Munthings. All rights reserved. Created with joy by Barth&apos;s Studio.
        </div>
      </div>
    </footer>
  );
};
