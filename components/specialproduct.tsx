import Image from 'next/image'
import Link from 'next/link'
import { SpecialProductBanner } from '@/lib/shopify'
import { Inter } from 'next/font/google'

// Same face/weight as the Finest Picks heading
const inter = Inter({ subsets: ['latin'], weight: '900' })

// Default fallback images
const DEFAULT_DESKTOP_IMAGE = '/maharaja detailings.svg';
const DEFAULT_MOBILE_IMAGE = '/M9.svg';

interface SpecialproductProps {
  banner?: SpecialProductBanner | null;
}

const Specialproduct = ({ banner }: SpecialproductProps) => {
  const desktopImageSrc = banner?.desktopImage || DEFAULT_DESKTOP_IMAGE;
  const mobileImageSrc = banner?.mobileImage || DEFAULT_MOBILE_IMAGE;
  const altText = banner?.alt || 'Special Product';
  const link = banner?.link || '/shop';

  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Heading above the image, on white */}
      <div className="w-full max-w-7xl mx-auto text-left px-4 sm:px-6 lg:px-8 pt-3 pb-2 sm:pt-5 sm:pb-3">
        <h2
          className={`${inter.className} text-4xl sm:text-6xl lg:text-8xl text-black tracking-tighter leading-none uppercase`}
        >
          The Waffle
        </h2>
        <p className="mt-0 text-[11px] sm:text-sm lg:text-base uppercase tracking-[0.28em] text-black font-medium">
          Collection
        </p>
      </div>

      <div className="relative w-full">
        {/* Mobile Image */}
        <div className="block md:hidden w-full">
          <Image
            src={mobileImageSrc}
            alt={`${altText} - Mobile`}
            width={800}
            height={1200}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Desktop Image */}
        <div className="hidden md:block w-full">
          <Image
            src={desktopImageSrc}
            alt={`${altText} - Desktop`}
            width={1920}
            height={1080}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* CTA only - the heading now sits above the image so it can't cover the garments */}
        <div className="absolute inset-0 flex items-end justify-center pb-8 md:pb-12 lg:pb-16 pointer-events-none">
          <Link
            href={link}
            className="pointer-events-auto inline-block px-[10px] py-[4px] bg-gradient-to-r from-black/80 to-black/45 backdrop-blur-sm text-white font-semibold text-[10px] uppercase tracking-[0.09em] border border-white/70 hover:from-white hover:to-white hover:text-black transition-all duration-300 rounded-sm whitespace-nowrap"
          >
            Shop Now →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Specialproduct
