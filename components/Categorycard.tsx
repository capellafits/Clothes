'use client';

import Link from 'next/link';

interface CategoryCardProps {
  name: string;
  image: string;
  handle: string;
  country: 'CA';
  active?: boolean;
}

export default function CategoryCard({
  name,
  handle,
  active = false,
}: CategoryCardProps) {
  const urlMap: { [key: string]: string } = {
    tshirts: '/tshirts',
    shirts: '/shirts',
    pants: '/pants',
    hoodies: '/hoddies',
  };

  const url = urlMap[handle] || '/shop';

  // Plain scrolling text nav rather than a pill: the active item is black with
  // an underline, the rest are grey.
  return (
    <Link
      href={url}
      className={`shrink-0 whitespace-nowrap pb-1 text-[11px] sm:text-xs font-bold uppercase transition-colors ${
        active
          ? 'border-b border-black text-black'
          : 'border-b border-transparent text-neutral-500 hover:text-black'
      }`}
    >
      {name}
    </Link>
  );
}
