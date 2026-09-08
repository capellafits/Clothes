'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Product } from '@/lib/shopify';
import { useCartModal } from '@/hooks/usecartmodel';

export default function ProductQuickAdd({ product, expanded = false, removeAfterAdd = false }: { product: Product; expanded?: boolean; removeAfterAdd?: boolean }) {
  const [isOpen, setIsOpen] = useState(expanded);
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
      if (removeAfterAdd) {
        const saved: { productId: string }[] = JSON.parse(localStorage.getItem('wishlist') || '[]');
        localStorage.setItem('wishlist', JSON.stringify(saved.filter(entry => entry.productId !== product.id)));
        window.dispatchEvent(new Event('wishlistUpdated'));
      }
      setError('');
      if (!expanded) setIsOpen(false);
      openCart();
    } catch {
      setError('Could not add to cart. Please try again.');
    }
  }

  return (
    <div className="relative px-2 sm:px-3">
      {!expanded && <button
        type="button"
        aria-label={`Quick add ${product.title}`}
        aria-expanded={isOpen}
        disabled={soldOut}
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-1 sm:right-2 -top-10 w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-black hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
      ><Plus size={16} className={isOpen ? 'rotate-45' : ''} /></button>}
      {isOpen && <div className="mt-2 space-y-2">
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
      </div>}
    </div>
  );
}
