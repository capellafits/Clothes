// components/Footer.tsx
import Link from 'next/link';
import { Twitter, Instagram, Mail } from 'lucide-react';
import { FaPinterest } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white w-full pt-10 sm:pt-16 pb-6 overflow-hidden selection:bg-white selection:text-black">

      <div className="max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* --- 1. BRAND WORDMARK --- */}
        <div className="mb-6 sm:mb-12 select-none pointer-events-none">
          <h1 className="text-[13vw] leading-[0.8] font-black text-white tracking-tighter text-center lg:text-left lg:-ml-4">
            CAPELLA
          </h1>
        </div>

        {/* --- 2. MANIFESTO + LINKS --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 mb-10 sm:mb-16">

          {/* Manifesto */}
          <div className="md:col-span-5 lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 uppercase">
                  The Manifesto
                </span>
              </div>

              <p className="text-sm sm:text-base font-light leading-relaxed text-neutral-400 max-w-md">
                Premium streetwear built with intention. Engineered for durability, detail, and identity.
                <span className="block mt-3 text-white border-l border-white pl-4">
                  Designed for those who move different.
                </span>
              </p>
            </div>

            {/* Socials (desktop) */}
            <div className="hidden md:flex gap-3 mt-8">
              <SocialLink href="https://twitter.com/capellafits" icon={<Twitter size={18} />} />
              <SocialLink href="https://www.instagram.com/capellafits" icon={<Instagram size={18} />} />
              <SocialLink href="https://pin.it/45GSpH06r" icon={<FaPinterest size={18} />} />
            </div>
          </div>

          {/* Links - two columns only. The old "Shop" column duplicated the
              category nav that now sits on every shop page. */}
          <div className="md:col-span-7 lg:col-span-6 grid grid-cols-2 gap-6 sm:gap-10">

            <div className="flex flex-col space-y-3">
              <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-1">Explore</h4>
              <FooterLink href="/" label="Home" />
              <FooterLink href="/shop" label="All Products" />
              <FooterLink href="/Aboutus" label="About Us" />
              <FooterLink href="/Contactus" label="Contact" />
            </div>

            <div className="flex flex-col space-y-3">
              <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-1">Support</h4>
              <FooterLink href="/Shipping" label="Shipping" />
              <FooterLink href="/Returns" label="Returns" />
              <FooterLink href="/privacy-policy" label="Privacy Policy" />
              <FooterLink href="/terms-of-service" label="Terms of Service" />
              <a
                href="mailto:support@capellafits.com"
                className="group flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-white transition-colors"
              >
                <span>Email Us</span>
                <Mail size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

          </div>

          {/* Socials (mobile) */}
          <div className="md:hidden flex gap-3">
            <SocialLink href="https://twitter.com/capellafits" icon={<Twitter size={18} />} />
            <SocialLink href="https://www.instagram.com/capellafits" icon={<Instagram size={18} />} />
            <SocialLink href="https://pin.it/45GSpH06r" icon={<FaPinterest size={18} />} />
          </div>
        </div>

        {/* --- 3. LEGAL --- */}
        <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[11px] text-gray-600">
            © {new Date().getFullYear()} Capella Fits.
          </span>
          <span className="text-[11px] text-gray-600 uppercase tracking-widest hidden lg:block">
            From Stars To Streets
          </span>
        </div>

      </div>
    </footer>
  );
}

// --- Helper Components ---

function FooterLink({ href, label }: { href: string, label: string }) {
  return (
    <Link
      href={href}
      className="group w-fit text-[13px] text-gray-400 hover:text-white transition-colors"
    >
      <span className="relative">
        {label}
        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
      </span>
    </Link>
  );
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300"
    >
      {icon}
    </Link>
  );
}
