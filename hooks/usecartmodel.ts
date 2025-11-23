'use client';

import { create } from 'zustand';

interface CartItem {
  productId: string;
  title: string;
  handle: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

interface CartModalStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
}

export const useCartModal = create<CartModalStore>((set) => ({
  isOpen: false,
  cartItems: [],
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  setCartItems: (items: CartItem[]) => set({ cartItems: items }),
}));
