import { categoryPages, pageMetadata } from '@/lib/seo';
import Footer from '@/components/Footer';
import CategoryNav from '@/components/CategoryNav';
import ProductGrid from '@/components/ProductGrid';
import { fetchProductsByCollection, type Country } from '@/lib/shopify';
import Link from 'next/link';

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const category = categoryPages.shirts;
export const metadata = pageMetadata(category.title, category.description, category.path);

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
    <div className="w-full min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>

      <h1 className="sr-only">{category.heading}</h1>
      <div className="h-[60px] sm:h-[84px]"></div>

      <div className="max-w-7xl mx-auto pt-2 sm:pt-4">
        <CategoryNav active="shirts" country={country} />
      </div>
      <ProductGrid
        products={products}
        country={country}
        selectedCollection="shirts"
      />

      <p className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 text-xs text-gray-600 leading-relaxed">{category.description}</p>
      <Footer />
    </div>
  );
}

