// components/ProductDetail.tsx
'use client';

import { useState, Suspense, useEffect } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Truck,
  RotateCcw,
  Headphones,
  Share2,
  X,
  Plus,
  Minus,
  User,
  Shield
} from 'lucide-react';
import { Product, formatPrice, calculateDiscount } from '@/lib/shopify';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useSearchParams, useRouter } from 'next/navigation';
import { useWishlist } from '@/hooks/useWishlist';
import SizeGuideModal from './Sizemodal';
import FrequentlyBoughtModal from './FrequentlyBought';
import ProductImageModal from './Productmodal';
import Link from 'next/link';

// --- FAQ MODAL COMPONENT ---
interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function FAQModal({ isOpen, onClose }: FAQModalProps) {
  if (!isOpen) return null;

  const faqs = [
    { q: "What sizing do you follow?", a: "All Capella products use an oversized, relaxed streetwear fit. Check the size chart before ordering." },
    { q: "How do I know which size will fit me?", a: "Use our size guide or message us with your height/weight — we will recommend the perfect fit." },
    { q: "Are Capella products unisex??", a: "Yes. Every fit is designed to suit all genders and body types." },
    { q: "Are the colors exactly like the photos?", a: "Yes — we shoot under controlled studio lighting for accurate color representation. Minor screen-based variations may occur." },
    { q: "Do you offer gift packaging?", a: "Yes, you can select gift packaging at checkout if available." },
    { q: "Do you restock designs?", a: "No. Every drop is limited — once it is sold out, it never returns" },
  ];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col animate-slideUp">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="space-y-2">
              <h3 className="font-semibold text-gray-900 text-sm">{faq.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
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

function ProductDetailContent({ product, relatedProducts }: ProductDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState<boolean>(true); // Default open
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [showFrequentlyBought, setShowFrequentlyBought] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false); // New FAQ State
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Swipe State
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const searchParams = useSearchParams();
  const router = useRouter();
  const country = (searchParams.get('country') || 'CA') as 'IN' | 'CA';

  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();

  const images = product.images.length > 0 ? product.images : ['/placeholder.jpg'];
  const minPrice = Math.min(...product.variants.map(v => v.cost));
  const currency = product.variants[0]?.currency || 'USD';
  const discount = calculateDiscount(minPrice, product.compareAtPrice);

  const sizes = Array.from(new Set(product.variants.map(v => v.size)));

  // Preload all images
  useEffect(() => {
    images.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [images]);

  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImageIndex(prev => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // --- TOUCH HANDLERS FOR SWIPE ---
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextImage();
    if (isRightSwipe) prevImage();
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Check out ${product.title}!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setMessage({ type: 'success', text: 'Link copied to clipboard!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      // Silent error handling
    }
  };

  // --- ADD TO CART (Local Storage) ---
  const handleAddToCart = async () => {
    if (!selectedSize) {
      setMessage({ type: 'error', text: 'Please select a size' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setIsAdding(true);

    try {
      const existingCart = localStorage.getItem('cart');
      let cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];
      const selectedVariant = product.variants.find(v => v.size === selectedSize);

      if (!selectedVariant) throw new Error('Selected size not found');

      const newItem: CartItem = {
        productId: product.id,
        title: product.title,
        handle: product.handle,
        size: selectedSize,
        quantity: quantity,
        price: selectedVariant.cost,
        image: product.images[0] || '/placeholder.jpg',
        variantId: selectedVariant.id,
      };

      const existingItemIndex = cart.findIndex(
        item => item.productId === product.id && item.size === selectedSize
      );

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
      } else {
        cart.push(newItem);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      
      setShowFrequentlyBought(true);
      setSelectedSize('');
      setQuantity(1);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add item to cart' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsAdding(false);
    }
  };

  // --- BUY NOW (Direct to Shopify Checkout) ---
  const handleBuyNow = async () => {
    if (!selectedSize) {
      setMessage({ type: 'error', text: 'Please select a size' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setIsAdding(true);

    try {
      const selectedVariant = product.variants.find(v => v.size === selectedSize);
      if (!selectedVariant) throw new Error('Selected size unavailable');

      const response = await fetch('/api/shopify/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineItems: [{ variantId: selectedVariant.id, quantity: quantity }],
          country: country
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Checkout initialization failed');

      if (data.checkout && data.checkout.webUrl) {
        window.location.href = data.checkout.webUrl;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Could not proceed to checkout.' });
      setTimeout(() => setMessage(null), 3000);
      setIsAdding(false);
    }
  };

  const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").trim();
};

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28 lg:pb-8">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Left - Image Slider */}
        <div className="space-y-4">
          <div
            className="relative bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in image-container"
            style={{ aspectRatio: '3/4' }}
            onClick={() => {
              setIsImageModalOpen(true);
              setModalImageUrl(images[currentImageIndex]);
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.title} - View ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}

            {discount && discount > 0 && (
              <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-sm font-medium rounded z-20">
                {discount}% OFF
              </div>
            )}

            <button
              onClick={e => {
                e.stopPropagation();
                if (isWishlisted(product.id)) {
                  removeFromWishlist(product.id);
                } else {
                  addToWishlist({
                    productId: product.id,
                    title: product.title,
                    handle: product.handle,
                    image: product.images[0] || '/placeholder.jpg',
                  });
                }
              }}
              className="absolute top-4 left-4 bg-white rounded-full p-2 hover:scale-110 transition-transform shadow-md z-20"
            >
              <Heart
                size={20}
                className={isWishlisted(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}
              />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  disabled={isTransitioning}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all shadow-lg z-20 disabled:opacity-50 disabled:cursor-not-allowed hidden sm:block"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  disabled={isTransitioning}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all shadow-lg z-20 disabled:opacity-50 disabled:cursor-not-allowed hidden sm:block"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={e => {
                      e.stopPropagation();
                      if (!isTransitioning) {
                        setIsTransitioning(true);
                        setCurrentImageIndex(index);
                        setTimeout(() => setIsTransitioning(false), 500);
                      }
                    }}
                    className={`rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-black w-6 h-2' 
                        : 'bg-white/70 w-2 h-2 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="hidden sm:grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true);
                      setCurrentImageIndex(index);
                      setTimeout(() => setIsTransitioning(false), 500);
                    }
                  }}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'border-black scale-105 shadow-md' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{ aspectRatio: '3/4' }}
                >
                  <Image
                    src={image}
                    alt={`${product.title} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    loading="eager"
                    sizes="(max-width: 768px) 25vw, 12vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right - Product Info */}
        <div className="space-y-6">
          {message && (
            <div
              className={`p-4 rounded-lg border animate-slideDown ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-light">
                {formatPrice(minPrice, currency)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.compareAtPrice, currency)}
                </span>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-light mb-2">{product.title}</h1>
            {/* Short Description for Header */}
            {/* <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
              {product.description ? stripHtml(product.description).substring(0, 100) : 'Premium quality product'}...
            </p> */}
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-900">Size</span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs text-gray-600 underline hover:text-black transition"
              >
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => {
                const variant = product.variants.find(v => v.size === size);
                const isAvailable = variant?.available ?? false;
                const isSelected = selectedSize === size;

                return (
                  <button
                    key={size}
                    onClick={() => isAvailable && setSelectedSize(size)}
                    disabled={!isAvailable}
                    className={`px-4 py-2 text-sm border rounded transition-all duration-200 ${
                      isSelected
                        ? 'bg-black text-white border-black scale-105'
                        : isAvailable
                        ? 'bg-white border-gray-300 hover:border-gray-400 hover:scale-105'
                        : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Share Row */}
          <div>
            <span className="text-sm font-medium text-gray-900 block mb-3">Quantity</span>
            <div className="flex items-center justify-between gap-4">
              
              <div className="flex items-center border border-gray-300 rounded">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100 transition">−</button>
                <span className="px-4 py-2 border-x border-gray-300 min-w-[50px] text-center text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100 transition">+</button>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <div className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                   <Share2 size={20} />
                </div>
                <span className="text-sm underline hidden sm:inline">Share</span>
              </button>

            </div>
          </div>

          {/* Buttons Stack */}
          <div className="flex flex-col gap-3 pt-2">
            <button onClick={handleAddToCart} disabled={isAdding} className="w-full bg-white text-black border border-black py-3 px-6 rounded hover:bg-gray-50 active:scale-95 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              Add to Cart
            </button>
            <button onClick={handleBuyNow} disabled={isAdding} className="w-full bg-black text-white border border-black py-3 px-6 rounded hover:bg-gray-800 active:scale-95 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
              {isAdding ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Buy Now'}
            </button>
          </div>

          {/* Features */}
          <div className="flex items-center gap-6 text-xs text-gray-600 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Truck size={16} />
              <span>{country === 'IN' ? 'Free Shipping' : 'Free Shipping over $75'}</span>
            </div>
            <div className="flex items-center gap-2"><RotateCcw size={16} /><span>14 Days Returns</span></div>
          </div>

          {/* Icons Grid - Single Line */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-4">
            {[
              { icon: Truck, label: 'Express Delivery' },
              { icon: User, label: 'Unisex' },
              { icon: RotateCcw, label: 'Easy Returns' },
              { icon: Shield, label: 'Durable' }
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-2 sm:p-3 bg-gray-100 rounded hover:shadow-md transition-all duration-300 hover:scale-105">
                <feature.icon size={20} className="mb-1 sm:mb-2 text-gray-700" />
                <span className="text-[10px] sm:text-xs text-gray-700 leading-tight">{feature.label}</span>
              </div>
            ))}
          </div>

          {/* Product Details Accordion or Description Fallback */}
          <div className="pt-6 border-t border-gray-200">
            {product.productDetails && Object.keys(product.productDetails).length > 0 ? (
              <Accordion type="single" collapsible className="w-full" defaultValue={Object.keys(product.productDetails)[0]}>
                {Object.entries(product.productDetails).map(([key, value]) => (
                  <AccordionItem key={key} value={key} className="border-b border-gray-200">
                    <AccordionTrigger className="py-4 text-base font-medium text-gray-900 hover:text-gray-600">
                      {key}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-base text-gray-600 font-light leading-7">
                      <div dangerouslySetInnerHTML={{ __html: value }} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <>
                <button onClick={() => setIsDescriptionOpen(!isDescriptionOpen)} className="w-full flex items-center justify-between py-2 text-left hover:text-gray-600 transition group">
                  <span className="text-base font-medium text-gray-900">Description</span>
                  {isDescriptionOpen ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                {isDescriptionOpen && (
                  <div className="pt-4 pb-2 text-base text-gray-600 font-light leading-7 animate-slideDown">
                    <p>{product.description ? stripHtml(product.description) : 'No description available.'}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Links */}
          <div className="flex items-center justify-center gap-6 text-xs text-gray-600 pt-4">
            <button onClick={() => setIsFAQOpen(true)} className="flex items-center gap-2 hover:text-black transition-colors cursor-pointer">
              <RotateCcw size={14} /><span>Frequently Asked Questions</span>
            </button>
            <Link href={`/Contactus`} className="flex items-center gap-2 hover:text-black transition-colors font-medium">
              <Headphones size={14} /><span>Contact Support</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} sizeChartUrl={product.sizeChart} sizeChartTip={product.sizeChartTip} />
      <FrequentlyBoughtModal isOpen={showFrequentlyBought} onClose={() => setShowFrequentlyBought(false)} mainProduct={product} relatedProducts={relatedProducts} country={country} />
      <ProductImageModal isOpen={isImageModalOpen} imageUrl={modalImageUrl} alt={product.title} onClose={() => setIsImageModalOpen(false)} />
      <FAQModal isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />

      {/* Sticky mobile add-to-cart bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 flex items-center gap-4 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-gray-500 truncate leading-tight">{product.title}</p>
          <p className="text-base font-medium text-gray-900 leading-tight">{formatPrice(minPrice, currency)}</p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="shrink-0 bg-black text-white px-7 py-3 rounded font-medium active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? 'Adding…' : 'Add to Cart'}
        </button>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .image-container { position: relative; touch-action: pan-y; }
      `}</style>
    </section>
  );
}

export default function ProductDetail(props: ProductDetailProps) {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4"><div className="relative bg-gray-200 rounded-lg animate-pulse" style={{ aspectRatio: '3/4' }}></div></div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    }>
      <ProductDetailContent {...props} />
    </Suspense>
  );
}
