import React, { useState } from 'react';
import { Heart, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { useLookbook } from '../context/LookbookContext';
import { EditorialImage } from './EditorialImage';
import { Product } from '../types/fashion';

export const ShopTheLook: React.FC = () => {
  const {
    collections,
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedCollection,
    setActivePage,
  } = useLookbook();

  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  // Showcase 6 hero shoppable products spanning key collections
  const showcaseProducts: Product[] = products.slice(0, 6);

  const getSize = (p: Product) => selectedSizes[p.id] || p.sizes[0] || 'M';

  return (
    <section
      id="shop-the-look"
      className="relative z-10 bg-[#F4F0E9] border-t border-[#D2CCC1] py-20 sm:py-28 px-5 sm:px-8 lg:px-12"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#D2CCC1]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#99958D] mb-3">
              Curated Wardrobe
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#30312E]">
              Shop the Look
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[#30312E] border-b border-[#30312E] pb-1 hover:text-[#80A997] hover:border-[#80A997] transition-colors self-start md:self-auto"
          >
            <span>Browse Full Atelier Catalog</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
          {showcaseProducts.map((product) => {
            const col = collections.find((c) => c.id === product.collectionId);
            const saved = isInWishlist(product.id);
            const activeSize = getSize(product);

            return (
              <article
                key={product.id}
                className="group flex flex-col bg-[#EAE4DA]/55 border border-[#D2CCC1]/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(48,49,46,0.08)]"
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
                  className="relative aspect-[3/4] w-full overflow-hidden bg-[#EAE4DA] cursor-pointer"
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
                    aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
                    className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                      saved
                        ? 'bg-[#30312E] text-white'
                        : 'bg-[#F4F0E9]/90 text-[#30312E] hover:bg-[#30312E] hover:text-white'
                    }`}
                  >
                    <Heart
                      className="w-4 h-4"
                      fill={saved ? 'currentColor' : 'none'}
                      strokeWidth={1.5}
                    />
                  </button>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#99958D]">
                        {col ? col.name : 'Collection Piece'}
                      </span>
                      <span className="font-mono text-sm text-[#30312E] tabular-nums font-medium">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#30312E] leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs leading-relaxed text-[#30312E]/70 mt-1.5">
                      {product.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-[#D2CCC1]/70">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#99958D]">
                        Size
                      </span>
                      <div className="flex flex-wrap items-center gap-1">
                        {product.sizes.map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() =>
                              setSelectedSizes((prev) => ({ ...prev, [product.id]: sz }))
                            }
                            className={`px-2 py-1 text-[10px] font-mono transition-colors ${
                              activeSize === sz
                                ? 'bg-[#30312E] text-white'
                                : 'bg-[#F4F0E9] text-[#30312E] border border-[#D2CCC1] hover:border-[#30312E]'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        void addToCart(product, activeSize, product.colors[0] || 'Default')
                      }
                      className="w-full py-3 bg-[#30312E] text-white text-[11px] font-mono uppercase tracking-[0.18em] flex items-center justify-center gap-2 hover:bg-[#414642] transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
