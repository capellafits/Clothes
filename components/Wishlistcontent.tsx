'use client';
import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ChevronRight } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useSearchParams } from 'next/navigation';


// INTERNAL COMPONENT WITH useSearchParams
function WishlistContentInner() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const searchParams = useSearchParams();
  const country = (searchParams.get('country') || 'IN') as 'IN' | 'CA';
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight size={16} />
        <Link href="/shop" className="hover:text-gray-900">Shop</Link>
        <ChevronRight size={16} />
        <span className="text-gray-900">Favorites</span>
      </div>

      {/* Page Title */}
      <div className="mb-12">
        <h1 className="text-center text-4xl sm:text-5xl font-light text-gray-900 mb-2">
          Favourite
        </h1>
        <p className="text-center text-sm text-gray-600">
          {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist
        </p>
      </div>

      {/* Sort */}
      <div className="flex justify-end mb-8">
        <div className="text-sm text-gray-600">
          <span>Sort by: </span>
          <select className="font-light text-gray-900 bg-transparent border-0 cursor-pointer hover:text-gray-600">
            <option>Relevance</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>
      </div>

      {/* Wishlist Items Grid */}
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {wishlist.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group"
            >
              {/* Product Image */}
              <Link href={`/products/${item.handle}?country=${country}`}>
                <div className="relative w-full overflow-hidden bg-gray-100" style={{ aspectRatio: '3/4' }}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />

                  {/* Remove Button - Top Left */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFromWishlist(item.productId);
                    }}
                    className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white rounded-full p-2 hover:scale-110 transition-transform z-10 shadow-md hover:shadow-lg"
                  >
                    <Heart
                      size={16}
                      className="fill-red-500 text-red-500"
                    />
                  </button>

                  {/* Price Badge - Top Right */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black text-white px-3 py-1 text-xs font-medium rounded">
                    58% OFF
                  </div>
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4 sm:p-6">
                <Link href={`/products/${item.handle}?country=${country}`}>
                  <h3 className="font-light text-base sm:text-lg text-gray-900 line-clamp-2 hover:text-gray-600 transition cursor-pointer mb-3">
                    {item.title}
                  </h3>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-2xl font-light text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-sm text-gray-600 mb-8 text-center max-w-md">
            Start adding items to your wishlist to keep track of your favorite products.
          </p>
          <Link
            href="/shop"
            className="bg-black text-white px-8 py-3 rounded-lg font-light hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
}

// 🔥 EXPORT WITH SUSPENSE (keeps original name)
export default function WishlistContent() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    }>
      <WishlistContentInner />
    </Suspense>
  );
}

