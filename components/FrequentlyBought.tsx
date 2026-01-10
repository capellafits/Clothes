'use client';

import Image from 'next/image';
import { X, Plus, Minus } from 'lucide-react';
import { Product, formatPrice } from '@/lib/shopify';
import { useState, useEffect } from 'react';

interface FrequentlyBoughtModalProps {
  isOpen: boolean;
  onClose: () => void;
  mainProduct: Product;
  relatedProducts: Product[];
  country: 'IN' | 'CA';
}

export default function FrequentlyBoughtModal({
  isOpen,
  onClose,
  mainProduct,
  relatedProducts,
  country
}: FrequentlyBoughtModalProps) {
  // Only track selected related products - main product is already in cart
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // 🔥 DEBUG: Log when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('🎯 Modal opened!');
      console.log('Main product:', mainProduct.title);
      console.log('Related products count:', relatedProducts.length);
      console.log('Related products:', relatedProducts);
    }
  }, [isOpen, mainProduct, relatedProducts]);

  const handleToggleProduct = (productId: string) => {
    setSelectedItems(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    if (!quantities[productId]) {
      setQuantities(prev => ({ ...prev, [productId]: 1 }));
    }
  };

  const handleQuantityChange = (productId: string, newQty: number) => {
    if (newQty < 1) return;
    setQuantities(prev => ({ ...prev, [productId]: newQty }));
  };

  const handleAddAllToCart = async () => {
    try {
      const existingCart = localStorage.getItem('cart');
      let cart = existingCart ? JSON.parse(existingCart) : [];

      // Only add related products - main product is already in cart
      const productsToAdd = relatedProducts.filter(p =>
        selectedItems.includes(p.id)
      );

      productsToAdd.forEach(product => {
        const variant = product.variants[0];
        if (!variant) return;

        const qty = quantities[product.id] || 1;

        const newItem = {
          productId: product.id,
          title: product.title,
          handle: product.handle,
          size: variant.size,
          quantity: qty,
          price: variant.cost,
          image: product.images[0] || '/placeholder.jpg',
          variantId: variant.id,
        };

        const existingIndex = cart.findIndex(
          (item: any) => item.productId === product.id && item.size === variant.size
        );

        if (existingIndex > -1) {
          cart[existingIndex].quantity += qty;
        } else {
          cart.push(newItem);
        }
      });

      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      onClose();
    } catch (error) {
      console.error('Error adding items:', error);
    }
  };

  const getTotalPrice = () => {
    let total = 0;
    // Only calculate total for selected related products
    relatedProducts.forEach(product => {
      if (selectedItems.includes(product.id)) {
        const qty = quantities[product.id] || 1;
        total += (product.variants[0]?.cost || 0) * qty;
      }
    });
    return total;
  };

  const currency = mainProduct.variants[0]?.currency || 'USD';

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-light text-gray-900">
              ✨ You Might Also Like
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-900 transition p-1"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">

            {/* Main Product - Always Selected */}
            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border-2 border-green-200">
              <div className="relative w-20 h-28 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={mainProduct.images[0] || '/placeholder.jpg'}
                  alt={mainProduct.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-light text-gray-900 mb-1">{mainProduct.title}</h3>
               
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">
                    {formatPrice(mainProduct.variants[0]?.cost || 0, currency)}
                  </p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">✓ In Cart</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            {relatedProducts.length > 0 && (
              <div className="text-center text-sm text-gray-500">
                + Add More Items
              </div>
            )}

            {/* Related Products */}
            {relatedProducts.length > 0 ? (
              <div className="space-y-3">
                {relatedProducts.map(product => (
                  <div key={product.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(product.id)}
                      onChange={() => handleToggleProduct(product.id)}
                      className="w-5 h-5 rounded cursor-pointer mt-1"
                    />

                    {/* Product Image */}
                    <div className="relative w-20 h-28 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={product.images[0] || '/placeholder.jpg'}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-light text-gray-900 line-clamp-2 mb-1">{product.title}</h3>
                  
                      <p className="font-semibold text-gray-900">
                        {formatPrice(product.variants[0]?.cost || 0, currency)}
                      </p>
                    </div>

                    {/* Quantity Control */}
                    {selectedItems.includes(product.id) && (
                      <div className="flex items-center gap-1 border border-gray-300 rounded-lg bg-white h-fit">
                        <button
                          onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) - 1)}
                          className="p-1 hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 text-sm font-medium min-w-[30px] text-center">
                          {quantities[product.id] || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) + 1)}
                          className="p-1 hover:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">🔍 Looking for more products...</p>
                <p className="text-xs text-gray-400">Check our shop for similar items!</p>
              </div>
            )}

            {/* Total */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Items selected:</span>
                <span className="font-semibold">{selectedItems.length}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(getTotalPrice(), currency)}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddAllToCart}
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition active:scale-95"
              >
                {relatedProducts.length > 0 ? 'Add All to Cart' : 'Continue to Cart'}
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-200 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Continue Shopping
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
