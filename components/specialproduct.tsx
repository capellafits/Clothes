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

        {/* Text + CTA overlay: heading at the top, CTA centred at the bottom */}
        <div className="absolute inset-0 flex flex-col items-center justify-between px-6 pt-8 md:pt-12 lg:pt-16 pb-8 md:pb-12 lg:pb-16 pointer-events-none">
          {/* Heading */}
          <div className="text-center">
            <h2
              className={`${inter.className} text-4xl sm:text-6xl lg:text-8xl text-white tracking-tighter leading-none uppercase drop-shadow-lg`}
            >
              The Waffle
            </h2>
            <p className="mt-1.5 text-[11px] sm:text-sm lg:text-base uppercase tracking-[0.28em] text-white font-medium drop-shadow-md">
              Collection
            </p>
          </div>

          {/* CTA */}
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
