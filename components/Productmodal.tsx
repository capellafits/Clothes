'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

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

  useEffect(() => {
    if (!isOpen) return;

    // open on the image that was tapped, and stop the page behind from scrolling
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    scroller.current
      ?.querySelector<HTMLElement>(`[data-idx="${startIndex}"]`)
      ?.scrollIntoView({ block: 'start' });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, startIndex, onClose]);

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

      {/* every image in the set, one per screen, scroll or swipe through them */}
      <div
        ref={scroller}
        onClick={onClose}
        className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain"
      >
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            data-idx={i}
            className="flex h-full snap-start items-center justify-center p-4"
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
    </div>
  );
}
