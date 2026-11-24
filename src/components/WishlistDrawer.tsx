import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useLookbook } from '../context/LookbookContext';
import { EditorialImage } from './EditorialImage';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    products,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
  } = useLookbook();

  if (!isWishlistOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Saved Wishlist"
      className="fixed inset-0 z-[80] flex justify-end bg-[#30312E]/45 backdrop-blur-[2px]"
      onClick={() => setIsWishlistOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#F4F0E9] text-[#30312E] h-full flex flex-col border-l border-[#D2CCC1] shadow-2xl"
      >
        <div className="px-6 py-5 border-b border-[#D2CCC1] flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#99958D]">
              Saved Pieces
            </p>
            <h2 className="font-serif text-2xl">Wishlist ({wishlist.length})</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close wishlist"
            className="w-10 h-10 flex items-center justify-center hover:bg-[#30312E]/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <Heart className="w-8 h-8 text-[#99958D]" strokeWidth={1.2} />
              <p className="font-serif text-2xl">No pieces saved yet.</p>
              <p className="text-sm text-[#99958D] max-w-xs">
                Tap the heart icon on any collection piece to curate your personal lookbook edit.
              </p>
            </div>
          ) : (
            wishlist.map((item) => {
              const fullProduct = products.find((p) => p.id === item.productId);
              return (
                <div
                  key={item.id}
                  className="flex gap-4 pb-5 border-b border-[#D2CCC1]/75"
                >
                  <div className="w-20 aspect-[3/4] bg-[#EAE4DA] shrink-0 overflow-hidden">
                    <EditorialImage
                      src={item.image}
                      alt={item.name}
                      fallbackTitle={item.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-lg leading-snug">{item.name}</h3>
                        <p className="font-mono text-xs tabular-nums text-[#30312E]/80 mt-1">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      {fullProduct && (
                        <button
                          type="button"
                          onClick={() => void toggleWishlist(fullProduct)}
                          aria-label={`Remove ${item.name} from wishlist`}
                          className="text-[#99958D] hover:text-[#30312E] p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {fullProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          void addToCart(
                            fullProduct,
                            fullProduct.sizes[0] || 'M',
                            fullProduct.colors[0] || 'Default'
                          );
                          setIsWishlistOpen(false);
                        }}
                        className="mt-3 w-full py-2 bg-[#30312E] text-white text-[10px] font-mono uppercase tracking-[0.18em] flex items-center justify-center gap-1.5 hover:bg-[#414642] transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
