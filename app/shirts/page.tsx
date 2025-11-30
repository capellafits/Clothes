import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { fetchProductsByCollection, type Country } from '@/lib/shopify';
import Link from 'next/link';

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata = {
  title: 'Shirts - Capella Fits',
  description: 'Shop our premium Shirt collection at Capella Fits',
};

interface PageProps {
  searchParams: Promise<{ country?: string }>;
}

export default async function ShirtsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const country = (params.country as Country) || 'CA';

  const products = await fetchProductsByCollection('shirts', country);

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#F2EFE8' }}>
      <Header />

      <div className="h-20 sm:h-24 mb-6 sm:mb-10"></div>
      <ProductGrid
        products={products}
        country={country}
        selectedCollection="shirts"
      />

      <Footer />
    </div>
  );
}

