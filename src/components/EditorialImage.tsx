import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fallbackTitle?: string;
  draggable?: boolean;
}

export const EditorialImage: React.FC<EditorialImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fallbackTitle,
  draggable = false,
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#EAE4DA] to-[#D2CCC1]/60 text-[#30312E] p-6 text-center select-none ${className}`}
      >
        <Sparkles className="w-5 h-5 text-[#99958D] mb-2" strokeWidth={1.25} />
        <span className="font-serif text-lg tracking-wide">
          {fallbackTitle || 'MAISON LUMIÈRE'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      draggable={draggable}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
