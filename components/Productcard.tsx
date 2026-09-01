'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product, calculateDiscount, formatPrice, type Country } from '@/lib/shopify';
import { useSearchParams, useRouter } from 'next/navigation';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductCardProps {
  product: Product;
}

interface CartItem {
  productId: string;
  title: string;
  handle: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
  variantId?: string;
}

// 🔥 INTERNAL COMPONENT WITH useSearchParams
function ProductCardContent({ product }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const country = (searchParams.get('country') || 'CA') as Country;
  
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();

  const minPrice = Math.min(...product.variants.map(v => v.cost));
  const maxPrice = Math.max(...product.variants.map(v => v.cost));
  const currency = product.variants[0]?.currency || 'USD';
  
  const discount = calculateDiscount(minPrice, product.compareAtPrice);
  const mainImage = product.images[0] || '/placeholder.jpg';
  const productUrl = `/products/${product.handle}`;
  const isSoldOut = product.variants.length > 0 && product.variants.every(v => !v.available);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAddingToCart(true);

    try {
      const existingCart = localStorage.getItem('cart');
      let cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

      const firstVariant = product.variants[0];

      if (!firstVariant) {
        throw new Error('No variants available');
      }

      const newItem: CartItem = {
        productId: product.id,
        title: product.title,
        handle: product.handle,
        size: firstVariant.size,
        quantity: 1,
        price: firstVariant.cost,
        image: mainImage,
        variantId: firstVariant.id,
      };

      const existingItemIndex = cart.findIndex(
        item => item.productId === product.id && item.size === firstVariant.size
      );

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push(newItem);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));

      setMessage('Added to cart!');
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage('Failed to add to cart');
      setTimeout(() => setMessage(null), 2000);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        title: product.title,
        handle: product.handle,
        image: mainImage,
      });
    }
  };

  // 🔥 NEW: Handle Buy Now
  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(productUrl);
  };

  return (
    <Link href={productUrl}>
      <div className="group cursor-pointer">
        
        {/* Product Image */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
          <Image
            src={mainImage}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Sold Out Badge */}
          {isSoldOut && (
            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 bg-black text-white text-[10px] font-extralight tracking-wider uppercase px-2 py-1">
              Sold Out
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1 hover:scale-110 transition-transform z-10"
          >
            <Heart
              size={16}
              className={`sm:w-[18px] sm:h-[18px] ${
                isWishlisted(product.id)
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600'
              }`}
            />
          </button>

          {/* Discount Badge */}
          {!isSoldOut && discount && discount > 0 && (
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black text-white px-2 py-1 sm:px-3 text-xs font-medium rounded">
              {discount}% OFF
            </div>
          )}

          {/* 🔥 NEW: Hover Overlay with Add to Cart & Buy Now */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 hidden md:flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="bg-white text-black px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <ShoppingBag size={16} />
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>

            <button
              onClick={handleBuyNow}
              className="bg-black text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-800 transition text-sm"
            >
              <Eye size={16} />
              Buy Now
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="px-2 pt-1.5 pb-0.5 sm:px-3 sm:pt-2 text-left">
          <h3 className="text-[11px] sm:text-xs font-extralight uppercase mb-0.5 line-clamp-1 text-black transition">
            {product.title}
          </h3>

          {/* Pricing */}
          <div className="flex items-center gap-2 flex-wrap">
            {product.compareAtPrice && (
              <span className="text-gray-400 line-through text-xs sm:text-sm">
                {formatPrice(product.compareAtPrice, currency)}
              </span>
            )}
            <span className="text-[11px] sm:text-xs font-extralight text-black">
              {minPrice === maxPrice
                ? formatPrice(minPrice, currency)
                : `${formatPrice(minPrice, currency)} - ${formatPrice(maxPrice, currency)}`}
            </span>
          </div>

          {/* Message */}
          {message && (
            <p className={`text-xs mt-2 font-medium ${
              message.includes('Failed') ? 'text-red-500' : 'text-green-500'
            }`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

// 🔥 EXPORT WITH SUSPENSE
export default function ProductCard(props: ProductCardProps) {
  return (
    <Suspense fallback={
      <div className="animate-pulse">
        <div className="w-full bg-gray-200" style={{ aspectRatio: '3/4' }}></div>
        <div className="px-2 pt-2 space-y-2">
          <div className="h-3 bg-gray-200 w-3/4"></div>
          <div className="h-3 bg-gray-200 w-1/2"></div>
        </div>
      </div>
    }>
      <ProductCardContent {...props} />
    </Suspense>
  );
}
