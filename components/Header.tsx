// components/Header.tsx
'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Settings,
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/hooks/usecart';
import { useCartModal } from '@/hooks/usecartmodel';
import { useWishlist } from '@/hooks/useWishlist';
import Image from 'next/image';
import { useCustomer } from '@/hooks/useCustomer';

interface HeaderProps {
  categoryProducts?: any;
}

function HeaderContent({ categoryProducts }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const shopRef = useRef<HTMLDivElement>(null);
  const collectionsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const currentCountry = 'CA';
  const { totalItems } = useCart();
  const { openModal } = useCartModal();
  const { totalWishlistItems } = useWishlist();
  const { customer, loading, logout } = useCustomer();

  const shopCategories = [
    { label: 'All Products', href: '/shop' },
    { label: 'T-Shirts', href: '/tshirts' },
    { label: 'Shirts', href: '/shirts' },
    { label: 'Hoodies', href: '/hoddies' },
    { label: 'Pants', href: '/pants' },
  ];

  const addCountry = (href: string) => {
    return `${href}`;
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    router.push(`/`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(event.target as Node))
        setIsShopOpen(false);
      if (
        collectionsRef.current &&
        !collectionsRef.current.contains(event.target as Node)
      )
        setIsCollectionsOpen(false);
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      )
        setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-full shadow-sm px-4 sm:px-8 py-1 relative min-h-[44px] sm:min-h-[52px] flex items-center">
          {/* LEFT SECTION */}
          <div className="flex items-center gap-4 z-20">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gray-900 hover:text-gray-600 transition p-1"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {/* Shop */}
              <div className="relative" ref={shopRef}>
                <button
                  onClick={() => {
                    setIsShopOpen(!isShopOpen);
                    setIsCollectionsOpen(false);
                  }}
                  className="text-sm font-light text-gray-900 hover:text-gray-600 transition relative group flex items-center gap-1"
                >
                  Shop
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${isShopOpen ? 'rotate-180' : ''}`}
                  />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300" />
                </button>
                {isShopOpen && (
                  <div className="absolute left-0 top-full mt-6 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden min-w-52 animate-slide-down">
                    {shopCategories.map((category, index) => (
                      <Link
                        key={index}
                        href={addCountry(category.href)}
                        onClick={() => setIsShopOpen(false)}
                        className="block px-5 py-3 text-sm font-light text-gray-900 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0"
                      >
                        {category.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Collections */}
              <div className="relative" ref={collectionsRef}>
                <button
                  onClick={() => {
                    setIsCollectionsOpen(!isCollectionsOpen);
                    setIsShopOpen(false);
                  }}
                  className="text-sm font-light text-gray-900 hover:text-gray-600 transition relative group flex items-center gap-1"
                >
                  Collections
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${isCollectionsOpen ? 'rotate-180' : ''}`}
                  />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300" />
                </button>
                {isCollectionsOpen && (
                  <div className="absolute left-0 top-full mt-6 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden min-w-52 animate-slide-down">
                    <Link
                      href={addCountry('/shop')}
                      onClick={() => setIsCollectionsOpen(false)}
                      className="block px-5 py-3 text-sm font-light text-gray-900 hover:bg-gray-50 transition border-b border-gray-100"
                    >
                      All Collections
                    </Link>
                    <Link
                      href={addCountry('/')}
                      onClick={() => setIsCollectionsOpen(false)}
                      className="block px-5 py-3 text-sm font-light text-gray-900 hover:bg-gray-50 transition border-b border-gray-100"
                    >
                      Best Sellers
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href={addCountry('/Aboutus')}
                className="text-sm font-light text-gray-900 hover:text-gray-600 transition relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href={addCountry('/Contactus')}
                className="text-sm font-light text-gray-900 hover:text-gray-600 transition relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300" />
              </Link>
            </nav>
          </div>

          {/* CENTER LOGO */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <Link href={addCountry('/')} className="flex items-center justify-center">
              <Image
                src="/Navbar.png"
                alt="Capella"
                width={120}
                height={40}
                priority
                className="w-20 sm:w-32 h-auto object-contain"
              />
            </Link>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 ml-auto z-20">
            {/* Wishlist */}
            <Link
              href={addCountry('/wishlist')}
              className="text-gray-900 hover:text-gray-600 transition relative p-1 hover:bg-gray-100 rounded-full"
            >
              <Heart size={20} />
              {totalWishlistItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalWishlistItems > 99 ? '99+' : totalWishlistItems}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => openModal()}
              className="text-gray-900 hover:text-gray-600 transition relative p-1 hover:bg-gray-100 rounded-full"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Desktop Profile */}
            <div className="relative hidden lg:block" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="text-gray-900 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-full"
              >
                <User size={20} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden min-w-56 animate-slide-down">
                  {!loading && customer ? (
                    <>
                      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">Welcome!</p>
                        <p className="text-xs text-gray-600 truncate">
                          {customer.firstName || customer.email || 'Customer'}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3 text-sm font-light text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href={addCountry('/auth/login')}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-sm font-light text-gray-900 hover:bg-gray-50 transition border-b border-gray-100"
                      >
                        <User size={16} />
                        Sign In
                      </Link>
                      <Link
                        href={addCountry('/auth/signup')}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-sm font-light text-gray-900 hover:bg-gray-50 transition"
                      >
                        <User size={16} />
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="mt-3 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-3xl shadow-lg overflow-hidden">
          <nav className="flex flex-col max-h-[80vh] overflow-y-auto">
            {shopCategories.map((category) => (
              <Link
                key={category.href}
                href={addCountry(category.href)}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-3 text-sm font-light text-gray-900 hover:bg-gray-50 transition border-b border-gray-100"
              >
                {category.label}
              </Link>
            ))}
            <Link
              href={addCountry('/Aboutus')}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-6 py-3 text-sm font-light text-gray-900 hover:bg-gray-50 transition border-b border-gray-100"
            >
              About
            </Link>
            <Link
              href={addCountry('/Contactus')}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-6 py-3 text-sm font-light text-gray-900 hover:bg-gray-50 transition border-b border-gray-100"
            >
              Contact
            </Link>
            <div className="bg-gray-50 border-t border-gray-100">
              <div className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Account
              </div>
              {!loading && customer ? (
                <>
                  <div className="px-6 py-2 text-sm font-medium text-gray-900 truncate">
                    Hi,{' '}
                    {customer.firstName ||
                      customer.email?.split('@')[0] ||
                      'Customer'}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-6 py-3 text-sm font-light text-red-600 hover:bg-red-50 transition border-t border-gray-100 mt-1"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={addCountry('/auth/login')}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-6 py-3 text-sm font-light text-gray-900 hover:bg-gray-100 transition"
                  >
                    <User size={16} />
                    Sign In
                  </Link>
                  <Link
                    href={addCountry('/auth/signup')}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-6 py-3 text-sm font-light text-gray-900 hover:bg-gray-100 transition"
                  >
                    <User size={16} />
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default function Header(props: HeaderProps) {
  return (
    <Suspense
      fallback={
        <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-full shadow-lg px-8 py-2 flex justify-center">
              <span className="text-xl font-black tracking-wider text-gray-900">
                CAPELLA
              </span>
            </div>
          </div>
        </header>
      }
    >
      <HeaderContent {...props} />
    </Suspense>
  );
}
