'use client';

import { useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  title: string;
  handle: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const cart = localStorage.getItem('cart');
        setCartItems(cart ? JSON.parse(cart) : []);
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
      }
    };

    loadCart();

    // Listen for storage changes (when cart is updated from other tabs/windows)
    const handleStorageChange = () => {
      loadCart();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for same-tab updates
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
    };
  }, []);

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    totalItems: getTotalItems(),
  };
}
