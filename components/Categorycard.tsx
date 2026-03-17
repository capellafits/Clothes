'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  image: string;
  handle: string;
  country: 'IN' | 'CA';
}

export default function CategoryCard({
  name,
  handle,
  country,
}: CategoryCardProps) {
  const urlMap: { [key: string]: string } = {
    tshirts: '/tshirts',
    shirts: '/shirts',
    pants: '/pants',
    hoodies: '/hoddies',
  };

  const baseUrl = urlMap[handle] || '/shop';
  const url = `${baseUrl}?country=${country}`;

  return (
    <Link href={url} className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-neutral-900 dark:hover:border-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-200 hover:-translate-y-px">
      <span
        className="text-sm font-medium tracking-widest uppercase text-neutral-900 dark:text-white"
        style={{ fontFamily: 'League Spartan, sans-serif', letterSpacing: '0.08em' }}
      >
        {name}
      </span>
      <ArrowRight
        size={13}
        className="text-neutral-400 dark:text-neutral-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-neutral-900 dark:group-hover:text-white transition-all duration-200"
      />
    </Link>
  );
}
