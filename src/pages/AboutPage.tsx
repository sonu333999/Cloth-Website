import React from 'react';
import { CAMPAIGN_IMAGE_URL } from '../data/collections';
import { useLookbook } from '../context/LookbookContext';
import { EditorialImage } from '../components/EditorialImage';
import { Newsletter } from '../components/Newsletter';

export const AboutPage: React.FC = () => {
  const { brand, collections, setSelectedCollection, setActivePage } = useLookbook();

  return (
    <main className="min-h-screen bg-[#EAE4DA] pt-28">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-20">
        <div className="max-w-3xl space-y-5 pb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#99958D]">
            Maison Manifesto
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight text-[#30312E] leading-[1.06]">
            A DIFFERENT PERSPECTIVE ON FASHION
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-[#30312E]/80">
            {brand.brandName} celebrates individuality, contemporary design, and the art of personal expression through thoughtfully curated fashion collections.
          </p>
        </div>

        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#30312E] mb-16">
          <EditorialImage
            src={CAMPAIGN_IMAGE_URL}
            alt="Maison Lumière Parisian stone gallery campaign"
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-12 border-y border-[#D2CCC1]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#80A997] mb-3">
              01. Craft &amp; Materials
            </p>
            <p className="text-sm leading-relaxed text-[#30312E]/80">
              Every silhouette begins with tactile research: unbleached Belgian flax, raw Japanese selvedge, and fluid French Chantilly lace.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#80A997] mb-3">
              02. Quiet Architecture
            </p>
            <p className="text-sm leading-relaxed text-[#30312E]/80">
              Garments are draped directly on the stand to honor movement, shoulder poise, and effortless everyday longevity.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#80A997] mb-3">
              03. Digital Lookbook
            </p>
            <p className="text-sm leading-relaxed text-[#30312E]/80">
              Designed as an intimate gallery rather than an endless grid, inviting unhurried exploration across ten seasonal studies.
            </p>
          </div>
        </div>

        <div className="pt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl text-[#30312E]">Archive Index</h2>
            <button
              type="button"
              onClick={() => setActivePage('home')}
              className="font-mono text-xs uppercase tracking-[0.18em] border-b border-[#30312E] pb-1"
            >
              Return to 3D Carousel
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {collections.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => setSelectedCollection(col)}
                className="text-left group"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#F4F0E9] mb-2">
                  <EditorialImage
                    src={col.modelImage}
                    alt={col.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="font-mono text-[10px] text-[#99958D]">{col.category}</p>
                <p className="font-serif text-lg text-[#30312E]">{col.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Newsletter />
    </main>
  );
};
