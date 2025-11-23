'use client';

import { useState, useMemo } from 'react';
import ProductCard from './Productcard';
import { Product, type Country } from '@/lib/shopify';

interface ProductGridProps {
  products: Product[];
  country: Country;
  selectedCollection?: string;
}

export default function ProductGrid({
  products,
  country,
  selectedCollection,
}: ProductGridProps) {
  const [sortBy, setSortBy] = useState<string>('newest');


 
  const displayProducts = useMemo(() => {
    let sorted = [...products];

    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) =>
          Math.min(...a.variants.map(v => v.cost)) - Math.min(...b.variants.map(v => v.cost))
        );
        break;
      case 'price-high':
        sorted.sort((a, b) =>
          Math.min(...b.variants.map(v => v.cost)) - Math.min(...a.variants.map(v => v.cost))
        );
        break;
      case 'name-az':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-za':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default: // newest
        sorted.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
        });
    }

    return sorted;
  }, [products, sortBy]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 sm:pt-2 pb-8 sm:pb-12">
      {/* Header Section */}
     <div className="mb-8 sm:mb-12">
  {/* Title Section */}
  <div className="flex flex-row items-center justify-between gap-4 mb-8">
    
    {/* 1. Total Products Text 
      Mobile: Order 2 (Right Side)
      Desktop: Order 1 (Left Side)
    */}
    <div className="order-2 sm:order-1">
      <p className="text-xs sm:text-base text-gray-600 font-light whitespace-nowrap">
        {displayProducts.length}
        <span className="mx-1">
          {selectedCollection ? 'products' : 'products'}
        </span>
      </p>
    </div>

    {/* 2. Sort Dropdown 
      Mobile: Order 1 (Left Side)
      Desktop: Order 2 (Right Side)
    */}
    <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2">
      <label className="text-xs sm:text-sm font-light text-gray-700 whitespace-nowrap hidden xs:block">
        Sort by:
      </label>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-full text-xs sm:text-sm bg-white font-light cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 transition"
      >
        <option value="newest">Newest</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="name-az">Name: A-Z</option>
        <option value="name-za">Name: Z-A</option>
      </select>
    </div>
    
  </div>
</div>

      {/* Main Content */}

      <div className="w-full">
        {displayProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <div className="mb-6">
              <p className="text-gray-500 text-lg font-light mb-2">
                No products found
              </p>
              <p className="text-gray-400 text-sm">
                Try adjusting your filters
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayProducts.map(product => (
              <ProductCard
                key={`${country}-${product.id}-${product.store}`}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
