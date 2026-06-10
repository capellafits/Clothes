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
  const link = banner?.link || '/products/denim-shirt-jeans-combo-the-classic-reinvented';

  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{ backgroundColor: '#F2EFE8' }}
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

        {/* Desktop gradient: left-to-right */}
        <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-black/55 via-black/20 to-transparent pointer-events-none" />

        {/* Mobile gradient: bottom-to-top */}
        <div className="absolute inset-0 block md:hidden bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none" />

        {/* Text + CTA overlay */}
        <div className="absolute inset-0 flex flex-col justify-end pb-10 md:pb-16 lg:pb-20 pl-6 sm:pl-12 lg:pl-20">
          {/* Label */}
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-white/70 font-normal mb-3">
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
