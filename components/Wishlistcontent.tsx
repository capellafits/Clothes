'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import ProductCard from './Productcard';
import type { Product } from '@/lib/shopify';
import ProductQuickAdd from './ProductQuickAdd';

export default function WishlistContent({ products }: { products: Product[] }) {
  const { wishlist } = useWishlist();
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState('saved');

  useEffect(() => { setIsLoading(false); }, []);

  const savedProducts = wishlist.flatMap(item => {
    const product = products.find(product => product.id === item.productId);
    return product ? [product] : [];
  });
  const sortedProducts = [...savedProducts];
  if (sort === 'price-low' || sort === 'price-high') {
    const direction = sort === 'price-low' ? 1 : -1;
    sortedProducts.sort((a, b) => direction * (
      Math.min(...a.variants.map(variant => variant.cost)) -
      Math.min(...b.variants.map(variant => variant.cost))
    ));
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
          <Link href="/">Home</Link><ChevronRight size={14} />
          <span className="text-gray-900">Favourites</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold uppercase mb-4">Favourites</h1>
        {!isLoading && sortedProducts.length > 0 && (
          <div className="flex items-center justify-between mb-3 text-xs text-gray-600">
            <span>{sortedProducts.length} Products</span>
            <select aria-label="Sort favourites" value={sort} onChange={event => setSort(event.target.value)} className="bg-transparent py-2 uppercase">
              <option value="saved">Saved order</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        )}
      </div>
      {isLoading ? (
        <p className="text-center py-12">Loading your wishlist...</p>
      ) : sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-0 gap-y-6 sm:gap-y-10">
          {sortedProducts.map(product => (
            <div key={product.id}>
              <ProductCard product={product} hideQuickAdd />
              <ProductQuickAdd product={product} expanded removeAfterAdd />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center px-4 py-12">
          <h2 className="text-xl mb-2">Your wishlist is empty</h2>
          <p className="text-sm text-gray-600 mb-6">Tap a product’s heart to save it here.</p>
          <Link href="/shop" className="inline-block bg-black text-white px-5 py-2.5 rounded-sm text-[11px] font-medium uppercase tracking-wider">Continue Shopping</Link>
        </div>
      )}
    </div>
  );
}
