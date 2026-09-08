import { pageMetadata, jsonLd, SITE_URL } from '@/lib/seo';
// app/page.tsx
import HeroSection from '@/components/Banner'
import NewsletterSection from '@/components/Newsletter'
import Footer from '@/components/Footer'
import FeaturedProducts from '@/components/featuredProduct'
import { fetchProductsByCollection, fetchSpecialProductBanner, type Country } from '@/lib/shopify'
import { getHomepageBanners } from '@/lib/shopifyAdmin'
import Specialproduct from '@/components/specialproduct'

export const metadata = { ...pageMetadata("Graphic Streetwear & Everyday Clothing", "Discover Capella Fits graphic T-shirts, statement shirts, waffle tops, hoodies, cargo pants and denim. Explore the latest designs. From stars to streets.", "/"), title: { absolute: "Capella Fits | Graphic Streetwear & Everyday Clothing" } };

export const revalidate = 60;

interface HomePageProps {
  searchParams: Promise<{ country?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const country = (params.country as Country) || 'CA';

  // Fetch products, banners, and special product banner in parallel
  const [tshirtProducts, bannerSlides, specialProductBanner] = await Promise.all([
    fetchProductsByCollection('tshirts', country),
    getHomepageBanners(country),
    fetchSpecialProductBanner(country)
  ]);

  const randomProducts = tshirtProducts
    .filter(p => p.variants.some(variant => variant.available))
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <h1 className="sr-only">Capella Fits — Graphic Streetwear &amp; Everyday Clothing</h1>

      <div className="w-full">
        {/* Hero Section - starts at top, no margin */}
        <div className="w-full bg-linear-to-br from-gray-900 via-gray-800 to-gray-700">
          <HeroSection slides={bannerSlides} />
        </div>

        {/* Featured Products - sits directly under the hero.
            No padded wrapper: the grid runs edge to edge like the shop page. */}
        <section className="w-full bg-[#FFFFFF]">
          <FeaturedProducts products={randomProducts} country={country} />
        </section>

        {/* Special Product */}
        <div className="w-full" style={{ backgroundColor: '#FFFFFF' }}>
          <Specialproduct banner={specialProductBanner} />
        </div>

        {/* NEWSLETTER SECTION */}
        <section className="w-full bg-linear-to-r from-gray-900 to-gray-800 text-white">
          <NewsletterSection />
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
        '@context': 'https://schema.org', '@graph': [
          { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'Capella Fits', url: SITE_URL, logo: `${SITE_URL}/Navbar.png`, sameAs: ['https://www.instagram.com/capellafits/', 'https://www.tiktok.com/@capellafits', 'https://www.youtube.com/@capellafits'] },
          { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: 'Capella Fits', url: SITE_URL, publisher: { '@id': `${SITE_URL}/#organization` } },
        ],
      }) }} />
      <Footer />
    </div>
  )
}
