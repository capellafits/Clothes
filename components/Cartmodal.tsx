'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartModal } from '@/hooks/usecartmodel';

interface CartItem {
  productId: string;
  title: string;
  handle: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
  variantId?: string;
  currency?: string; 
  country?: string; 
}

//  WRAP ONLY THE PART THAT USES useSearchParams
function CartContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const country = (searchParams.get('country') || 'CA') as 'IN' | 'CA';
  
  const { isOpen, closeModal } = useCartModal();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Close the cart whenever the route changes so navigation isn't blocked
  useEffect(() => {
    closeModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const getCurrency = () => {
    return country === 'CA' ? 'CAD' : 'INR';
  };

  const getCurrencySymbol = () => {
    return country === 'CA' ? '$' : '₹';
  };

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      try {
        const cart = localStorage.getItem('cart');
        const parsedCart = cart ? JSON.parse(cart) : [];
        setItems(parsedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    closeModal();
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = [...items];
    updatedItems[index].quantity = newQuantity;
    setItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const prepareLineItems = () => {
    return items.map(item => ({
      variantId: item.variantId || item.productId,
      quantity: item.quantity,
    }));
  };

  const handleShopifyCheckout = async () => {
    if (items.length === 0) {
      alert('Cart is empty');
      return;
    }

    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/shopify/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineItems: prepareLineItems(),
          country: country, 
          currency: getCurrency(), 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      if (!data.checkout?.webUrl) {
        throw new Error('No checkout URL received from Shopify');
      }

      // Keep the cart: checkout is a stateless permalink, so if the customer
      // backs out of Shopify checkout their items must still be here.
      window.location.href = data.checkout.webUrl;
    } catch (error) {
      console.error('❌ Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Checkout failed. Please try again.');
      setIsCheckingOut(false);
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const formatCartPrice = (amount: number) => {
    const currency = getCurrency();
    const symbol = getCurrencySymbol();
    
    if (currency === 'CAD') {
      return `${symbol} ${amount.toFixed(2)}`;
    } else {
      return `${symbol} ${amount.toFixed(0)}`;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 cursor-pointer ${
          isAnimating ? 'bg-black/50' : 'bg-black/0'
        }`}
        onClick={handleClose}
      />

      <div
        className={`fixed right-0 top-0 h-screen w-[90%] max-w-sm sm:w-96 bg-white shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 ease-out ${
          isAnimating
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0'
        }`}
        style={{
          borderBottomLeftRadius: '24px',
          borderTopLeftRadius: '24px',
        }}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h2 className="text-lg sm:text-xl font-light">
            Cart ({getTotalItems()})
          </h2>

          <button
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition shrink-0"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClose();
            }}
          >
            <X size={24} strokeWidth={2} />
          </button>
        </div>

        {items.length > 0 && country === 'CA' && (
          <div className="px-4 sm:px-6 py-3 border-b border-gray-200 bg-white">
            {getTotalPrice() >= 75 ? (
              <p className="text-xs font-medium text-gray-900 mb-1.5">
                You&apos;ve unlocked <span className="font-semibold">free shipping</span> 🎉
              </p>
            ) : (
              <p className="text-xs text-gray-700 mb-1.5">
                Spend <span className="font-semibold text-gray-900">{formatCartPrice(75 - getTotalPrice())}</span> more and get <span className="font-semibold text-gray-900">free shipping</span>!
              </p>
            )}
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (getTotalPrice() / 75) * 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 pb-4 border-b border-gray-200 animate-fadeIn"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/products/${item.handle}`}
                      onClick={handleClose}
                      className="hover:text-gray-600 transition"
                    >
                      <h3 className="text-sm font-light text-gray-900 line-clamp-2 mb-1 hover:underline">
                        {item.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-gray-600 mb-2">
                      Size: <span className="font-medium">{item.size}</span>
                    </p>

                    <p className="text-sm font-medium text-gray-900">
                      {formatCartPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(index, item.quantity - 1)}
                        className="p-1.5 hover:bg-gray-100 active:bg-gray-200 transition cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-xs font-medium min-w-[30px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(index, item.quantity + 1)}
                        className="p-1.5 hover:bg-gray-100 active:bg-gray-200 transition cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-gray-400 hover:text-red-500 active:text-red-600 transition p-1 hover:bg-red-50 rounded-full cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-gray-500 text-center mb-4">Your cart is empty</p>
              <Link
                href="/shop"
                onClick={handleClose}
                className="text-sm text-gray-900 underline hover:text-gray-600 transition"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div
            className="p-4 sm:p-6 border-t border-gray-200 space-y-3 bg-gray-50 sticky bottom-0 z-10 transition-all duration-300"
            style={{
              borderTopLeftRadius: '24px',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Subtotal ({country === 'CA' ? '🇨🇦 CAD' : '🇮🇳 INR'})
              </span>
              <span className="text-lg font-medium text-gray-900">
                {formatCartPrice(getTotalPrice())}
              </span>
            </div>

            <button
              onClick={handleShopifyCheckout}
              disabled={isCheckingOut || items.length === 0}
              className="w-full bg-black text-white py-3 px-4 rounded-xl font-medium text-center hover:bg-gray-800 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </span>
              ) : (
                `Checkout (${getCurrency()})`
              )}
            </button>

            <button
              onClick={handleClose}
              className="w-full bg-gray-200 text-gray-900 py-3 px-4 rounded-xl font-medium hover:bg-gray-300 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              Continue Shopping
            </button>

            <p className="text-xs text-gray-500 text-center pt-2">
              You'll be redirected to Shopify checkout to complete your purchase
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
}

//  KEEP ORIGINAL NAME, WRAP IN SUSPENSE
export default function CartModal() {
  return (
    <Suspense fallback={null}>
      <CartContent />
    </Suspense>
  );
}
