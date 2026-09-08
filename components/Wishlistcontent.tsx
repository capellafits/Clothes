'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import ProductCard from './Productcard';
import type { Product } from '@/lib/shopify';
import { useCartModal } from '@/hooks/usecartmodel';

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
              <ProductCard product={product} />
              <WishlistPurchase product={product} />
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


function WishlistPurchase({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState('');
  const [error, setError] = useState('');
  const openCart = useCartModal(state => state.openModal);
  const soldOut = !product.variants.some(variant => variant.available);
  const selectedVariant = product.variants.find(variant => variant.id === variantId && variant.available);

  function addToCart() {
    if (!selectedVariant) return;
    try {
      const item = {
        productId: product.id, title: product.title, handle: product.handle,
        size: selectedVariant.size, quantity: 1, price: selectedVariant.cost,
        image: product.images[0] || '/placeholder.jpg', variantId: selectedVariant.id,
      };
      const cart: (typeof item)[] = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find(entry => entry.variantId === item.variantId ||
        (entry.productId === item.productId && entry.size === item.size));
      if (existing) existing.quantity += 1;
      else cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      setError('');
      openCart();
    } catch {
      setError('Could not add to cart. Please try again.');
    }
  }

  return (
    <div className="px-2 sm:px-3 mt-2 space-y-2">
      <select
        aria-label={`Choose size for ${product.title}`}
        value={variantId}
        onChange={event => setVariantId(event.target.value)}
        disabled={soldOut}
        className="w-full min-h-9 px-2 border border-gray-300 rounded-sm bg-white text-xs disabled:text-gray-400"
      >
        <option value="">{soldOut ? 'Sold Out' : 'Choose size'}</option>
        {product.variants.map(variant => (
          <option key={variant.id} value={variant.id} disabled={!variant.available}>
            {variant.size}{!variant.available ? ' — Sold Out' : ''}
          </option>
        ))}
      </select>
      <button
        onClick={addToCart}
        disabled={!selectedVariant}
        className="w-full min-h-9 px-2 py-2 bg-black text-white text-xs font-medium rounded-sm hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        {soldOut ? 'Sold Out' : 'Add to Cart'}
      </button>
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
