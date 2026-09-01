import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryNav from '@/components/CategoryNav';
import ProductGrid from '@/components/ProductGrid';
import { fetchProductsByCollection, type Country } from '@/lib/shopify';
import Link from 'next/link';

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata = {
  title: 'Hoodies - Capella Fits',
  description: 'Shop our premium Hoodie collection at Capella Fits',
};

interface PageProps {
  searchParams: Promise<{ country?: string }>;
}

export default async function HoodiesPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const country = (params.country as Country) || 'CA';

  // Fetch Hoodies collection
  const products = await fetchProductsByCollection('hoodies', country);

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-[60px] sm:h-[84px]"></div>

      <div className="max-w-7xl mx-auto pt-2 sm:pt-4">
        <CategoryNav active="hoodies" country={country} />
      </div>

      {/* Products Section */}
      <ProductGrid
        products={products}
        country={country}
        selectedCollection="hoodies"
      />

      <Footer />
    </div>
  );
}
