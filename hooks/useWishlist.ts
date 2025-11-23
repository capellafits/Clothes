import { useEffect, useState } from 'react';

interface WishlistItem {
  productId: string;
  title: string;
  handle: string;
  image: string;
}


export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  //  LOAD FROM LOCALSTORAGE ON MOUNT
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const saved = localStorage.getItem('wishlist');
        const items = saved ? JSON.parse(saved) : [];
        setWishlist(items);
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    };

    loadWishlist();

     const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, []);

  // 🔥 ADD TO WISHLIST
  const addToWishlist = (item: WishlistItem) => {
    setWishlist(prev => {
      const exists = prev.find(w => w.productId === item.productId);
      if (exists) return prev;

      const updated = [...prev, item];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      window.dispatchEvent(new Event('wishlistUpdated'));
      return updated;
    });
  };

  // 🔥 REMOVE FROM WISHLIST
  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => {
      const updated = prev.filter(w => w.productId !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      window.dispatchEvent(new Event('wishlistUpdated'));
      return updated;
    });
  };

  // 🔥 CHECK IF PRODUCT IS WISHLISTED
  const isWishlisted = (productId: string) => {
    return wishlist.some(w => w.productId === productId);
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
    totalWishlistItems: wishlist.length,
  };
}
