'use client';

import { useState, useMemo } from 'react';
import ProductCard from './Productcard';
import { Product, type Country } from '@/lib/shopify';

interface ProductGridProps {
  products: Product[];
  country: Country;
  selectedCollection?: string;
}

// Merchandising order for All Products; collection pages retain newest-first sorting.
function merchandisingRank(product: Product): number {
  const waffles = ['fear-nothing', 'dream-chasers', 'illuminati-waffle'];
  if (waffles.includes(product.handle) || /waffle/i.test(product.title)) return 5;
  if (product.tags.some(tag => ['tshirt', 'tshirts', 't-shirt', 't-shirts'].includes(tag.toLowerCase()))) return 0;
  const shirts = ['g-o-a-t-shirt-capella-fits', 'starbourne-syndicate-shirt-capella-fits', 'after-7-pm', 'no-apologies'];
  const shirtIndex = shirts.indexOf(product.handle);
  if (shirtIndex !== -1) return shirtIndex + 1;
  if (product.tags.some(tag => /^(hoodie|hoodies)$/i.test(tag)) || /hoodie/i.test(product.title)) return 6;
  if (product.handle === 'capella-fits-cargo-pants-built-for-the-bold') return 7;
  if (product.handle === 'capella-fits-denim-shirt-the-classic-reinvented') return 8;
  if (product.handle === 'flared-jeans-for-men-capella-fits') return 9;
  if (product.handle === 'denim-shirt-jeans-combo-the-classic-reinvented') return 10;
  return 11;
}

function newestFirst(a: Product, b: Product): number {
  return (Date.parse(b.createdAt || '') || 0) - (Date.parse(a.createdAt || '') || 0);
}

export default function ProductGrid({
  products,
  country,
  selectedCollection,
}: ProductGridProps) {
  const [sortBy, setSortBy] = useState<string>('default');


 
  const displayProducts = useMemo(() => {
    let sorted = [...products];

    switch (sortBy) {
      case 'default':
        sorted.sort((a, b) => (!selectedCollection ? merchandisingRank(a) - merchandisingRank(b) : 0) || newestFirst(a, b));
        break;
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
  }, [products, sortBy, selectedCollection]);

  return (
    <section className="max-w-7xl mx-auto pt-0 sm:pt-2 pb-8 sm:pb-12">
      {/* Filter bar: count left, sort right, no pills */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-2 sm:mb-3">
        <p className="text-[11px] font-extralight text-neutral-500">
          {displayProducts.length} {selectedCollection ? 'Products' : 'Products'}
        </p>

        <select
          aria-label="Sort products"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-transparent text-[10px] font-extralight uppercase text-black cursor-pointer focus:outline-none"
        >
          <option value="default">{selectedCollection ? 'Newest' : 'Featured'}</option>
          {!selectedCollection && <option value="newest">Newest</option>}
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-0 gap-y-6 sm:gap-y-10">
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
