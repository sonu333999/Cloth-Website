import React from 'react';

interface CollectionLabelProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
}

export const CollectionLabel: React.FC<CollectionLabelProps> = ({
  name,
  isActive,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`mt-2 px-3.5 py-1 rounded-sm transition-all duration-300 whitespace-nowrap shadow-[0_6px_20px_rgba(48,49,46,0.08)] font-serif text-sm sm:text-[15px] tracking-wide ${
        isActive
          ? 'bg-[#F4F0E9] text-[#30312E] border border-[#30312E]/35 scale-105'
          : 'bg-[#F4F0E9]/88 text-[#30312E]/85 border border-[#D2CCC1] hover:bg-[#F4F0E9] hover:text-[#30312E]'
      }`}
    >
      {name}
    </button>
  );
};
