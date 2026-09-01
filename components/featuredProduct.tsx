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
    <section className="w-full pt-5 sm:pt-15 pb-3 sm:pb-8" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-6 sm:mb-10">
          {/* UPDATED: 
              1. Reduced sizes: text-4xl (mobile) -> sm:text-6xl -> lg:text-8xl 
              2. Added 'whitespace-nowrap' to keep it on one line
          */}
          <h2 
            className={`${inter.className} text-4xl sm:text-6xl lg:text-8xl text-gray-900 mb-4 tracking-tighter leading-none uppercase whitespace-nowrap`}
          >
           Finest Picks
          </h2>
          
          <p className="text-xs sm:text-base text-gray-600 font-light max-w-2xl mx-auto tracking-wide">
            A selection of Capella&apos;s finest — premium fabrics, statement graphics, zero compromises.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
          {displayProducts.map((product) => {
            const minPrice = Math.min(...product.variants.map(v => v.cost));
            const currency = product.variants[0]?.currency || 'USD';
            const mainImage = product.images[0] || '/placeholder.jpg';

            return (
              <Link
                key={`${country}-${product.id}`}
                href={`/products/${product.handle}`}
              >
                <div className="group rounded-lg sm:rounded-xl overflow-hidden bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 h-full flex flex-col cursor-pointer">
                  
                  {/* Product Image */}
                  <div className="relative w-full overflow-hidden bg-gray-50" style={{ aspectRatio: '3/4' }}>
                    <Image
                      src={mainImage}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-3 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-gray-600 transition leading-tight">
                        {product.title}
                      </h3>
                    </div>

                    {/* Price */}
                    <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div>
                        <p className="text-sm sm:text-lg font-semibold text-gray-900">
                          {formatPrice(minPrice, currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 sm:mt-20">
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
