'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './Productcard';
import { Product } from '@/lib/shopify';

interface SimilarProductsProps {
  products: Product[];
  country: string;
}

export default function SimilarProducts({ products, country }: SimilarProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"  >
      <h2 className="text-2xl sm:text-3xl font-light text-center mb-8 sm:mb-12" style={{ fontFamily: 'serif' }}>
        You Might Also Like 
      </h2>

      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Products Slider */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-none w-[280px] sm:w-[320px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Mobile scroll indicators */}
      <div className="flex justify-center gap-2 mt-6 md:hidden">
        {products.map((_, index) => (
          <div key={index} className="w-2 h-2 rounded-full bg-gray-300" />
        ))}
      </div>
    </section>
  );
}
