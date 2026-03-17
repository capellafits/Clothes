// app/page.tsx
import Header from '@/components/Header'
import HeroSection from '@/components/Banner'
import NewsletterSection from '@/components/Newsletter'
import Footer from '@/components/Footer'
import FeaturedProducts from '@/components/featuredProduct'
import { fetchAllProducts, fetchSpecialProductBanner, type Country } from '@/lib/shopify'
import { getHomepageBanners } from '@/lib/shopifyAdmin'
import Specialproduct from '@/components/specialproduct'

export const revalidate = 60;

interface HomePageProps {
  searchParams: Promise<{ country?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const country = (params.country as Country) || 'CA';

  // Fetch products, banners, and special product banner in parallel
  const [allProducts, bannerSlides, specialProductBanner] = await Promise.all([
    fetchAllProducts(country),
    getHomepageBanners(country),
    fetchSpecialProductBanner(country)
  ]);

  const randomProducts = allProducts
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#F2EFE8' }}>
      {/* Header overlays everything */}
      <Header />

      <main className="w-full">
        {/* Hero Section - starts at top, no margin */}
        <div className="w-full bg-linear-to-br from-gray-900 via-gray-800 to-gray-700">
          <HeroSection slides={bannerSlides} />
        </div>

        {/* Spacer for separation - adjust py-8 for more/less space */}
        <div className="w-full py-0.5" />

        {/* Special Product */}
        <div className="w-full" style={{ backgroundColor: '#F2EFE8' }}>
          <Specialproduct banner={specialProductBanner} />
        </div>

        {/* Featured Products */}
        <section className="w-full bg-[#F2EFE8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FeaturedProducts products={randomProducts} country={country} />
          </div>
        </section>

        {/* NEWSLETTER SECTION */}
        <section className="w-full bg-linear-to-r from-gray-900 to-gray-800 text-white">
          <NewsletterSection />
        </section>
      </main>

      <Footer />
    </div>
  )
}
