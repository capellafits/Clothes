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
    <section className="max-w-7xl mx-auto pt-0 sm:pt-2 pb-8 sm:pb-12">
      {/* Filter bar: count left, sort right, no pills */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-3 sm:mb-4">
        <p className="text-xs font-extralight text-neutral-500">
          {displayProducts.length} {selectedCollection ? 'Products' : 'Products'}
        </p>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-transparent text-sm font-extralight uppercase text-black cursor-pointer focus:outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name-az">Name: A-Z</option>
          <option value="name-za">Name: Z-A</option>
        </select>
      </div>

      {/* Main Content */}

      <div className="w-full">
        {displayProducts.length === 0 ? (
          <div className="text-center py-20 mx-4 sm:mx-6 lg:mx-8 border border-gray-200">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-0 gap-y-8 sm:gap-y-12">
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
