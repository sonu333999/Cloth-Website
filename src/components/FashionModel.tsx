import React from 'react';
import { FashionCollection } from '../types/fashion';
import { CollectionLabel } from './CollectionLabel';
import { EditorialImage } from './EditorialImage';

interface FashionModelProps {
  collection: FashionCollection;
  offset: number; // Circular signed offset from continuousIndex
  radiusX: number;
  radiusZ: number;
  verticalLift: number;
  maxVisibleDelta: number;
  onSelect: () => void;
  onHoverChange: (hovered: boolean) => void;
}

export const FashionModel: React.FC<FashionModelProps> = ({
  collection,
  offset,
  radiusX,
  radiusZ,
  verticalLift,
  maxVisibleDelta,
  onSelect,
  onHoverChange,
}) => {
  const absDelta = Math.abs(offset);
  const isVisible = absDelta <= maxVisibleDelta + 0.35;
  if (!isVisible) return null;

  // Map offset onto a smooth front-facing 3D circular gallery arc
  const angleSpread = Math.PI / 4.2; // ~42 deg step along front semi-circle
  const theta = offset * angleSpread;

  const x = Math.sin(theta) * radiusX;
  const z = (Math.cos(theta) - 1) * radiusZ;
  const y = (1 - Math.cos(theta)) * -verticalLift;
  const rotateY = -theta * (180 / Math.PI) * 0.24;

  // Scale, opacity, and depth blur matching the editorial specification
  // Active: 1.0, Nearby (~1): 0.85, Far (~2): 0.65
  const scale = Math.max(0.58, 1 - absDelta * 0.165);
  const opacity =
    absDelta <= 0.4
      ? 1
      : absDelta <= 1.3
      ? 1 - (absDelta - 0.4) * 0.28
      : Math.max(0, 0.75 - (absDelta - 1.3) * 0.45);
  const blurPx = absDelta < 0.3 ? 0 : Math.min(2.2, (absDelta - 0.3) * 0.85);
  const zIndex = Math.round(100 - absDelta * 18);
  const isActive = absDelta < 0.28;

  return (
    <div
      style={{
        transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(4)})`,
        opacity: Math.max(0, Math.min(1, opacity)),
        filter: blurPx > 0.05 ? `blur(${blurPx.toFixed(2)}px)` : 'none',
        zIndex,
        willChange: 'transform, opacity',
      }}
      onClick={onSelect}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      role="button"
      tabIndex={isActive ? 0 : -1}
      aria-label={`${collection.name} — ${collection.category}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none cursor-none group focus:outline-none"
    >
      <div className="relative w-[220px] sm:w-[255px] lg:w-[295px] xl:w-[320px] aspect-[3/4] transition-transform duration-300 ease-out group-hover:scale-[1.03]">
        {/* Grounded soft ambient studio floor shadow */}
        <div
          aria-hidden="true"
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[62%] h-6 rounded-full bg-[#30312E]/22 blur-xl pointer-events-none transition-opacity duration-300 group-hover:opacity-90"
        />

        <EditorialImage
          src={collection.modelImage}
          alt={collection.altText}
          loading="eager"
          draggable={false}
          fallbackTitle={collection.name}
          className={`w-full h-full object-cover object-top model-studio-mask transition-all duration-300 ${
            isActive
              ? 'brightness-[1.01] contrast-[1.02]'
              : 'brightness-[0.95] group-hover:brightness-[1.03]'
          }`}
        />
      </div>

      <CollectionLabel
        name={collection.name}
        isActive={isActive}
        onClick={onSelect}
      />
    </div>
  );
};
