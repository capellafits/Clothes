import Image from 'next/image'
import Link from 'next/link'
import { SpecialProductBanner } from '@/lib/shopify'

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

        {/* Text + CTA overlay */}
        <div className="absolute inset-0 flex flex-col justify-end pb-10 md:pb-16 lg:pb-20 pl-6 sm:pl-12 lg:pl-20">
          {/* Label */}
          <p className="text-[clamp(34px,7vw,80px)] font-bold text-white leading-[1.05] tracking-tight text-shadow-lg drop-shadow-lg max-w-[88vw] sm:max-w-xl lg:max-w-4xl mb-5">
            The Waffle Collection
          </p>

          {/* CTA Button */}
          <Link
            href={link}
            className="inline-block px-[10px] py-[4px] bg-transparent text-white font-semibold text-[10px] uppercase tracking-[0.09em] border border-white/70 hover:bg-white hover:text-black transition-all duration-300 rounded-sm whitespace-nowrap w-fit"
          >
            Shop Now →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Specialproduct
