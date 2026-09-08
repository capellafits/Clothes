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

        {/* Keep the CTA below the artwork so it never overlaps its text. */}
        <div className="flex justify-center py-3 sm:py-4">
          <Link
            href={link}
            className="inline-block px-5 py-2.5 bg-black text-white font-medium text-[11px] uppercase tracking-wider hover:bg-gray-800 transition rounded-sm whitespace-nowrap"
          >
            Shop Now →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Specialproduct
