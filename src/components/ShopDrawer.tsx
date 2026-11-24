import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useLookbook } from '../context/LookbookContext';
import { EditorialImage } from './EditorialImage';

export const ShopDrawer: React.FC = () => {
  const {
    user,
    cart,
    isBagOpen,
    setIsBagOpen,
    updateCartQuantity,
    removeFromCart,
    placeOrder,
    signInWithGoogle,
  } = useLookbook();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  if (!isBagOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!user) {
      await signInWithGoogle();
      return;
    }
    if (customerName.trim().length < 2) {
      setFormError('Please provide your full name.');
      return;
    }
    if (shippingAddress.trim().length < 8) {
      setFormError('Please provide a complete delivery address.');
      return;
    }
    setSubmitting(true);
    try {
      const id = await placeOrder(customerName, shippingAddress);
      if (id) {
        setConfirmedOrderId(id);
        setCheckoutOpen(false);
        setShippingAddress('');
      }
    } catch {
      setFormError('Unable to submit your order right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
      className="fixed inset-0 z-[80] flex justify-end bg-[#30312E]/45 backdrop-blur-[2px]"
      onClick={() => setIsBagOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#F4F0E9] text-[#30312E] h-full flex flex-col border-l border-[#D2CCC1] shadow-2xl"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#D2CCC1] flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#99958D]">
              Atelier Selection
            </p>
            <h2 className="font-serif text-2xl">
              Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmedOrderId(null);
              setIsBagOpen(false);
            }}
            aria-label="Close shopping bag"
            className="w-10 h-10 flex items-center justify-center hover:bg-[#30312E]/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {confirmedOrderId ? (
            <div className="bg-[#EAE4DA] border border-[#D2CCC1] p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#80A997]">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-mono text-xs uppercase tracking-[0.18em]">
                  Atelier Order Recorded
                </span>
              </div>
              <h3 className="font-serif text-2xl">Thank you for your reservation.</h3>
              <p className="text-sm text-[#30312E]/80 leading-relaxed">
                Order reference <span className="font-mono font-medium">{confirmedOrderId}</span> has been saved to your account. Our atelier concierge will confirm dispatch details via email.
              </p>
              <button
                type="button"
                onClick={() => {
                  setConfirmedOrderId(null);
                  setIsBagOpen(false);
                }}
                className="w-full py-3 bg-[#30312E] text-white text-xs font-mono uppercase tracking-[0.18em]"
              >
                Continue Exploring
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <ShoppingBag className="w-8 h-8 text-[#99958D]" strokeWidth={1.2} />
              <p className="font-serif text-2xl">Your bag is currently empty.</p>
              <p className="text-sm text-[#99958D] max-w-xs">
                Explore the 3D circular lookbook or curated stories to add garments to your selection.
              </p>
            </div>
          ) : (
            cart.map((item) => (
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
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-lg leading-snug">{item.name}</h3>
                      <button
                        type="button"
                        onClick={() => void removeFromCart(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="text-[#99958D] hover:text-[#30312E] p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-mono text-[11px] text-[#99958D] mt-1">
                      Size {item.size} · {item.color}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <div className="inline-flex items-center border border-[#D2CCC1] bg-[#EAE4DA]/60">
                      <button
                        type="button"
                        onClick={() => void updateCartQuantity(item.id, -1)}
                        aria-label="Decrease quantity"
                        className="w-8 h-8 flex items-center justify-center hover:bg-[#30312E] hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 font-mono text-xs tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => void updateCartQuantity(item.id, 1)}
                        aria-label="Increase quantity"
                        className="w-8 h-8 flex items-center justify-center hover:bg-[#30312E] hover:text-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-mono text-sm tabular-nums">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Checkout Form */}
          {checkoutOpen && cart.length > 0 && !confirmedOrderId && (
            <form
              onSubmit={(e) => void handlePlaceOrder(e)}
              className="bg-[#EAE4DA] border border-[#D2CCC1] p-5 space-y-4"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#80A997]">
                Atelier Order Request
              </p>
              {!user ? (
                <div className="space-y-3">
                  <p className="text-xs text-[#30312E]/80 leading-relaxed">
                    Sign in with Google to save and track your order in Firestore.
                  </p>
                  <button
                    type="button"
                    onClick={() => void signInWithGoogle()}
                    className="w-full py-2.5 bg-[#30312E] text-white text-xs font-mono uppercase tracking-[0.16em]"
                  >
                    Sign In with Google
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="checkout-name"
                      className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#99958D] mb-1"
                    >
                      Recipient Name
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      placeholder="Your full name"
                      className="w-full px-3 py-2.5 bg-[#F4F0E9] border border-[#D2CCC1] text-sm focus:outline-none focus:border-[#30312E]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="checkout-address"
                      className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#99958D] mb-1"
                    >
                      Delivery Address
                    </label>
                    <textarea
                      id="checkout-address"
                      rows={3}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                      placeholder="Street, city, postal code, country"
                      className="w-full px-3 py-2.5 bg-[#F4F0E9] border border-[#D2CCC1] text-sm focus:outline-none focus:border-[#30312E]"
                    />
                  </div>
                  {formError && (
                    <p className="text-xs text-rose-700 font-mono">{formError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#30312E] text-white text-xs font-mono uppercase tracking-[0.18em] hover:bg-[#414642] transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Submitting Order...' : 'Submit Atelier Order'}
                  </button>
                </>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && !confirmedOrderId && (
          <div className="p-6 border-t border-[#D2CCC1] bg-[#EAE4DA]/70 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#99958D]">
                Subtotal
              </span>
              <span className="font-mono text-lg tabular-nums font-medium">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            {!checkoutOpen && (
              <button
                type="button"
                onClick={() => {
                  setCustomerName(user?.displayName || '');
                  setCheckoutOpen(true);
                }}
                className="w-full py-3.5 bg-[#30312E] text-white text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#414642] transition-colors"
              >
                Proceed to Order Request
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
