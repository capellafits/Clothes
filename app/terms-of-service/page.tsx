import Footer from '@/components/Footer';

export default function TermsOfServicePage() {
  return (
    <div className="w-full min-h-screen bg-[#FFFFFF] text-gray-900 selection:bg-black selection:text-white">

      <main className="w-full pt-20 sm:pt-24">

        {/* --- 1. HERO: TITLE (Brutalist Style) --- */}
        <section className="border-b border-black">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-[0.3em] uppercase mb-6 text-gray-500">
                Legal — Know Your Rights
              </span>
              <h1 className="text-[10vw] sm:text-[8vw] leading-[0.85] font-black tracking-tighter text-black uppercase">
                Terms of <br />
                Service
              </h1>
            </div>
          </div>
        </section>

        {/* --- 2. INTRO SECTION (Sticky Layout) --- */}
        <section className="w-full border-b border-black">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2">

            {/* Left: Sticky Title Area */}
            <div className="relative p-8 sm:p-16 lg:p-24 border-b lg:border-b-0 lg:border-r border-black flex flex-col justify-between bg-[#FFFFFF]">
              <div className="sticky top-32">
                <h2 className="text-4xl sm:text-5xl font-bold uppercase tracking-tight mb-8">
                  Welcome
                </h2>
                <p className="text-sm font-mono tracking-wider text-gray-600 max-w-xs">
                  CAPELLA FITS <br />
                  WWW.CAPELLAFITS.COM <br />
                  TERMS & CONDITIONS
                </p>
              </div>
            </div>

            {/* Right: Scrollable Text */}
            <div className="p-8 sm:p-16 lg:p-24 flex flex-col justify-center space-y-12 bg-white">
              <p className="text-xl sm:text-2xl font-light leading-relaxed text-gray-800">
                These Terms of Service govern access to and use of the website and services, including placing orders, browsing products, and engaging with content. By using the website, you agree to these Terms.
              </p>
            </div>
          </div>
        </section>

        {/* --- 3. USE OF WEBSITE & PRODUCT INFO --- */}
        <section className="w-full border-b border-black">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2">

            {/* Left: Use of Website */}
            <div className="p-8 sm:p-16 lg:p-24 border-b lg:border-b-0 lg:border-r border-black bg-white">
              <span className="block text-6xl font-light text-gray-300 mb-8">01</span>
              <span className="block text-xs font-bold tracking-[0.3em] uppercase mb-4 text-gray-500">
                Use of Website
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mb-6">
                Age Requirements
              </h3>
              <p className="text-lg font-light leading-relaxed text-gray-800">
                Users must be at least 18 years old or use the site under parental/guardian supervision. Unlawful or unauthorized use is prohibited.
              </p>
            </div>

            {/* Right: Product Information */}
            <div className="p-8 sm:p-16 lg:p-24 bg-[#FFFFFF]">
              <span className="block text-6xl font-light text-gray-300 mb-8">02</span>
              <span className="block text-xs font-bold tracking-[0.3em] uppercase mb-4 text-gray-500">
                Product Information
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mb-6">
                Accuracy Notice
              </h3>
              <p className="text-lg font-light leading-relaxed text-gray-800">
                We strive for accurate product display but cannot guarantee precise color or detail representation across devices. Descriptions, images, and prices may change without notice.
              </p>
            </div>
          </div>
        </section>

        {/* --- 4. DARK SECTION: ORDERS & PAYMENTS --- */}
        <section className="w-full bg-[#111] text-[#FFFFFF] py-24 sm:py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="block text-6xl font-light text-gray-600 mb-8">03</span>
              <span className="block text-xs font-bold tracking-[0.3em] uppercase mb-8 text-gray-400">
                Orders & Payments
              </span>
              <h3 className="text-3xl sm:text-5xl font-medium leading-tight mb-12">
                Secure transactions for a seamless shopping experience.
              </h3>
              <div className="h-px w-full bg-white/20 mb-12"></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-lg font-light text-gray-400 leading-8">
                <p>Order placement confirms accuracy of provided details.</p>
                <p>Company reserves right to cancel or refuse orders.</p>
                <p>Payments use accepted methods at checkout with secure, encrypted transactions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- 5. SHIPPING & RETURNS (Grid System) --- */}
        <section className="border-b border-black bg-[#FFFFFF]">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black">

            {/* Shipping */}
            <div className="p-12 sm:p-16 lg:p-24 hover:bg-white transition-colors duration-500 group">
              <span className="block text-6xl font-light text-gray-300 mb-8 group-hover:text-black transition-colors duration-300">
                04
              </span>
              <span className="block text-xs font-bold tracking-[0.3em] uppercase mb-4 text-gray-500">
                Shipping & Delivery
              </span>
              <h4 className="text-xl font-bold uppercase mb-4 tracking-wide">Timely Delivery</h4>
              <p className="text-base text-gray-600 leading-relaxed">
                Please refer to our Shipping Policy for details. We aim for timely delivery but are not responsible for delays from logistics partners or external factors.
              </p>
              <a href="/Shipping" className="inline-block mt-6 text-sm font-bold uppercase tracking-wider underline underline-offset-4 hover:text-gray-500 transition-colors">
                View Shipping Policy
              </a>
            </div>

            {/* Returns */}
            <div className="p-12 sm:p-16 lg:p-24 hover:bg-white transition-colors duration-500 group">
              <span className="block text-6xl font-light text-gray-300 mb-8 group-hover:text-black transition-colors duration-300">
                05
              </span>
              <span className="block text-xs font-bold tracking-[0.3em] uppercase mb-4 text-gray-500">
                Returns & Refunds
              </span>
              <h4 className="text-xl font-bold uppercase mb-4 tracking-wide">Easy Returns</h4>
              <p className="text-base text-gray-600 leading-relaxed">
                See our Return & Refund Policy for information on returns, exchanges, and refunds.
              </p>
              <a href="/Returns" className="inline-block mt-6 text-sm font-bold uppercase tracking-wider underline underline-offset-4 hover:text-gray-500 transition-colors">
                View Returns Policy
              </a>
            </div>
          </div>
        </section>

        {/* --- 6. INTELLECTUAL PROPERTY & PRIVACY --- */}
        <section className="w-full border-b border-black">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2">

            {/* Left: IP */}
            <div className="p-8 sm:p-16 lg:p-24 border-b lg:border-b-0 lg:border-r border-black bg-white">
              <span className="block text-6xl font-light text-gray-300 mb-8">06</span>
              <span className="block text-xs font-bold tracking-[0.3em] uppercase mb-4 text-gray-500">
                Intellectual Property
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mb-6">
                Our Content
              </h3>
              <p className="text-lg font-light leading-relaxed text-gray-800">
                All site content—logos, graphics, images, designs, text—belongs to Capella Fits and cannot be copied or reproduced without written consent.
              </p>
            </div>

            {/* Right: Privacy */}
            <div className="p-8 sm:p-16 lg:p-24 bg-[#FFFFFF]">
              <span className="block text-6xl font-light text-gray-300 mb-8">07</span>
              <span className="block text-xs font-bold tracking-[0.3em] uppercase mb-4 text-gray-500">
                Privacy Policy
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mb-6">
                Your Data
              </h3>
              <p className="text-lg font-light leading-relaxed text-gray-800 mb-6">
                Our operations are governed by our Privacy Policy regarding data handling.
              </p>
              <a href="/privacy-policy" className="inline-block text-sm font-bold uppercase tracking-wider underline underline-offset-4 hover:text-gray-500 transition-colors">
                View Privacy Policy
              </a>
            </div>
          </div>
        </section>

        {/* --- 7. USER CONDUCT & THIRD-PARTY --- */}
        <section className="w-full bg-[#111] text-[#FFFFFF] py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 sm:gap-24">

              {/* User Conduct */}
              <div>
                <span className="block text-6xl font-light text-gray-600 mb-6">08</span>
                <span className="block text-xs font-bold tracking-[0.3em] uppercase mb-6 text-gray-400">
                  User Conduct
                </span>
                <h3 className="text-2xl sm:text-3xl font-medium leading-tight mb-6">
                  Responsible Use
                </h3>
                <p className="text-lg font-light text-gray-400 leading-8">
                  Prohibited activities include uploading harmful content, violating laws, and disrupting website functionality. Violations may result in account suspension.
                </p>
              </div>

              {/* Third-Party Links */}
              <div>
                <span className="block text-6xl font-light text-gray-600 mb-6">09</span>
                <span className="block text-xs font-bold tracking-[0.3em] uppercase mb-6 text-gray-400">
                  Third-Party Links
                </span>
                <h3 className="text-2xl sm:text-3xl font-medium leading-tight mb-6">
                  External Sites
                </h3>
                <p className="text-lg font-light text-gray-400 leading-8">
                  We are not responsible for third-party website content, policies, or practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- 8. FINAL TERMS (Grid System) --- */}
        <section className="border-b border-black bg-[#FFFFFF]">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black">
            {[
              {
                num: '10',
                title: 'Changes to Terms',
                desc: 'Terms may update anytime without notice; continued use implies acceptance of updated terms.'
              },
              {
                num: '11',
                title: 'Limitation of Liability',
                desc: 'Capella Fits disclaims liability for damages or service interruptions beyond our control.'
              },
              {
                num: '12',
                title: 'Governing Law',
                desc: 'These terms are governed by applicable jurisdiction laws where Capella Fits operates.'
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

        {/* --- 9. CONTACT --- */}
        <section className="border-b border-black bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
              <div>
                <span className="block text-xs font-bold tracking-[0.3em] uppercase mb-4 text-gray-500">
                  Questions?
                </span>
                <p className="text-lg font-light text-gray-800 max-w-xl">
                  If you have any questions about these Terms of Service, please contact us.
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href="mailto:support@capellafits.com"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors"
                >
                  support@capellafits.com
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
