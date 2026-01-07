import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full min-h-screen bg-[#F2EFE8] text-gray-900 selection:bg-black selection:text-white">

      <main className="w-full pt-20 sm:pt-24">

        {/* --- 1. HERO: TITLE (Brutalist Style) --- */}
        <section className="border-b border-black">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-[0.3em] uppercase mb-6 text-gray-500">
                Legal — Your Privacy Matters
              </span>
              <h1 className="text-[10vw] sm:text-[8vw] leading-[0.85] font-black tracking-tighter text-black uppercase">
                Privacy <br />
                Policy
              </h1>
            </div>
          </div>
        </section>

        {/* --- 2. INTRO SECTION (Sticky Layout) --- */}
        <section className="w-full border-b border-black">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2">

            {/* Left: Sticky Title Area */}
            <div className="relative p-8 sm:p-16 lg:p-24 border-b lg:border-b-0 lg:border-r border-black flex flex-col justify-between bg-[#F2EFE8]">
              <div className="sticky top-32">
                <h2 className="text-4xl sm:text-5xl font-bold uppercase tracking-tight mb-8">
                  Your Trust
                </h2>
                <p className="text-sm font-mono tracking-wider text-gray-600 max-w-xs">
                  AT CAPELLA <br />
                  YOUR PRIVACY <br />
                  IS IMPORTANT TO US
                </p>
              </div>
            </div>

            {/* Right: Scrollable Text */}
            <div className="p-8 sm:p-16 lg:p-24 flex flex-col justify-center space-y-12 bg-white">
              <p className="text-xl sm:text-2xl font-light leading-relaxed text-gray-800">
                This policy explains how we collect, use, and protect your personal information when you visit or make a purchase from our store.
              </p>
            </div>
          </div>
        </section>

        {/* --- 3. DARK SECTION: INFORMATION WE COLLECT --- */}
        <section className="w-full bg-[#111] text-[#F2EFE8] py-24 sm:py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="block text-xs font-bold tracking-[0.3em] uppercase mb-8 text-gray-400">
                Information We Collect
              </span>
              <h3 className="text-3xl sm:text-5xl font-medium leading-tight mb-12">
                We collect only what we need to serve you better.
              </h3>
              <div className="h-px w-full bg-white/20 mb-12"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 text-lg font-light text-gray-400 leading-8">
                <div className="space-y-4">
                  <p>Personal details you provide (name, email, shipping address, payment details).</p>
                  <p>Order history and customer service interactions.</p>
                </div>
                <div className="space-y-4">
                  <p>Device information (browser, IP address, time zone, and cookies).</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 4. HOW WE USE YOUR INFORMATION (Grid System) --- */}
        <section className="border-b border-black bg-[#F2EFE8]">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <span className="block text-xs font-bold tracking-[0.3em] uppercase mb-8 text-gray-500">
              How We Use Your Information
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-black border-t border-black">
            {[
              {
                num: '01',
                title: 'Process Orders',
                desc: 'To process and deliver your orders efficiently and accurately.'
              },
              {
                num: '02',
                title: 'Communication',
                desc: 'To communicate with you about updates, promotions, or support inquiries.'
              },
              {
                num: '03',
                title: 'Improvement',
                desc: 'To improve our website and enhance your shopping experience.'
              },
              {
                num: '04',
                title: 'Compliance',
                desc: 'To comply with legal or regulatory requirements as needed.'
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

        {/* --- 5. DATA SHARING & SECURITY --- */}
        <section className="w-full border-b border-black">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2">

            {/* Left: Sharing */}
            <div className="p-8 sm:p-16 lg:p-24 border-b lg:border-b-0 lg:border-r border-black bg-white">
              <span className="block text-xs font-bold tracking-[0.3em] uppercase mb-8 text-gray-500">
                Sharing Your Information
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mb-8">
                Limited Sharing
              </h3>
              <p className="text-lg font-light leading-relaxed text-gray-800">
                We only share your data with trusted service providers (like payment processors and shipping carriers) needed to complete your order. We do not sell or rent your personal information to third parties.
              </p>
            </div>

            {/* Right: Security */}
            <div className="p-8 sm:p-16 lg:p-24 bg-[#F2EFE8]">
              <span className="block text-xs font-bold tracking-[0.3em] uppercase mb-8 text-gray-500">
                Data Security
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mb-8">
                Protected Data
              </h3>
              <p className="text-lg font-light leading-relaxed text-gray-800">
                We use secure technology and industry-standard practices to protect your personal information. However, no method of transmission is 100% secure, so we cannot guarantee absolute security.
              </p>
            </div>
          </div>
        </section>

        {/* --- 6. COOKIES & YOUR RIGHTS --- */}
        <section className="w-full bg-[#111] text-[#F2EFE8] py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 sm:gap-24">

              {/* Cookies */}
              <div>
                <span className="block text-xs font-bold tracking-[0.3em] uppercase mb-6 text-gray-400">
                  Cookies
                </span>
                <h3 className="text-2xl sm:text-3xl font-medium leading-tight mb-6">
                  Better Experience
                </h3>
                <p className="text-lg font-light text-gray-400 leading-8">
                  Our site uses cookies to remember your preferences and provide a better shopping experience. You can disable cookies in your browser settings, but some features may not work properly.
                </p>
              </div>

              {/* Your Rights */}
              <div>
                <span className="block text-xs font-bold tracking-[0.3em] uppercase mb-6 text-gray-400">
                  Your Rights
                </span>
                <h3 className="text-2xl sm:text-3xl font-medium leading-tight mb-6">
                  You Are In Control
                </h3>
                <p className="text-lg font-light text-gray-400 leading-8">
                  You may request access, correction, or deletion of your personal information by contacting{' '}
                  <a href="mailto:support@capellafits.com" className="underline underline-offset-4 hover:text-white transition-colors">
                    support@capellafits.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- 7. POLICY UPDATES --- */}
        <section className="border-b border-black bg-[#F2EFE8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
              <div>
                <span className="block text-xs font-bold tracking-[0.3em] uppercase mb-4 text-gray-500">
                  Policy Updates
                </span>
                <p className="text-lg font-light text-gray-800 max-w-xl">
                  We may update this Privacy Policy from time to time. Changes will be posted here with the updated date.
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href="mailto:support@capellafits.com"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors"
                >
                  Contact Us
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
