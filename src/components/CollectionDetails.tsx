import React, { useEffect, useState } from 'react';
import { X, Heart, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLookbook } from '../context/LookbookContext';
import { EditorialImage } from './EditorialImage';
import { Product } from '../types/fashion';

export const CollectionDetails: React.FC = () => {
  const {
    collections,
    products,
    selectedCollection,
    setSelectedCollection,
    setActiveCarouselIndex,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useLookbook();

  const [sizeMap, setSizeMap] = useState<Record<string, string>>({});
  const [colorMap, setColorMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCollection(null);
      }
    };
    if (selectedCollection) {
      window.addEventListener('keydown', onKey);
    }
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedCollection, setSelectedCollection]);

  if (!selectedCollection) return null;

  const collectionProducts = products.filter(
    (p) => p.collectionId === selectedCollection.id
  );
  const currentIdx = collections.findIndex((c) => c.id === selectedCollection.id);

  const navigateSibling = (delta: number) => {
    if (collections.length === 0) return;
    const nextIdx = (currentIdx + delta + collections.length) % collections.length;
    setSelectedCollection(collections[nextIdx]);
    setActiveCarouselIndex(nextIdx);
  };

  const getSize = (p: Product) => sizeMap[p.id] || p.sizes[0] || 'M';
  const getColor = (p: Product) => colorMap[p.id] || p.colors[0] || 'Default';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${selectedCollection.name} Look Details`}
      className="fixed inset-0 z-[70] bg-[#EAE4DA] overflow-y-auto"
    >
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-[#EAE4DA]/95 backdrop-blur-md border-b border-[#D2CCC1] px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSelectedCollection(null)}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[#30312E] hover:text-[#80A997] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Lookbook</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigateSibling(-1)}
            aria-label="Previous collection"
            className="w-9 h-9 border border-[#D2CCC1] flex items-center justify-center hover:bg-[#30312E] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-xs tabular-nums text-[#99958D]">
            {String(currentIdx + 1).padStart(2, '0')} / {String(collections.length).padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={() => navigateSibling(1)}
            aria-label="Next collection"
            className="w-9 h-9 border border-[#D2CCC1] flex items-center justify-center hover:bg-[#30312E] hover:text-white transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setSelectedCollection(null)}
            aria-label="Close collection details"
            className="ml-2 w-10 h-10 flex items-center justify-center bg-[#30312E] text-white hover:bg-[#414642] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Sticky Model Showcase */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="relative aspect-[3/4] w-full bg-[#F4F0E9] overflow-hidden border border-[#D2CCC1]">
            <EditorialImage
              src={selectedCollection.modelImage}
              alt={selectedCollection.altText}
              loading="eager"
              fallbackTitle={selectedCollection.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Look Narrative & Shoppable Pieces */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-4 pb-8 border-b border-[#D2CCC1]">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#80A997]">
              {selectedCollection.category}
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight text-[#30312E]">
              {selectedCollection.name}
            </h1>
            <p className="font-serif italic text-xl text-[#30312E]/85">
              {selectedCollection.description}
            </p>
            <p className="text-[15px] leading-[1.75] text-[#30312E]/75 max-w-2xl pt-2">
              {selectedCollection.editorialStory}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[#30312E]">
                Pieces in This Look ({collectionProducts.length})
              </h2>
            </div>

            {collectionProducts.length === 0 ? (
              <p className="text-sm text-[#99958D] py-8 border border-[#D2CCC1] p-6 bg-[#F4F0E9]">
                Pieces for this archive look are available by private atelier appointment.
              </p>
            ) : (
              <div className="space-y-6">
                {collectionProducts.map((product) => {
                  const activeSize = getSize(product);
                  const activeColor = getColor(product);
                  const saved = isInWishlist(product.id);

                  return (
                    <div
                      key={product.id}
                      className="bg-[#F4F0E9] border border-[#D2CCC1] p-5 sm:p-6 flex flex-col sm:flex-row gap-6"
                    >
                      <div className="w-full sm:w-32 aspect-[3/4] bg-[#EAE4DA] shrink-0 overflow-hidden">
                        <EditorialImage
                          src={product.image}
                          alt={product.name}
                          fallbackTitle={product.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-serif text-2xl text-[#30312E]">
                              {product.name}
                            </h3>
                            <span className="font-mono text-base text-[#30312E] tabular-nums font-medium shrink-0">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <p className="text-sm text-[#30312E]/75 mt-1.5 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#99958D] mb-2">
                              Size
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {product.sizes.map((sz) => (
                                <button
                                  key={sz}
                                  type="button"
                                  onClick={() =>
                                    setSizeMap((prev) => ({ ...prev, [product.id]: sz }))
                                  }
                                  className={`px-2.5 py-1 text-xs font-mono transition-colors ${
                                    activeSize === sz
                                      ? 'bg-[#30312E] text-white'
                                      : 'bg-[#EAE4DA] text-[#30312E] border border-[#D2CCC1] hover:border-[#30312E]'
                                  }`}
                                >
                                  {sz}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#99958D] mb-2">
                              Color
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {product.colors.map((cl) => (
                                <button
                                  key={cl}
                                  type="button"
                                  onClick={() =>
                                    setColorMap((prev) => ({ ...prev, [product.id]: cl }))
                                  }
                                  className={`px-2.5 py-1 text-xs font-mono transition-colors ${
                                    activeColor === cl
                                      ? 'bg-[#30312E] text-white'
                                      : 'bg-[#EAE4DA] text-[#30312E] border border-[#D2CCC1] hover:border-[#30312E]'
                                  }`}
                                >
                                  {cl}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() =>
                              void addToCart(product, activeSize, activeColor)
                            }
                            disabled={product.stock <= 0}
                            className="flex-1 min-w-[180px] py-3 px-5 bg-[#30312E] text-white text-xs font-mono uppercase tracking-[0.18em] flex items-center justify-center gap-2 hover:bg-[#414642] transition-colors disabled:opacity-50"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{product.stock > 0 ? 'Add to Bag' : 'Sold Out'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => void toggleWishlist(product)}
                            className={`py-3 px-4 border text-xs font-mono uppercase tracking-[0.14em] inline-flex items-center gap-2 transition-colors ${
                              saved
                                ? 'bg-[#80A997] border-[#80A997] text-white'
                                : 'border-[#D2CCC1] text-[#30312E] hover:border-[#30312E]'
                            }`}
                          >
                            <Heart
                              className="w-3.5 h-3.5"
                              fill={saved ? 'currentColor' : 'none'}
                            />
                            <span>{saved ? 'Saved' : 'Wishlist'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
