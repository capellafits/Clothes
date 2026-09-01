// app/tshirts/page.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { fetchProductsByCollection, type Country } from '@/lib/shopify';
import Link from 'next/link'; 

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata = {
  title: 'T-Shirts - Capella Fits',
  description: 'Shop our premium T-Shirt collection at Capella Fits',
};

interface PageProps {
  searchParams: Promise<{ country?: string }>;
}

export default async function TShirtsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const country = (params.country as Country) || 'CA';

  // Fetch T-Shirts collection
  const products = await fetchProductsByCollection('tshirts', country);

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-20 sm:h-24 mb-6 sm:mb-10"></div>

      {/* Products Section */}
      <ProductGrid
        products={products}
        country={country}
        selectedCollection="tshirts"
      />

      <Footer />
    </div>
  );
}
