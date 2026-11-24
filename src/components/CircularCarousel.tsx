import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FashionCollection } from '../types/fashion';
import { FashionModel } from './FashionModel';

interface CircularCarouselProps {
  collections: FashionCollection[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onOpenCollection: (collection: FashionCollection) => void;
}

function normalizeModular(val: number, len: number): number {
  return ((val % len) + len) % len;
}

function shortestDelta(target: number, current: number, len: number): number {
  let diff = normalizeModular(target, len) - normalizeModular(current, len);
  if (diff > len / 2) diff -= len;
  if (diff < -len / 2) diff += len;
  return diff;
}

export const CircularCarousel: React.FC<CircularCarouselProps> = ({
  collections,
  activeIndex,
  onActiveIndexChange,
  onOpenCollection,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const count = collections.length;

  // Continuous floating index for smooth 60fps 3D circular interpolation
  const [continuousIndex, setContinuousIndex] = useState<number>(activeIndex);
  const targetFloatRef = useRef<number>(activeIndex);
  const currentFloatRef = useRef<number>(activeIndex);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartFloatRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const lastDragDeltaRef = useRef(0);

  // Viewport-responsive 3D radii
  const [stageDims, setStageDims] = useState({
    radiusX: 520,
    radiusZ: 380,
    verticalLift: 34,
    maxVisibleDelta: 2.4,
  });

  // Custom VIEW cursor state
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [isModelHovered, setIsModelHovered] = useState(false);

  useEffect(() => {
    const updateDims = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setStageDims({ radiusX: 225, radiusZ: 180, verticalLift: 16, maxVisibleDelta: 1.5 });
      } else if (w < 1024) {
        setStageDims({ radiusX: 350, radiusZ: 280, verticalLift: 24, maxVisibleDelta: 2.0 });
      } else if (w < 1440) {
        setStageDims({ radiusX: 470, radiusZ: 360, verticalLift: 30, maxVisibleDelta: 2.4 });
      } else {
        setStageDims({ radiusX: 560, radiusZ: 420, verticalLift: 36, maxVisibleDelta: 2.6 });
      }
    };
    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  // Sync external activeIndex changes (arrows, dots) via shortest circular arc
  useEffect(() => {
    if (isDraggingRef.current || count === 0) return;
    const currentWrapped = normalizeModular(Math.round(targetFloatRef.current), count);
    if (currentWrapped !== activeIndex) {
      const delta = shortestDelta(activeIndex, targetFloatRef.current, count);
      targetFloatRef.current = targetFloatRef.current + delta;
    }
  }, [activeIndex, count]);

  // Preload adjacent model images
  useEffect(() => {
    if (count === 0) return;
    [-2, -1, 0, 1, 2].forEach((offset) => {
      const idx = normalizeModular(activeIndex + offset, count);
      const img = new Image();
      img.src = collections[idx].modelImage;
    });
  }, [activeIndex, collections, count]);

  // Animation loop
  useEffect(() => {
    let rafId = 0;
    const tick = () => {
      const diff = targetFloatRef.current - currentFloatRef.current;
      if (Math.abs(diff) > 0.0008) {
        currentFloatRef.current += diff * (isDraggingRef.current ? 0.35 : 0.12);
        setContinuousIndex(currentFloatRef.current);
      } else if (currentFloatRef.current !== targetFloatRef.current) {
        currentFloatRef.current = targetFloatRef.current;
        setContinuousIndex(currentFloatRef.current);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Keyboard Left / Right navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = normalizeModular(activeIndex + 1, count);
        onActiveIndexChange(next);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = normalizeModular(activeIndex - 1, count);
        onActiveIndexChange(prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, count, onActiveIndexChange]);

  const snapToNearest = useCallback(
    (projectedFloat: number) => {
      const snapped = Math.round(projectedFloat);
      targetFloatRef.current = snapped;
      onActiveIndexChange(normalizeModular(snapped, count));
    },
    [count, onActiveIndexChange]
  );

  // Pointer Drag / Touch Swipe
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartFloatRef.current = targetFloatRef.current;
    lastDragDeltaRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') {
      setCursorPos({ x: e.clientX, y: e.clientY });
    }
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    if (Math.abs(dx) > 6) {
      hasDraggedRef.current = true;
    }
    const sensitivity = window.innerWidth < 640 ? 180 : 280;
    const nextFloat = dragStartFloatRef.current - dx / sensitivity;
    lastDragDeltaRef.current = nextFloat - targetFloatRef.current;
    targetFloatRef.current = nextFloat;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const inertia = lastDragDeltaRef.current * 2.2;
    snapToNearest(targetFloatRef.current + inertia);
  };

  // Mouse wheel orbit when interacting with the stage
  const wheelSnapTimer = useRef<number | null>(null);
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Allow normal vertical page scrolling unless horizontal trackpad gesture OR Shift+Wheel OR cursor is directly hovering a model
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (!isHorizontal && !e.shiftKey && !isModelHovered) {
      return;
    }
    e.preventDefault();
    const rawDelta = isHorizontal ? e.deltaX : e.deltaY;
    targetFloatRef.current += rawDelta / 380;

    if (wheelSnapTimer.current) {
      window.clearTimeout(wheelSnapTimer.current);
    }
    wheelSnapTimer.current = window.setTimeout(() => {
      snapToNearest(targetFloatRef.current);
    }, 140);
  };

  const handleModelSelect = (index: number) => {
    if (hasDraggedRef.current) return;
    if (index === activeIndex) {
      onOpenCollection(collections[index]);
      return;
    }
    onActiveIndexChange(index);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={() => {
        handlePointerUp();
        setIsModelHovered(false);
        setCursorPos(null);
      }}
      onWheel={handleWheel}
      style={{ perspective: '1400px', touchAction: 'pan-y' }}
      className="relative w-full h-[470px] sm:h-[540px] lg:h-[600px] xl:h-[640px] flex items-center justify-center overflow-visible select-none"
    >
      {/* Subtle curved gallery floor arc */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 w-[82%] max-w-[960px] h-20 rounded-[100%] border-b border-[#30312E]/12"
      />

      {/* 3D Perspective Stage */}
      <div
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {collections.map((col, index) => {
          const offset = shortestDelta(index, continuousIndex, count);
          return (
            <FashionModel
              key={col.id}
              collection={col}
              offset={offset}
              radiusX={stageDims.radiusX}
              radiusZ={stageDims.radiusZ}
              verticalLift={stageDims.verticalLift}
              maxVisibleDelta={stageDims.maxVisibleDelta}
              onSelect={() => handleModelSelect(index)}
              onHoverChange={setIsModelHovered}
            />
          );
        })}
      </div>

      {/* Custom Floating VIEW Cursor (Desktop pointer only) */}
      {isModelHovered && cursorPos && (
        <div
          aria-hidden="true"
          style={{
            transform: `translate3d(${cursorPos.x + 14}px, ${cursorPos.y - 14}px, 0)`,
          }}
          className="hidden lg:flex fixed top-0 left-0 z-[90] pointer-events-none px-3 py-1 bg-[#30312E] text-white font-mono text-[10px] uppercase tracking-[0.22em] shadow-lg"
        >
          VIEW
        </div>
      )}
    </div>
  );
};
