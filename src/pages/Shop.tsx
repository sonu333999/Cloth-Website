import React, { useState, useMemo } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useLookbook } from '../context/LookbookContext';
import { EditorialImage } from '../components/EditorialImage';
import { Product } from '../types/fashion';

export const Shop: React.FC = () => {
  const {
    collections,
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedCollection,
  } = useLookbook();

  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [sizeMap, setSizeMap] = useState<Record<string, string>>({});

  const filteredProducts = useMemo(() => {
    const base =
      selectedCollectionId === 'all'
        ? products
        : products.filter((p) => p.collectionId === selectedCollectionId);

    if (sortOrder === 'price-asc') {
      return [...base].sort((a, b) => a.price - b.price);
    }
    if (sortOrder === 'price-desc') {
      return [...base].sort((a, b) => b.price - a.price);
    }
    return base;
  }, [products, selectedCollectionId, sortOrder]);

  const getSize = (p: Product) => sizeMap[p.id] || p.sizes[0] || 'M';

  return (
    <main className="min-h-screen bg-[#EAE4DA] pt-28 pb-24 px-5 sm:px-8 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#D2CCC1]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#99958D] mb-2">
              Atelier Showroom
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#30312E]">
              Complete Lookbook Catalog
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="shop-sort" className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#99958D]">
              Sort
            </label>
            <select
              id="shop-sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
              className="px-3 py-2 bg-[#F4F0E9] border border-[#D2CCC1] text-xs font-mono text-[#30312E] focus:outline-none focus:border-[#30312E]"
            >
              <option value="default">Curated Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Collection Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 py-6 border-b border-[#D2CCC1]/70">
          <button
            type="button"
            onClick={() => setSelectedCollectionId('all')}
            className={`px-3.5 py-2 text-xs font-mono uppercase tracking-[0.14em] transition-colors whitespace-nowrap ${
              selectedCollectionId === 'all'
                ? 'bg-[#30312E] text-white'
                : 'bg-[#F4F0E9] text-[#30312E] border border-[#D2CCC1] hover:border-[#30312E]'
            }`}
          >
            All ({products.length})
          </button>
          {collections.map((col) => (
            <button
              key={col.id}
              type="button"
              onClick={() => setSelectedCollectionId(col.id)}
              className={`px-3.5 py-2 text-xs font-mono uppercase tracking-[0.14em] transition-colors whitespace-nowrap ${
                selectedCollectionId === col.id
                  ? 'bg-[#30312E] text-white'
                  : 'bg-[#F4F0E9] text-[#30312E] border border-[#D2CCC1] hover:border-[#30312E]'
              }`}
            >
              {col.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
          {filteredProducts.map((product) => {
            const col = collections.find((c) => c.id === product.collectionId);
            const saved = isInWishlist(product.id);
            const activeSize = getSize(product);

            return (
              <article
                key={product.id}
                className="flex flex-col bg-[#F4F0E9] border border-[#D2CCC1]"
              >
                <div
                  onClick={() => col && setSelectedCollection(col)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && col) {
                      e.preventDefault();
                      setSelectedCollection(col);
                    }
                  }}
                  className="relative aspect-[3/4] overflow-hidden bg-[#EAE4DA] cursor-pointer group"
                >
                  <EditorialImage
                    src={product.image}
                    alt={product.name}
                    fallbackTitle={product.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      void toggleWishlist(product);
                    }}
                    aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                    className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                      saved
                        ? 'bg-[#30312E] text-white'
                        : 'bg-[#F4F0E9]/90 text-[#30312E] hover:bg-[#30312E] hover:text-white'
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#99958D]">
                        {col?.name || 'Archive'}
                      </span>
                      <span className="font-mono text-sm tabular-nums font-medium">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl text-[#30312E]">{product.name}</h2>
                    <p className="text-xs text-[#30312E]/70 mt-1.5 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#D2CCC1]">
                    <div className="flex flex-wrap gap-1.5">
                      {product.sizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() =>
                            setSizeMap((prev) => ({ ...prev, [product.id]: sz }))
                          }
                          className={`px-2.5 py-1 text-[11px] font-mono transition-colors ${
                            activeSize === sz
                              ? 'bg-[#30312E] text-white'
                              : 'bg-[#EAE4DA] text-[#30312E] border border-[#D2CCC1]'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        void addToCart(product, activeSize, product.colors[0] || 'Default')
                      }
                      disabled={product.stock <= 0}
                      className="w-full py-3 bg-[#30312E] text-white text-xs font-mono uppercase tracking-[0.18em] flex items-center justify-center gap-2 hover:bg-[#414642] transition-colors disabled:opacity-50"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{product.stock > 0 ? 'Add to Bag' : 'Sold Out'}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
};
