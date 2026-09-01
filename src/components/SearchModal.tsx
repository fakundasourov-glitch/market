import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { WhatsAppIcon } from './ProductCard';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currencySymbol: string;
  onSelectProduct: (product: Product) => void;
  onBuyWhatsApp: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  currencySymbol,
  onSelectProduct,
  onBuyWhatsApp,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults迷 = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const query = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
    );
  }, [searchTerm, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 md:pt-24 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl border border-[#EEEEEE] max-w-xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#EEEEEE] flex items-center gap-3 bg-[#f8f9fa]">
          <Search className="w-5 h-5 text-[#006d2f] shrink-0" />
          <input
            type="text"
            placeholder="Search essentials (e.g. Vase, Lamp, Linen, Ceramics)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-[#191c1d] placeholder:text-[#6c7b6b] focus:outline-hidden"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[#6c7b6b] hover:text-[#191c1d] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#5f5e5e] hover:text-[#191c1d] px-2 py-1 bg-[#e2dfde] rounded-md"
          >
            Esc
          </button>
        </div>

        {/* Search Results / Suggestions */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {!searchTerm.trim() ? (
            <div className="py-6 space-y-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6c7b6b] block">
                Popular Categories
              </span>
              <div className="flex flex-wrap gap-2">
                {['Home Decor', 'Lighting', 'Textiles', 'Furniture'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSearchTerm(cat)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f8f9fa] border border-[#EEEEEE] text-xs font-medium text-[#191c1d] hover:bg-[#edeeef] transition-colors"
                  >
                    <Tag className="w-3 h-3 text-[#006d2f]" />
                    <span>{cat}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6c7b6b] block mb-2">
                  Featured Items
                </span>
                <div className="space-y-2">
                  {products.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f8f9fa] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded-md border border-[#EEEEEE]"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-xs font-semibold text-[#191c1d]">{p.name}</p>
                          <span className="text-[10px] text-[#6c7b6b] uppercase">{p.category}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#191c1d]">
                        {currencySymbol}{p.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : searchResults迷.length === 0 ? (
            <div className="py-12 text-center text-[#5f5e5e]">
              <p className="text-sm font-medium mb-1">No products found matching "{searchTerm}"</p>
              <p className="text-xs">Try searching for ceramics, lamps, linen, or furniture.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6c7b6b] block">
                Matching Products ({searchResults迷.length})
              </span>
              {searchResults迷.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#EEEEEE] hover:bg-[#f8f9fa] transition-colors gap-3"
                >
                  <div 
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                    onClick={() => {
                      onSelectProduct(p);
                      onClose();
                    }}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded-md border border-[#EEEEEE] shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold text-[#006d2f] uppercase tracking-wider block">
                        {p.category}
                      </span>
                      <h4 className="text-xs font-semibold text-[#191c1d] truncate">{p.name}</h4>
                      <p className="text-xs font-bold text-[#191c1d]">
                        {currencySymbol}{p.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onBuyWhatsApp(p);
                    }}
                    className="bg-[#25d366] hover:bg-[#1ebd5b] text-white px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shrink-0"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                    <span>Buy</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
