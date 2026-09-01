'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product, formatPrice, type Country } from '@/lib/shopify';
import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: '900', 
});

interface FeaturedProductsProps {
  products: Product[];
  country: Country;
}

export default function FeaturedProducts({ products, country }: FeaturedProductsProps) {
  const [displayProducts, setDisplayProducts] = useState(products);

  useEffect(() => {
    setDisplayProducts(products);
  }, [products, country]);

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full pt-6 sm:pt-10 pb-6 sm:pb-10" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Heading */}
        <div className="text-center px-4 sm:px-6 lg:px-8 mb-3 sm:mb-5">
          {/* UPDATED: 
              1. Reduced sizes: text-4xl (mobile) -> sm:text-6xl -> lg:text-8xl 
              2. Added 'whitespace-nowrap' to keep it on one line
          */}
          <h2 
            className={`${inter.className} text-4xl sm:text-6xl lg:text-8xl text-gray-900 mb-1.5 tracking-tighter leading-none uppercase whitespace-nowrap`}
          >
           Finest Picks
          </h2>
          
          <p className="text-xs sm:text-base text-gray-600 font-light max-w-2xl mx-auto tracking-wide">
            A selection of Capella&apos;s finest — premium fabrics, statement graphics, zero compromises.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-0 gap-y-6 sm:gap-y-10">
          {displayProducts.map((product) => {
            const minPrice = Math.min(...product.variants.map(v => v.cost));
            const currency = product.variants[0]?.currency || 'USD';
            const mainImage = product.images[0] || '/placeholder.jpg';

            return (
              <Link
                key={`${country}-${product.id}`}
                href={`/products/${product.handle}`}
              >
                <div className="group cursor-pointer">
                  
                  {/* Product Image */}
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
                    <Image
                      src={mainImage}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="px-2 pt-1.5 pb-0.5 sm:px-3 sm:pt-2 text-left">
                    <h3 className="text-[11px] sm:text-xs font-bold uppercase mb-0.5 line-clamp-1 text-black transition">
                      {product.title}
                    </h3>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] sm:text-xs font-extralight text-black">
                        {formatPrice(minPrice, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center px-4 mt-6 sm:mt-10">
          <Link
            href={`/shop`}
            className="inline-block px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 active:scale-95 transition-all font-medium text-xs sm:text-sm uppercase tracking-widest"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
