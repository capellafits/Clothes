'use client';

import ProductPreviewImage from './ProductPreviewImage';
import ProductQuickAdd from './ProductQuickAdd';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Product, calculateDiscount, formatPrice } from '@/lib/shopify';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductCardProps {
  product: Product;
  hideQuickAdd?: boolean;
}

export default function ProductCard({ product, hideQuickAdd = false }: ProductCardProps) {
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();

  const minPrice = Math.min(...product.variants.map(v => v.cost));
  const maxPrice = Math.max(...product.variants.map(v => v.cost));
  const currency = product.variants[0]?.currency || 'USD';
  
  const discount = calculateDiscount(minPrice, product.compareAtPrice);
  const mainImage = product.images[0] || '/placeholder.jpg';
  const productUrl = `/products/${product.handle}`;
  const isSoldOut = !product.variants.some(v => v.available);

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

  return (
    <div>
      <div className="group cursor-pointer">
        
        {/* Product Image */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
          <Link href={productUrl} aria-label={product.title} className="absolute inset-0">
          <ProductPreviewImage
            images={product.images}
            title={product.title}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          </Link>

          {/* Sold Out Badge */}
          {isSoldOut && (
            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 bg-black text-white text-[10px] font-extralight tracking-wider uppercase px-2 py-1">
              Sold Out
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            aria-label={`${isWishlisted(product.id) ? "Remove" : "Save"} ${product.title} ${isWishlisted(product.id) ? "from" : "to"} favourites`}
            aria-pressed={isWishlisted(product.id)}
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

        </div>

        {/* Product Info */}
        <Link href={productUrl}>
        <div className="px-2 pt-1.5 pb-0.5 sm:px-3 sm:pt-2 text-left pr-11 sm:pr-12">
          <h3 className="text-[11px] sm:text-xs font-bold uppercase mb-0.5 line-clamp-1 text-black transition">
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

        </div>
        </Link>
      </div>
    {!hideQuickAdd && <ProductQuickAdd product={product} />}
    </div>
  );
}
