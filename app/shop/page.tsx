import { Suspense } from 'react';
import { fetchCollections, fetchProductsByCollection, type Country } from '@/lib/shopify';
import ProductGrid from '@/components/ProductGrid';
import CategoryCard from '@/components/Categorycard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const revalidate = 60;

interface ShopPageProps {
  searchParams: Promise<{ country?: string; collection?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const country = (params.country as Country) || 'CA';
  const selectedCollection = params.collection || 'all';

  const [collections, products] = await Promise.all([
    fetchCollections(country),
    fetchProductsByCollection(selectedCollection, country),
  ]);

  return (
    <div className="w-full min-h-screen bg-[#F2EFE8]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16">
        {/* Category buttons - single row on all screen sizes */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8">
          {collections.map(collection => (
            <CategoryCard
              key={collection.handle}
              name={collection.title}
              image={collection.image || ''}
              handle={collection.handle}
              country={country}
            />
          ))}
        </div>

        {/* Products */}
        <Suspense fallback={<div>Loading...</div>}>
          <ProductGrid products={products} country={country} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
