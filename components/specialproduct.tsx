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
  // Use banner data or fallback to defaults
  const desktopImageSrc = banner?.desktopImage || DEFAULT_DESKTOP_IMAGE;
  const mobileImageSrc = banner?.mobileImage || DEFAULT_MOBILE_IMAGE;
  const altText = banner?.alt || 'Special Product';
  const link = banner?.link;

  const ImageContent = (
    <div className="w-full relative">
      {/* --- MOBILE IMAGE --- */}
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

      {/* --- DESKTOP IMAGE --- */}
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
    </div>
  );

  return (
    <div 
      className="flex flex-col items-center justify-center w-full"
      style={{ backgroundColor: '#F2EFE8' }}
    >
      {/* Image Container - Full Width */}
      {link ? (
        <Link href={link} className="w-full block hover:opacity-95 transition-opacity">
          {ImageContent}
        </Link>
      ) : (
        ImageContent
      )}
    </div>
  )
}

export default Specialproduct
