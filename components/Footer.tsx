// components/Footer.tsx
import Link from 'next/link';
import { Twitter, Instagram, Mail } from 'lucide-react';
import { FaPinterest } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white w-full pt-20 sm:pt-24 pb-10 overflow-hidden selection:bg-white selection:text-black">
      
      <div className="max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* --- 1. BIG BRAND NAME (Moved to Top) --- */}
        <div className="mb-20 sm:mb-32 select-none pointer-events-none">
          <h1 className="text-[13vw] leading-[0.8] font-black text-white tracking-tighter text-center lg:text-left lg:-ml-4 opacity-100">
            CAPELLA
          </h1>
        </div>

        {/* --- 2. LINKS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-24">
          
          {/* Brand Manifesto (Span 4 cols) */}
          <div className="md:col-span-4 lg:col-span-5 flex flex-col justify-between">
          <div className="flex flex-col justify-between h-full">
  
  {/* Label with Accent */}
  <div className="flex items-center gap-3 mb-8">
    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
    <span className="text-xs font-bold tracking-[0.25em] text-neutral-500 uppercase">
      The Manifesto
    </span>
  </div>

  {/* Main Text */}
  <p className="text-2xl md:text-3xl font-light leading-[1.15] text-neutral-400 max-w-lg tracking-tight">
    Premium streetwear built with intention. Engineered for durability, detail, and identity.
    
    {/* The Punchline - Visual Break */}
    <span className="block mt-8 text-white font-normal border-l-2 border-white pl-6">
      Designed for those who move different.
    </span>
  </p>

</div>
            
            {/* Socials (Desktop placement) */}
            <div className="hidden md:flex gap-4 mt-12">
              <SocialLink href="https://twitter.com/capellafits" icon={<Twitter size={22} />} />
              <SocialLink href="https://www.instagram.com/capellafits" icon={<Instagram size={22} />} />
              <SocialLink href="https://pin.it/45GSpH06r" icon={<FaPinterest size={22} />} />
            </div>
          </div>

          {/* Navigation Links (Span 8 cols split into sub-grids) */}
          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-12">
            
            {/* Column 1 */}
            <div className="flex flex-col space-y-6">
              <h4 className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-2">Explore</h4>
              <FooterLink href="/" label="Home" />
              <FooterLink href="/Aboutus" label="About Us" />
              <FooterLink href="/shop" label="Collections" />
              <FooterLink href="/Contactus" label="Contact" />
            </div>

            {/* Column 2 */}
            <div className="flex flex-col space-y-6">
              <h4 className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-2">Shop</h4>
              <FooterLink href="/shop" label="All Products" />
              <FooterLink href="/tshirts" label="T-Shirts" />
              <FooterLink href="/hoddies" label="Hoodies" />
              <FooterLink href="/shirts" label="Shirts" />
            </div>

            {/* Column 3 */}
            <div className="flex flex-col space-y-6">
              <h4 className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-2">Support</h4>
              <FooterLink href="/Shipping" label="Shipping" />
              <FooterLink href="/Returns" label="Returns" />
              <a 
                href="mailto:support@capellafits.com"
                className="group flex items-center gap-2 text-lg font-medium text-gray-400 hover:text-white transition-colors"
              >
                <span>Support</span>
                <Mail size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

          </div>

          {/* Mobile Socials */}
          <div className="md:hidden flex gap-4">
            <SocialLink href="https://twitter.com/capellafits" icon={<Twitter size={20} />} />
            <SocialLink href="https://www.instagram.com/capellafits" icon={<Instagram size={20} />} />
            <SocialLink href="https://pin.it/45GSpH06r" icon={<FaPinterest size={20} />} />
          </div>
        </div>

        {/* --- 3. BOTTOM SECTION (Legal) --- */}
        <div className="border-t border-white/10 pt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          
          {/* Legal */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 text-sm text-gray-600 font-medium">
            <span>© {new Date().getFullYear()} Capella Fits.</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>

          {/* Scroll Top / Extra Info */}
          <div className="text-sm text-gray-600 font-mono uppercase tracking-widest hidden lg:block">
            From Stars To Streets
          </div>
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
      className="group flex items-center justify-between w-fit gap-1 text-lg font-medium text-gray-400 hover:text-white transition-colors"
    >
      <span className="relative">
        {label}
        <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
      </span>
    </Link>
  );
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      target="_blank" 
      className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
    >
      {icon}
    </Link>
  );
}