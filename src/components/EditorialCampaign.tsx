import React from 'react';
import { CAMPAIGN_IMAGE_URL } from '../data/collections';
import { useLookbook } from '../context/LookbookContext';
import { EditorialImage } from './EditorialImage';

export const EditorialCampaign: React.FC = () => {
  const { setActivePage } = useLookbook();

  return (
    <section
      aria-label="Editorial Campaign"
      className="relative w-full min-h-[72vh] sm:min-h-[82vh] flex items-end overflow-hidden bg-[#30312E]"
    >
      <EditorialImage
        src={CAMPAIGN_IMAGE_URL}
        alt="Maison Lumière architectural travertine colonnade autumn-winter campaign"
        fallbackTitle="THE ART OF DRESSING"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Measured contrast scrim ensuring > 4.5:1 legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#1E1F1D]/85 via-[#1E1F1D]/35 to-transparent"
      />

      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-[#80A997] mb-4">
          Campaign Film &amp; Monograph
        </p>
        <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white max-w-3xl leading-[1.04]">
          THE ART OF DRESSING
        </h2>
        <p className="mt-5 text-base sm:text-xl text-[#F4F0E9]/88 max-w-xl leading-relaxed font-light">
          Style is not what you wear. It is how you express yourself.
        </p>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => {
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-7 py-3.5 bg-[#EAE4DA] text-[#30312E] text-xs font-mono uppercase tracking-[0.2em] font-medium hover:bg-[#80A997] hover:text-white transition-colors"
          >
            Enter the Showroom
          </button>
        </div>
      </div>
    </section>
  );
};
