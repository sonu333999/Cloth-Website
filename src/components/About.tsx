import React from 'react';
import { useLookbook } from '../context/LookbookContext';

export const About: React.FC = () => {
  const { brand, setActivePage } = useLookbook();

  return (
    <section
      id="about-brand"
      className="relative z-10 bg-[#EAE4DA] border-t border-[#D2CCC1] py-24 sm:py-32 px-5 sm:px-8 lg:px-12"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#99958D] mb-4">
            The House Philosophy
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-[54px] leading-[1.08] font-normal tracking-tight text-[#30312E]">
            A DIFFERENT PERSPECTIVE ON FASHION
          </h2>
        </div>

        <div className="lg:col-span-7 space-y-10">
          <p className="font-serif text-2xl sm:text-3xl leading-[1.45] text-[#30312E]/90">
            {brand.brandName === 'MAISON LUMIÈRE' ? 'Maison Lumière' : brand.brandName}{' '}
            celebrates individuality, contemporary design, and the art of personal
            expression through thoughtfully curated fashion collections.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-[#D2CCC1]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#80A997] mb-2">
                01. Provenance
              </p>
              <p className="text-sm leading-relaxed text-[#30312E]/75">
                Belgian flax, Japanese selvedge twill, and Grade-A mulberry silk sourced from traceable heritage mills.
              </p>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#80A997] mb-2">
                02. Proportion
              </p>
              <p className="text-sm leading-relaxed text-[#30312E]/75">
                Sculptural tailoring designed to drape naturally across silhouettes without rigid seasonal obsolescence.
              </p>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#80A997] mb-2">
                03. Atelier Craft
              </p>
              <p className="text-sm leading-relaxed text-[#30312E]/75">
                Every look is produced in numbered small editions to preserve artisan finishing and minimize waste.
              </p>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                setActivePage('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 border border-[#30312E] text-xs font-mono uppercase tracking-[0.18em] text-[#30312E] hover:bg-[#30312E] hover:text-white transition-colors"
            >
              Read Full Atelier Manifesto
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
