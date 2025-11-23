'use client';
import Image from 'next/image';

export default function ProductImageModal({
  isOpen,
  onClose,
  imageUrl,
  alt,
}: {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
}) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center" onClick={onClose}>
        <div
          className="relative max-w-3xl w-full max-h-[90vh] bg-transparent flex flex-col items-center"
          onClick={e => e.stopPropagation()}
        >
          <Image
            src={imageUrl}
            alt={alt}
            width={900}
            height={1200}
            className="rounded-lg w-auto h-auto max-h-[80vh] max-w-full object-contain cursor-zoom-in"
            style={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,.4)" }}
            onClick={onClose}
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl bg-black/60 rounded-full p-1"
            onClick={onClose}
            title="Close"
          >
            X
          </button>
        </div>
      </div>
    </>
  );
}
