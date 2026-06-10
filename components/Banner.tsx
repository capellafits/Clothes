// components/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { HeroSlide } from '@/lib/shopifyAdmin';

const fallbackSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Stillness',
    subtitle: 'is a flex.',
    description: 'Denim, engineered for the effortless.',
    desktopImage: '/Newcollection.jpg',
    mobileImage: '/Newcollectionmobile.jpg',
    ctaText: 'Shop the Look',
    ctaLink: '/products/denim-shirt-jeans-combo-the-classic-reinvented',
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

interface HeroSectionProps {
  slides?: HeroSlide[];
}

export default function HeroSection({ slides }: HeroSectionProps) {
  const heroSlides = slides && slides.length > 0 ? slides : fallbackSlides;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const minSwipeDistance = 50;

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay, heroSlides.length]);

  const nextSlide = () => { setIsAutoPlay(false); setCurrentSlide((prev) => (prev + 1) % heroSlides.length); };
  const prevSlide = () => { setIsAutoPlay(false); setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length); };
  const goToSlide = (index: number) => { setIsAutoPlay(false); setCurrentSlide(index); };

  const onTouchStart = (e: React.TouchEvent) => { setTouchEnd(0); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e: React.TouchEvent) => { setTouchEnd(e.targetTouches[0].clientX); };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextSlide();
    if (distance < -minSwipeDistance) prevSlide();
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
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="hidden md:block w-full h-full animate-slow-zoom">
              <Image src={s.desktopImage} alt={`${s.title} ${s.subtitle}`} fill className="object-cover" priority={index === 0} sizes="100vw" />
            </div>
            <div className="block md:hidden w-full h-full animate-slow-zoom">
              <Image src={s.mobileImage} alt={`${s.title} ${s.subtitle}`} fill className="object-cover" priority={index === 0} sizes="100vw" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 md:hidden" />
            <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-black/55 via-black/20 to-transparent opacity-90" />
          </div>
        ))}
      </div>

      {/* Content Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="w-full h-full max-w-[1920px] mx-auto relative">

          {/* Text Section */}
          <div className="absolute bottom-16 sm:bottom-20 lg:bottom-28 left-6 sm:left-12 lg:left-20 pointer-events-auto text-left z-20 pr-6 sm:pr-0">
            <div className="space-y-2 animate-fadeInUp drop-shadow-lg max-w-[80vw] sm:max-w-lg lg:max-w-3xl">
              {(slide.title || slide.subtitle) && (
                <h1 className="text-[clamp(24px,4.5vw,58px)] font-bold text-white leading-tight tracking-tight text-shadow-lg">
                  {slide.title} {slide.subtitle}
                </h1>
              )}
              {slide.description && (
                <p className="text-[13px] sm:text-sm lg:text-base text-white/75 leading-relaxed font-normal animate-fadeInUp animation-delay-200 drop-shadow-md">
                  {slide.description}
                </p>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <div className="absolute bottom-8 sm:bottom-10 left-6 sm:left-12 lg:left-20 pointer-events-auto z-20 animate-fadeInUp animation-delay-400">
            <Link
              href={slide.ctaLink}
              className="inline-block px-[10px] py-[4px] bg-transparent text-white font-semibold text-[10px] uppercase tracking-[0.09em] border border-white/70 hover:bg-white hover:text-black transition-all duration-300 rounded-sm"
            >
              {slide.ctaText} →
            </Link>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-auto z-20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full shadow-sm ${index === currentSlide ? 'bg-white w-8 h-1.5' : 'bg-white/40 hover:bg-white/60 w-2 h-1.5 backdrop-blur-sm'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button onClick={prevSlide} className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/10 hover:bg-black/30 text-white transition-all duration-300 backdrop-blur-sm border border-white/10 hidden md:block group">
        <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button onClick={nextSlide} className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/10 hover:bg-black/30 text-white transition-all duration-300 backdrop-blur-sm border border-white/10 hidden md:block group">
        <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
      </button>

      <style jsx>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes zoom { from { transform: scale(1); } to { transform: scale(1.05); } }
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
