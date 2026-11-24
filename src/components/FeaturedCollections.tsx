import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { useLookbook } from '../context/LookbookContext';
import { EditorialImage } from './EditorialImage';

gsap.registerPlugin(ScrollTrigger);

export const FeaturedCollections: React.FC = () => {
  const { collections, setSelectedCollection, setActiveCarouselIndex } = useLookbook();
  const sectionRef = useRef<HTMLElement | null>(null);

  const featured = collections.filter((c) => c.featured).slice(0, 6);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.featured-card', {
        y: 32,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [featured.length]);

  const handleOrbit = (collectionId: string) => {
    const idx = collections.findIndex((c) => c.id === collectionId);
    if (idx !== -1) {
      setActiveCarouselIndex(idx);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="featured-collections"
      ref={sectionRef}
      className="relative z-10 bg-[#F4F0E9] border-t border-[#D2CCC1] py-20 sm:py-28 px-5 sm:px-8 lg:px-12"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#D2CCC1]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#99958D] mb-3">
              Curated Archive
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#30312E]">
              Featured Collections
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-[#30312E]/75">
            Ten seasonal silhouettes crafted in small batches—balancing fluid natural textiles with sharp architectural lines.
          </p>
        </div>

        {/* Asymmetrical Editorial Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pt-12">
          {featured.map((col, idx) => {
            const spanClass =
              idx === 0 || idx === 3
                ? 'md:col-span-7'
                : idx === 1 || idx === 2
                ? 'md:col-span-5'
                : 'md:col-span-6';
            const aspectClass =
              idx === 0 || idx === 3 ? 'aspect-[4/3]' : 'aspect-[3/4]';

            return (
              <article
                key={col.id}
                className={`featured-card group flex flex-col ${spanClass}`}
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
                  className={`relative w-full ${aspectClass} overflow-hidden bg-[#EAE4DA] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#30312E]`}
                >
                  <EditorialImage
                    src={col.coverImage}
                    alt={col.altText}
                    fallbackTitle={col.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-[#30312E]/0 group-hover:bg-[#30312E]/10 transition-colors duration-300" />
                </div>

                <div className="pt-4 flex items-start justify-between gap-4 border-b border-[#D2CCC1]/70 pb-5">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#99958D] mb-1">
                      {col.category}
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#30312E]">
                      {col.name}
                    </h3>
                    <p className="text-sm text-[#30312E]/70 mt-1 max-w-md">
                      {col.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedCollection(col)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#30312E] text-[11px] font-mono uppercase tracking-[0.16em] text-[#30312E] hover:bg-[#30312E] hover:text-white transition-colors whitespace-nowrap"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOrbit(col.id)}
                      className="hidden sm:inline-flex px-3 py-2 text-[11px] font-mono uppercase tracking-[0.14em] text-[#99958D] hover:text-[#30312E] transition-colors whitespace-nowrap"
                    >
                      3D View
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
