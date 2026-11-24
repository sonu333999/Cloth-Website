import React from 'react';
import { useLookbook } from '../context/LookbookContext';
import { CircularCarousel } from './CircularCarousel';
import { CollectionInfo } from './CollectionInfo';
import { ProgressIndicator } from './ProgressIndicator';

export const Hero: React.FC = () => {
  const {
    collections,
    activeCarouselIndex,
    setActiveCarouselIndex,
    setSelectedCollection,
  } = useLookbook();

  const safeIndex =
    collections.length > 0 ? activeCarouselIndex % collections.length : 0;
  const activeCollection = collections[safeIndex];

  const handlePrev = () => {
    setActiveCarouselIndex(
      (safeIndex - 1 + collections.length) % collections.length
    );
  };

  const handleNext = () => {
    setActiveCarouselIndex((safeIndex + 1) % collections.length);
  };

  if (!activeCollection) return null;

  return (
    <section
      id="lookbook-hero"
      aria-label="Interactive 3D Fashion Lookbook"
      className="relative min-h-screen w-full bg-[#EAE4DA] pt-20 sm:pt-24 flex flex-col justify-between overflow-hidden"
    >
      {/* Subtle paper-grain canvas texture */}
      <div
        aria-hidden="true"
        className="paper-grain fixed inset-0 pointer-events-none z-0 opacity-65"
      />

      {/* Top Editorial Season Line */}
      <div className="relative z-20 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between pt-2">
        <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#30312E]/65">
          Digital Lookbook — Edition 2026
        </p>
        <p className="hidden sm:block font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#30312E]/65">
          Paris · Milan · New Delhi
        </p>
      </div>

      {/* Main 3D Circular Stage + Floating Active Collection Card */}
      <div className="relative flex-1 flex flex-col justify-center items-center w-full max-w-[1600px] mx-auto px-4 sm:px-8">
        <CircularCarousel
          collections={collections}
          activeIndex={safeIndex}
          onActiveIndexChange={setActiveCarouselIndex}
          onOpenCollection={(col) => setSelectedCollection(col)}
        />

        {/* Desktop floating card positioned cleanly to the right without covering the center model */}
        <div className="hidden lg:block lg:absolute lg:right-10 xl:right-16 lg:bottom-12 z-40">
          <CollectionInfo
            collection={activeCollection}
            onShopLook={() => setSelectedCollection(activeCollection)}
            onExploreStory={() => {
              const el = document.getElementById('collection-stories');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        {/* Tablet & Mobile compact card docked cleanly beneath stage */}
        <div className="lg:hidden w-full flex justify-center mt-2 mb-4 px-2">
          <CollectionInfo
            collection={activeCollection}
            onShopLook={() => setSelectedCollection(activeCollection)}
            onExploreStory={() => {
              const el = document.getElementById('collection-stories');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <ProgressIndicator
        collections={collections}
        activeIndex={safeIndex}
        onSelectIndex={setActiveCarouselIndex}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </section>
  );
};
