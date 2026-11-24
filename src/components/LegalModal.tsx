import React from 'react';
import { X } from 'lucide-react';
import { useLookbook } from '../context/LookbookContext';

export const LegalModal: React.FC = () => {
  const { legalModal, setLegalModal, brand } = useLookbook();

  if (!legalModal) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={legalModal === 'privacy' ? 'Privacy Policy' : 'Terms and Conditions'}
      className="fixed inset-0 z-[90] flex items-center justify-center p-5 bg-[#30312E]/50 backdrop-blur-[2px]"
      onClick={() => setLegalModal(null)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-xl w-full bg-[#F4F0E9] border border-[#D2CCC1] p-7 sm:p-9 space-y-5 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#D2CCC1] pb-4">
          <h2 className="font-serif text-3xl text-[#30312E]">
            {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
          </h2>
          <button
            type="button"
            onClick={() => setLegalModal(null)}
            aria-label="Close legal notice"
            className="w-9 h-9 flex items-center justify-center hover:bg-[#30312E]/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {legalModal === 'privacy' ? (
          <div className="space-y-3 text-sm leading-relaxed text-[#30312E]/80">
            <p>
              {brand.brandName} collects only the details required to manage your wishlist, shopping bag, atelier order reservations, and seasonal newsletter dispatches.
            </p>
            <p>
              Authenticated account details, saved bags, and order records are isolated by verified user identity in Cloud Firestore. We never sell or share client information with third-party data brokers.
            </p>
          </div>
        ) : (
          <div className="space-y-3 text-sm leading-relaxed text-[#30312E]/80">
            <p>
              All lookbook imagery, silhouettes, and seasonal archives presented by {brand.brandName} are produced in numbered small editions.
            </p>
            <p>
              Submitting an order request records a formal atelier reservation; final fabric availability and dispatch schedules are confirmed directly by our concierge team.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
