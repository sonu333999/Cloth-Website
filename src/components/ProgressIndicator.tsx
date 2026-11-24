import React from 'react';
import { ChevronLeft, ChevronRight, ArrowDown } from 'lucide-react';
import { FashionCollection } from '../types/fashion';

interface ProgressIndicatorProps {
  collections: FashionCollection[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  collections,
  activeIndex,
  onSelectIndex,
  onPrev,
  onNext,
}) => {
  const total = collections.length;
  const formattedCurrent = String(activeIndex + 1).padStart(2, '0');
  const formattedTotal = String(total).padStart(2, '0');
  const progressPct = total > 1 ? ((activeIndex + 1) / total) * 100 : 100;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-6 pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 z-30 relative">
      {/* Left: Counter + Progress Line + Dots */}
      <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto justify-between sm:justify-start">
        <div className="font-mono text-xs tracking-[0.18em] text-[#30312E] tabular-nums whitespace-nowrap shrink-0">
          <span className="font-medium">{formattedCurrent}</span>
          <span className="text-[#99958D] mx-1.5">/</span>
          <span className="text-[#99958D]">{formattedTotal}</span>
        </div>

        <div className="relative w-28 sm:w-40 h-[1.5px] bg-[#D2CCC1] overflow-hidden shrink-0">
          <div
            className="absolute inset-y-0 left-0 bg-[#30312E] transition-all duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Clickable Navigation Dots */}
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Collection slides">
          {collections.map((col, idx) => {
            const active = idx === activeIndex;
            return (
              <button
                key={col.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`View ${col.name}`}
                onClick={() => onSelectIndex(idx)}
                className={`transition-all duration-200 rounded-full focus-visible:outline-2 focus-visible:outline-[#30312E] ${
                  active
                    ? 'w-5 h-1.5 bg-[#30312E]'
                    : 'w-1.5 h-1.5 bg-[#99958D]/55 hover:bg-[#30312E]/75'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Center: Instruction */}
      <p className="hidden lg:block font-mono text-[10px] uppercase tracking-[0.24em] text-[#30312E]/65 whitespace-nowrap">
        Scroll or drag to explore
      </p>

      {/* Right: Prev/Next Arrows & Scroll Down */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="flex items-center border border-[#D2CCC1] bg-[#F4F0E9]/70">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous collection"
            className="w-10 h-9 flex items-center justify-center text-[#30312E] hover:bg-[#30312E] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-[#D2CCC1]" />
          <button
            type="button"
            onClick={onNext}
            aria-label="Next collection"
            className="w-10 h-9 flex items-center justify-center text-[#30312E] hover:bg-[#30312E] hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <a
          href="#featured-collections"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-[11px] font-mono uppercase tracking-[0.16em] text-[#30312E]/75 hover:text-[#30312E] transition-colors whitespace-nowrap"
        >
          <span>Editorial</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
