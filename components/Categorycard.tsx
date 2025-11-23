'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  image: string;
  handle: string;
  country: 'IN' | 'CA';
}

export default function CategoryCard({
  name,
  image,
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
    <Link href={url} className="group block h-full">
      <div className="relative h-full w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-gray-900 aspect-3/4 sm:aspect-3/4">
        
        {/* Image with Zoom Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={false}
          />
        </div>

        {/* Gradient Overlay - Stronger at bottom for text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 sm:opacity-60 sm:group-hover:opacity-90 transition-all duration-500" />

        {/* Content Container */}
        {/* UPDATED: p-4 for mobile (closer to bottom edge), p-8 for desktop */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8">
          
          {/* Category Name */}
          <h3 
            className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-3 transform sm:group-hover:-translate-y-2 transition-transform duration-300 leading-tight" 
            style={{ fontFamily: 'League Spartan, sans-serif' }}
          >
            {name}
          </h3>

          {/* Shop Now Button */}
          {/* UPDATED: 
              - Mobile: opacity-100 (Always visible) 
              - Desktop: opacity-0 group-hover:opacity-100 (Hidden until hover)
          */}
          <div className="flex items-center gap-2 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transform sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300">
            <span className="text-[10px] sm:text-sm font-medium tracking-wide uppercase">Shop Now</span>
            <ArrowRight size={14} className="sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </div>

          {/* Decorative Line (Desktop Only) */}
          <div className="hidden sm:block w-0 h-0.5 bg-white group-hover:w-20 transition-all duration-500 mt-3" />
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-xl sm:rounded-2xl transition-all duration-300" />
      </div>
    </Link>
  );
}