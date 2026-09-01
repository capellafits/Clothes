// app/pants/page.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { fetchProductsByCollection, type Country } from '@/lib/shopify';
import Link from 'next/link';

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata = {
  title: 'Pants - Capella Fits',
  description: 'Shop our premium Pants collection at Capella Fits',
};

interface PageProps {
  searchParams: Promise<{ country?: string }>;
}

export default async function PantsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const country = (params.country as Country) || 'CA';

  const products = await fetchProductsByCollection('pants', country);

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <Header />

      <div className="h-20 sm:h-24 mb-6 sm:mb-10"></div>


      <ProductGrid
        products={products}
        country={country}
        selectedCollection="pants"
      />

      <Footer />
    </div>
  );
}
