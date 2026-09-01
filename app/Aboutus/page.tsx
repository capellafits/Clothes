import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaqSection } from '@/components/faq';
import NewsletterSection from '@/components/Newsletter';

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-[#FFFFFF] text-gray-900 selection:bg-black selection:text-white">
      <Header />

      <main className="w-full pt-20 sm:pt-24">
        
        {/* --- 1. HERO: TITLE (Brutalist Style) --- */}
        <section className="border-b border-black">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-[0.3em] uppercase mb-6 text-gray-500">
                Est. 2024 — Global
              </span>
              <h1 className="text-[12vw] leading-[0.85] font-black tracking-tighter text-black uppercase wrap-break-word">
                From Stars <br />
                To Streets
              </h1>
            </div>
          </div>
        </section>

        {/* --- 2. THE ORIGIN (Sticky Layout) --- */}
        <section className="w-full border-b border-black">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-screen">
            
            {/* Left: Sticky Image/Title Area */}
            <div className="relative p-8 sm:p-16 lg:p-24 border-b lg:border-b-0 lg:border-r border-black flex flex-col justify-between bg-[#FFFFFF]">
              <div className="sticky top-32">
                <h2 className="text-4xl sm:text-5xl font-bold uppercase tracking-tight mb-8">
                  The Origin
                </h2>
                <p className="text-sm font-mono tracking-wider text-gray-600 max-w-xs">
                  AURIGA CONSTELLATION <br />
                  ALPHA STAR <br />
                  MAGNITUDE 0.08
                </p>
              </div>
            </div>

            {/* Right: Scrollable Text */}
            <div className="p-8 sm:p-16 lg:p-24 flex flex-col justify-center space-y-12 bg-white">
              <p className="text-xl sm:text-2xl font-light leading-relaxed text-gray-800">
                Inspired by the brightest star in the Auriga constellation, Capella is not just a name—it is a lifestyle brand forged at the intersection of luxury craftsmanship and modern culture.
              </p>
              <p className="text-xl sm:text-2xl font-light leading-relaxed text-gray-800">
                At Capella, we do not just design streetwear—we create pieces fueled by artistry, forward-thinking design, and the pulse of today’s culture. Every collection is shaped by the raw moments of life and the world we live in.
              </p>
            </div>
          </div>
        </section>

        {/* --- 3. DARK SECTION: THE CRAFT --- */}
        <section className="w-full bg-[#111] text-[#FFFFFF] py-24 sm:py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="block text-xs font-bold tracking-[0.3em] uppercase mb-8 text-gray-400">
                The Philosophy
              </span>
              <h3 className="text-3xl sm:text-5xl font-medium leading-tight mb-12">
                We believe true style is born from impeccable craftsmanship and fearless creativity.
              </h3>
              <div className="h-px w-full bg-white/20 mb-12"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 text-lg font-light text-gray-400 leading-8">
                <p>
                  That is why each garment is crafted with care—from the choice of fabric to the precise tailoring—blending comfort, function, and bold expression.
                </p>
                <p>
                  Our signature oversized silhouettes are designed for movement, confidence, and everyday wearability. Capella is for those who wear their story proudly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- 4. CORE VALUES (Grid System) --- */}
        <section className="border-b border-black bg-[#FFFFFF]">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black border-b border-black">
            {[
              {
                num: '01',
                title: 'Purpose Driven',
                desc: 'People who move through the world with purpose and want every outfit to reflect it.'
              },
              {
                num: '02',
                title: 'Exclusive Runs',
                desc: 'Our designs are produced in small, exclusive runs—because true style is not mass-produced.'
              },
              {
                num: '03',
                title: 'Identity',
                desc: 'When you wear Capella, you are not just wearing clothes. You are wearing who you have become.'
              }
            ].map((item) => (
              <div key={item.num} className="p-12 sm:p-16 hover:bg-white transition-colors duration-500 group">
                <span className="block text-6xl font-light text-gray-300 mb-8 group-hover:text-black transition-colors duration-300">
                  {item.num}
                </span>
                <h4 className="text-xl font-bold uppercase mb-4 tracking-wide">{item.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <NewsletterSection/>

        {/* --- 5. FAQ SECTION --- */}
        <div className="bg-white">
          <FaqSection />
        </div>

      </main>
      
      <Footer />
    </div>
  );
}