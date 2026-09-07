'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ProductPreviewImage({ images, title, sizes }: {
  images: string[];
  title: string;
  sizes: string;
}) {
  const [loadedPreview, setLoadedPreview] = useState<string | null>(null);
  const [touchPreview, setTouchPreview] = useState(false);
  const firstImage = images[0] || '/placeholder.jpg';
  const secondImage = images[1];

  return (
    <span
      className="group/photo absolute inset-0 block"
      onTouchStart={() => setTouchPreview(true)}
      onTouchEnd={() => setTouchPreview(false)}
      onTouchCancel={() => setTouchPreview(false)}
    >
      <Image src={firstImage} alt={title} fill sizes={sizes} className="object-cover" />
      {secondImage && secondImage !== firstImage && (
        <Image
          key={secondImage}
          src={secondImage}
          alt={`${title} — second view`}
          fill
          sizes={sizes}
          onLoad={() => setLoadedPreview(secondImage)}
          onError={() => setLoadedPreview(null)}
          className={`object-cover pointer-events-none transition-opacity duration-200 motion-reduce:transition-none ${loadedPreview === secondImage && touchPreview ? 'opacity-100' : 'opacity-0'} ${loadedPreview === secondImage ? 'group-hover:opacity-100 group-hover/photo:opacity-100' : ''}`}
        />
      )}
    </span>
  );
}
