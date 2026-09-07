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

  useEffect(() => {
    if (!isOpen) return;

    setActive(startIndex);

    // open on the tapped image, and stop the page behind from scrolling
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const el = scroller.current;
    if (el) el.scrollLeft = startIndex * el.clientWidth;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && el) el.scrollLeft += el.clientWidth;
      if (e.key === 'ArrowLeft' && el) el.scrollLeft -= el.clientWidth;
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, startIndex, onClose]);

  // keep the dots in step with whichever image is on screen
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
        className="fixed top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
      >
        <X size={16} />
      </button>

      {/* swipe sideways through the set, one image per screen */}
      <div
        ref={scroller}
        onScroll={handleScroll}
        onClick={onClose}
        className="flex h-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="flex h-full w-full shrink-0 snap-center items-center justify-center p-4"
          >
            <Image
              src={src}
              alt={`${alt} — image ${i + 1} of ${images.length}`}
              width={900}
              height={1200}
              priority={i === startIndex}
              onClick={(e) => e.stopPropagation()}
              className="h-auto max-h-full w-auto max-w-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* which image you're on */}
      {images.length > 1 && (
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
