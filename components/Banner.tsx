// components/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  desktopImage: string;  
  mobileImage: string;   
  ctaText: string;
  ctaLink: string;
}

const heroSlides: HeroSlide[] = [

    {
    id: 1,
    title: 'Winter',
    subtitle: 'Collection',
    description: '420 GSM heavyweights built for real winters — warmth, structure, and bold Capella identity.',
    desktopImage: '/Newcollection.jpg',
    mobileImage: '/Newcollectionmobile.jpg',
    ctaText: 'Shop Now ',
    ctaLink: '/shop',
  },

  {
    id: 2,
    title: 'Pride',
    subtitle: 'of Punjab',
    description: 'A tribute to Maharaja Ranjit Singh — Punjab map, Kohinoor on his biceps, and 100% profit donated to flood-relief.',
    desktopImage: '/P1.jpg',       
    mobileImage: '/PM.jpg',  
    ctaText: 'Explore',
    ctaLink: '/shop',
  },

  {
    id: 3,
    title: 'Summer',
    subtitle: 'Essentials',
    description: 'Light, breathable shirts built for heat, comfort, and everyday movement — designed for the season.',
    desktopImage: '/S2.jpg',
    mobileImage: '/S2.jpg',
    ctaText: 'Discover',
    ctaLink: '/shop',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // --- SWIPE STATE ---
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const minSwipeDistance = 50;

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const nextSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlay(false);
    setCurrentSlide(index);
  };

  // --- TOUCH HANDLERS ---
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  const slide = heroSlides[currentSlide];

  return (
    <section 
      className="relative w-full h-screen overflow-hidden bg-gray-900 touch-pan-y" 
      style={{ margin: 0, padding: 0 }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Images */}
      <div className="absolute inset-0 pointer-events-none">
        {heroSlides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Desktop Image */}
            <div className="hidden md:block w-full h-full animate-slow-zoom">
              <Image
                src={s.desktopImage}
                alt={`${s.title} ${s.subtitle}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </div>

            {/* Mobile Image */}
            <div className="block md:hidden w-full h-full animate-slow-zoom">
              <Image
                src={s.mobileImage}
                alt={`${s.title} ${s.subtitle}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-90" />
            <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-transparent opacity-60" />
          </div>
        ))}
      </div>

      {/* Content Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="w-full h-full max-w-[1920px] mx-auto relative">
          
          {/* --- 1. TEXT SECTION (BOTTOM LEFT) --- */}
          <div className="absolute bottom-28 sm:bottom-32 lg:bottom-36 left-6 sm:left-12 lg:left-20 pointer-events-auto text-left z-20">
            <div className="space-y-2 animate-fadeInUp drop-shadow-lg max-w-md sm:max-w-lg lg:max-w-3xl">
              
              {/* COMBINED TITLE & SUBTITLE (Single Line, Adjusted Size) */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-none tracking-tight text-shadow-lg uppercase whitespace-nowrap">
                {slide.title} {slide.subtitle}
              </h1>
              
              <p className="mt-4 text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed font-light animate-fadeInUp animation-delay-200 drop-shadow-md max-w-xs sm:max-w-md">
                {slide.description}
              </p>
            </div>
          </div>

          {/* --- 2. CTA BUTTON (CENTERED BOTTOM) --- */}
          <div className="absolute bottom-12 sm:bottom-14 left-1/2 -translate-x-1/2 pointer-events-auto z-20 animate-fadeInUp animation-delay-400">
            <Link
              href={slide.ctaLink}
              className="inline-block px-10 py-4 bg-white text-black font-medium text-sm uppercase tracking-widest hover:bg-gray-100 hover:scale-105 transition-all duration-300 rounded-full shadow-2xl whitespace-nowrap"
            >
              {slide.ctaText}
            </Link>
          </div>

          {/* --- 3. SLIDE INDICATORS (BELOW BUTTON) --- */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-auto z-20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full shadow-sm ${
                  index === currentSlide
                    ? 'bg-white w-8 h-1.5'
                    : 'bg-white/40 hover:bg-white/60 w-2 h-1.5 backdrop-blur-sm'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/10 hover:bg-black/30 text-white transition-all duration-300 backdrop-blur-sm border border-white/10 hidden md:block group"
      >
        <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/10 hover:bg-black/30 text-white transition-all duration-300 backdrop-blur-sm border border-white/10 hidden md:block group"
      >
        <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
      </button>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoom {
          from { transform: scale(1); }
          to { transform: scale(1.05); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
        .animate-slow-zoom { animation: zoom 10s ease-in-out infinite alternate; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .text-shadow-sm { text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
        .text-shadow-lg { text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
      `}</style>
    </section>
  );
}