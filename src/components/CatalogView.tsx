import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, Check, Sparkles } from 'lucide-react';

interface CatalogViewProps {
  products: Product[];
  currencySymbol: string;
  onBuyWhatsApp: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenContact: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  currencySymbol,
  onBuyWhatsApp,
  onSelectProduct,
  onAddToCart,
  onOpenContact,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  // Categories extracted dynamically from products
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(products.map((p) => p.category))];
    return cats;
  }, [products]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, selectedCategory, sortBy]);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-12 md:py-16">
      {/* Hero Section matching the prompt */}
      <section className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
        <h1 className="text-[28px] md:text-[32px] leading-[36px] md:leading-[40px] tracking-[-0.02em] font-bold text-[#191c1d] mb-3">
          Elegance & Pure Science Delivered to Your Door.
        </h1>
        <p className="text-[16px] leading-[24px] text-[#3c4a3d] max-w-xl mx-auto">
          Order via WhatsApp. Authentic Minimalist Skincare & curated lifestyle essentials formulated for transparent, effective results.
        </p>
      </section>

      {/* Filter & Category Bar */}
      <section className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#EEEEEE] pb-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto py-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#191c1d] text-white'
                  : 'bg-white text-[#5f5e5e] hover:bg-[#edeeef] border border-[#EEEEEE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort options */}
        <div className="flex items-center gap-3 self-end sm:self-auto text-xs font-medium text-[#5f5e5e]">
          <div className="flex items-center gap-1.5 bg-white border border-[#EEEEEE] rounded-lg px-2.5 py-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#6c7b6b]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-[#191c1d] focus:outline-hidden cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
          <span className="text-[#6c7b6b]">({filteredProducts.length} items)</span>
        </div>
      </section>

      {/* Product Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            currencySymbol={currencySymbol}
            onBuyWhatsApp={onBuyWhatsApp}
            onSelectProduct={onSelectProduct}
            onAddToCart={onAddToCart}
          />
        ))}
      </section>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-[#EEEEEE] p-8">
          <p className="text-base text-[#5f5e5e] mb-4">No products found in this category.</p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="text-xs font-semibold text-[#006d2f] underline hover:opacity-80"
          >
            Show All Products
          </button>
        </div>
      )}

      {/* Trust & WhatsApp concierge bar */}
      <section className="mt-16 bg-white border border-[#EEEEEE] rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 product-card-shadow">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#25d366]/10 flex items-center justify-center text-[#006d2f] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#191c1d] mb-1">
              Need custom sizing or bespoke interior advice?
            </h3>
            <p className="text-sm text-[#5f5e5e]">
              Our studio concierge is available directly on WhatsApp to answer questions, share live photos, and tailor orders.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenContact}
          className="bg-[#191c1d] hover:bg-[#333333] text-white px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0"
        >
          Message Concierge
        </button>
      </section>
    </div>
  );
};
