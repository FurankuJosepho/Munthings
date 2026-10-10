// ShopPage Component:
// The store catalog view where customers can browse, filter, search,
// and sort button pins and waterproof stickers.

import React, { useState, useMemo } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { ProductCard } from './ProductCard.jsx';

import defaultCatalogOptions from '../data/catalogOptions.json';

export const ShopPage = ({
  products,
  onAddToCart,
  onQuickView,
  wishlist,
  onToggleWishlist,
}) => {
  // Filter and search state variables
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Dynamic catalog options loaded from JSON and localStorage
  const storedOptions = useMemo(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('munthings_catalog_options');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.categories) return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    return defaultCatalogOptions;
  }, []);

  // Filter and sort the products based on user selections
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Filter by category or liked items
        if (activeCategory === 'liked') {
          if (!wishlist.includes(p.id)) return false;
        } else if (activeCategory !== 'all') {
          const cat = (p.category || '').toLowerCase();
          const target = activeCategory.toLowerCase();
          const matches =
            cat === target ||
            (target === 'pins' && cat.includes('pin')) ||
            (target === 'stickers' && cat.includes('sticker'));
          if (!matches) return false;
        }
        // Filter by in-stock status
        if (inStockOnly && !p.inStock) {
          return false;
        }
        // Filter by search text query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            (p.material && p.material.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        // Sort by price or customer review count
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.reviewsCount - a.reviewsCount; // Default: Most popular
      });
  }, [products, activeCategory, searchQuery, sortBy, inStockOnly, wishlist]);

  // Available category tabs dynamically built from catalogOptions
  const categories = useMemo(() => {
    return [
      { id: 'all', label: 'All Items' },
      { id: 'liked', label: `Liked (${wishlist.length})` },
      ...storedOptions.categories.map((c) => ({
        id: c.id,
        label: c.label,
      })),
    ];
  }, [wishlist.length, storedOptions]);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Header Title & Description */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
          Munthings Studio Shop
        </span>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 mt-1">
          Hand-Pressed Button Pins &amp; Waterproof Stickers
        </h1>
        <p className="text-sm text-stone-600 mt-2">
          Illustrated by Barth’s Studio in small batches. Choose from classic round pinback button pins with shiny mylar finish or thick weatherproof die-cut stickers.
        </p>
      </div>

      {/* 2. Search & Category Controls Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-amber-50/70 border border-amber-200/60 rounded-xl overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-amber-100/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box Input */}
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search button pins, moon stickers..."
              className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none bg-stone-50/60 transition-all text-stone-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-Filters: Count, In-Stock Checkbox, Sort Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-amber-100/80 text-xs text-stone-600">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-stone-800 tabular-nums">
              Showing {filteredProducts.length} of {products.length} products
            </span>

            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-amber-300 text-amber-500 focus:ring-amber-400"
              />
              <span className="text-stone-600">In stock only</span>
            </label>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-stone-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Product Catalog Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
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
      ) : (
        /* Empty State if search finds no matches */
        <div className="text-center py-16 bg-white rounded-3xl border border-amber-200/80 p-8 max-w-lg mx-auto">
          <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-stone-900">
            No matching items found
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or filter to see more button pins and stickers from Barth&apos;s Studio.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
              setInStockOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
