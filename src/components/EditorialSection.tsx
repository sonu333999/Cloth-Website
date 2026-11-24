import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useLookbook } from '../context/LookbookContext';
import { EditorialImage } from './EditorialImage';

gsap.registerPlugin(ScrollTrigger);

const STORY_IDS = [
  'summer-linen',
  'street-layers',
  'denim-story',
  'the-white-veil',
  'evening-grace',
  'modern-minimal',
];

export const EditorialSection: React.FC = () => {
  const { collections, setSelectedCollection, setActiveCarouselIndex } = useLookbook();
  const storiesRef = useRef<HTMLElement | null>(null);

  const storyCollections = STORY_IDS.map((id) =>
    collections.find((c) => c.id === id)
  ).filter((c): c is NonNullable<typeof c> => Boolean(c));

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !storiesRef.current) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.story-row').forEach((row) => {
        gsap.from(row, {
          y: 28,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 82%',
            once: true,
          },
        });
      });
    }, storiesRef);

    return () => ctx.revert();
  }, [storyCollections.length]);

  const jumpToCarousel = (id: string) => {
    const idx = collections.findIndex((c) => c.id === id);
    if (idx !== -1) {
      setActiveCarouselIndex(idx);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="collection-stories"
      ref={storiesRef}
      className="relative z-10 bg-[#EAE4DA] border-t border-[#D2CCC1] py-20 sm:py-28 px-5 sm:px-8 lg:px-12"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="max-w-2xl mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#99958D] mb-3">
            Editorial Journal
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#30312E]">
            Collection Stories
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#30312E]/75">
            Notes from the Maison Lumière atelier on drape, textile provenance, and seasonal proportion across six signature studies.
          </p>
        </div>

        <div className="space-y-20 sm:space-y-24">
          {storyCollections.map((col, idx) => {
            const reversed = idx % 2 === 1;
            return (
              <div
                key={col.id}
                className="story-row grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center pb-16 border-b border-[#D2CCC1]/70 last:border-b-0 last:pb-0"
              >
                <div
                  className={`lg:col-span-6 ${
                    reversed ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div
                    onClick={() => setSelectedCollection(col)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedCollection(col);
                      }
                    }}
                    className="relative aspect-[3/4] max-h-[580px] w-full overflow-hidden bg-[#F4F0E9] cursor-pointer group"
                  >
                    <EditorialImage
                      src={col.modelImage}
                      alt={col.altText}
                      fallbackTitle={col.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                </div>

                <div
                  className={`lg:col-span-6 ${
                    reversed ? 'lg:order-1 lg:pr-8' : 'lg:order-2 lg:pl-8'
                  } space-y-5`}
                >
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#80A997]">
                    {col.category}
                  </p>
                  <h3 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#30312E]">
                    {col.name}
                  </h3>
                  <p className="font-serif italic text-xl text-[#30312E]/85 leading-relaxed">
                    “{col.description}”
                  </p>
                  <p className="text-[15px] leading-[1.75] text-[#30312E]/75 max-w-xl">
                    {col.editorialStory}
                  </p>

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedCollection(col)}
                      className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#30312E] text-white text-xs font-mono uppercase tracking-[0.18em] hover:bg-[#414642] transition-colors whitespace-nowrap"
                    >
                      <span>Shop this Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => jumpToCarousel(col.id)}
                      className="px-4 py-3 border border-[#D2CCC1] text-xs font-mono uppercase tracking-[0.16em] text-[#30312E] hover:border-[#30312E] transition-colors whitespace-nowrap"
                    >
                      Focus in 3D Stage
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
