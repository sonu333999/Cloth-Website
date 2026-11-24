import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { FashionCollection } from '../types/fashion';

interface CollectionInfoProps {
  collection: FashionCollection;
  onShopLook: () => void;
  onExploreStory: () => void;
}

export const CollectionInfo: React.FC<CollectionInfoProps> = ({
  collection,
  onShopLook,
  onExploreStory,
}) => {
  return (
    <div className="pointer-events-auto z-40 w-full max-w-[330px] sm:max-w-[340px]">
      <AnimatePresence mode="wait">
        <motion.aside
          key={collection.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Active fashion collection"
          className="bg-[#30312E] text-white p-6 sm:p-7 shadow-[0_24px_60px_rgba(48,49,46,0.22)] border border-[#414642]"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#80A997] mb-2.5">
            {collection.category}
          </p>
          <h2 className="font-serif text-3xl sm:text-[34px] leading-[1.08] font-normal tracking-tight text-white mb-3">
            {collection.name}
          </h2>
          <p className="text-[14px] leading-relaxed text-[#F4F0E9]/80 mb-6">
            {collection.description}
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onShopLook}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#EAE4DA] text-[#30312E] text-[11px] font-mono uppercase tracking-[0.18em] font-medium hover:bg-[#80A997] hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              <span>Shop the Look</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onExploreStory}
              className="px-3 py-2.5 text-[11px] font-mono uppercase tracking-[0.16em] text-[#F4F0E9]/75 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              View Story
            </button>
          </div>
        </motion.aside>
      </AnimatePresence>
    </div>
  );
};
