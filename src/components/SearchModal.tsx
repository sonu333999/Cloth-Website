import React, { useEffect, useState } from 'react';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { useLookbook } from '../context/LookbookContext';
import { EditorialImage } from './EditorialImage';

export const SearchModal: React.FC = () => {
  const {
    collections,
    products,
    isSearchOpen,
    setIsSearchOpen,
    setSelectedCollection,
    setActiveCarouselIndex,
  } = useLookbook();

  const [queryText, setQueryText] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    if (isSearchOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = queryText.trim().toLowerCase();
  const matchedCollections = collections.filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
  );
  const matchedProducts = products.filter(
    (p) =>
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Lookbook"
      className="fixed inset-0 z-[85] bg-[#EAE4DA]/96 backdrop-blur-md overflow-y-auto"
    >
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8 py-10">
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#D2CCC1]">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-[#99958D]" />
            <input
              type="text"
              autoFocus
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Search collections, silhouettes, or pieces..."
              className="w-full bg-transparent text-xl sm:text-2xl font-serif text-[#30312E] placeholder:text-[#99958D] focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
            className="w-10 h-10 flex items-center justify-center border border-[#D2CCC1] hover:bg-[#30312E] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#99958D] mb-4">
              Collections ({matchedCollections.length})
            </p>
            <div className="space-y-3">
              {matchedCollections.slice(0, 6).map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => {
                    const idx = collections.findIndex((c) => c.id === col.id);
                    if (idx !== -1) setActiveCarouselIndex(idx);
                    setSelectedCollection(col);
                    setIsSearchOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-4 p-3 bg-[#F4F0E9] border border-[#D2CCC1] hover:border-[#30312E] text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <EditorialImage
                      src={col.modelImage}
                      alt={col.name}
                      className="w-12 h-16 object-cover object-top"
                    />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#80A997]">
                        {col.category}
                      </p>
                      <p className="font-serif text-lg text-[#30312E]">{col.name}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#99958D]" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#99958D] mb-4">
              Pieces ({matchedProducts.length})
            </p>
            <div className="space-y-3">
              {matchedProducts.slice(0, 6).map((prod) => {
                const parent = collections.find((c) => c.id === prod.collectionId);
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => {
                      if (parent) setSelectedCollection(parent);
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between gap-4 p-3 bg-[#F4F0E9] border border-[#D2CCC1] hover:border-[#30312E] text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <EditorialImage
                        src={prod.image}
                        alt={prod.name}
                        className="w-12 h-16 object-cover object-top"
                      />
                      <div>
                        <p className="font-serif text-lg text-[#30312E]">{prod.name}</p>
                        <p className="font-mono text-xs tabular-nums text-[#99958D]">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#99958D]" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
