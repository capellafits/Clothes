'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ProductImageModal({
  isOpen,
  onClose,
  images,
  startIndex = 0,
  alt,
}: {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  startIndex?: number;
  alt: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setActive(startIndex);
    setZoomed(false);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const el = scroller.current;
    if (el) el.scrollLeft = startIndex * el.clientWidth;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (!el || zoomed) return;
      if (e.key === 'ArrowRight') el.scrollLeft += el.clientWidth;
      if (e.key === 'ArrowLeft') el.scrollLeft -= el.clientWidth;
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, startIndex, onClose, zoomed]);

  const handleScroll = () => {
    const el = scroller.current;
    if (!el || el.clientWidth === 0) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setActive(Math.max(0, Math.min(images.length - 1, i)));
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90">
      <button
        onClick={onClose}
        aria-label="Close"
        className="fixed top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
      >
        <X size={16} />
      </button>

      {/* swipe sideways through the set; pinch-zoom, or double-tap, on any image.
          swiping is disabled while zoomed so panning doesn't flip to the next one. */}
      <div
        ref={scroller}
        onScroll={handleScroll}
        className={`flex h-full snap-x snap-mandatory overflow-y-hidden overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          zoomed ? 'overflow-x-hidden' : 'overflow-x-auto'
        }`}
      >
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className={`h-full w-full shrink-0 snap-center ${
              zoomed && i === active
                ? 'overflow-auto'
                : 'flex items-center justify-center p-4'
            }`}
          >
            <Image
              src={src}
              alt={`${alt} — image ${i + 1} of ${images.length}`}
              width={1400}
              height={1867}
              priority={i === startIndex}
              onDoubleClick={() => setZoomed((z) => !z)}
              className={
                zoomed && i === active
                  ? 'max-w-none cursor-zoom-out'
                  : 'h-auto max-h-full w-auto max-w-full cursor-zoom-in object-contain'
              }
              style={
                zoomed && i === active
                  ? { width: '200%', height: 'auto' }
                  : undefined
              }
            />
          </div>
        ))}
      </div>

      {zoomed && (
        <button
          onClick={() => setZoomed(false)}
          className="fixed bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-black"
        >
          Reset zoom
        </button>
      )}

      {!zoomed && images.length > 1 && (
        <div className="pointer-events-none fixed bottom-5 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === active ? 'w-3 bg-white' : 'w-1 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
