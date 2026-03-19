'use client';

import Image from 'next/image';
import Link from 'next/link';

interface SpecialproductProps {
  desktopImage: string;
  mobileImage: string;
  link: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
}

export default function Specialproduct({
  desktopImage,
  mobileImage,
  link,
  eyebrow = 'The Classic Reinvented',
  title = 'Stillness is a flex.',
  description = 'Denim, engineered for the effortless.',
  ctaText = 'Shop the Look',
}: SpecialproductProps) {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Desktop Image */}
      <div className="hidden md:block relative w-full aspect-[16/7]">
        <Image
          src={desktopImage}
          alt={title}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Mobile Image */}
      <div className="block md:hidden relative w-full aspect-[4/5]">
        <Image
          src={mobileImage}
          alt={title}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Desktop gradient: left-to-right */}
      <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-black/55 via-black/20 to-transparent" />

      {/* Mobile gradient: bottom-to-top */}
      <div className="absolute inset-0 block md:hidden bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col justify-end pb-16 md:pb-20 pl-6 sm:pl-12 lg:pl-20">
        {/* Eyebrow */}
        <p className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-white/60 font-normal mb-2">
          {eyebrow}
        </p>

        {/* Headline */}
        <h2 className="text-[clamp(26px,4vw,54px)] font-bold text-white leading-none tracking-tight mb-2 whitespace-nowrap"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          {title}
        </h2>

        {/* Description */}
        <p className="text-[13px] sm:text-sm lg:text-base text-white/75 font-normal mb-5 whitespace-nowrap"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
          {description}
        </p>

        {/* CTA Button — Option C: tiny outlined */}
        <Link
          href={link}
          className="inline-block px-[10px] py-[4px] bg-transparent text-white font-semibold text-[10px] uppercase tracking-[0.09em] border border-white/70 hover:bg-white hover:text-black transition-all duration-300 rounded-sm whitespace-nowrap w-fit"
        >
          {ctaText} →
        </Link>
      </div>
    </div>
  );
}
