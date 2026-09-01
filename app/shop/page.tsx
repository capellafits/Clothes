import Header from '@/components/Header';
import CategoryCard from '@/components/Categorycard';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { fetchProductsByCollection, fetchAllProducts, type Product, type Country } from '@/lib/shopify';
import Link from 'next/link';

export const revalidate = 60;

interface ShopPageProps {
  searchParams: Promise<{ country?: string; collection?: string }>;
}

const collections = [
  { name: 'T-Shirts', handle: 'tshirts', image: '/TJ.jpg' },
  { name: 'Shirts', handle: 'shirts', image: '/S7.jpg' },
  { name: 'Pants', handle: 'pants', image: '/4.jpg' },
  { name: 'Hoodies', handle: 'hoodies', image: '/S4.jpg' },
];

function getCollectionName(handle: string): string {
  return collections.find(c => c.handle === handle)?.name || handle;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const country = (params.country as Country) || 'CA';
  const selectedCollection = params.collection || '';

  let products: Product[] = [];
  try {
    if (selectedCollection) {
      products = await fetchProductsByCollection(selectedCollection, country);
    } else {
      products = await fetchAllProducts(country);
    }
  } catch (error) {
    products = [];
  }

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#F2EFE8' }}>
      <Header />

      {/* Fixed Header Spacer */}
      <div className="h-14 sm:h-18"></div>

      <section className="max-w-7xl mx-auto pt-6 sm:pt-8 pb-0" style={{ backgroundColor: '#F2EFE8' }}>
        {/* Category nav: horizontal scroll, no pills */}
        <div className="mb-5 sm:mb-6 flex gap-5 overflow-x-auto px-4 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href="/shop"
            className={`shrink-0 whitespace-nowrap pb-1 text-sm font-extralight uppercase transition-colors ${
              !selectedCollection
                ? 'border-b border-black text-black'
                : 'border-b border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            View All
          </Link>
          {collections.map(collection => (
            <CategoryCard
              key={collection.handle}
              name={collection.name}
              image={collection.image}
              handle={collection.handle}
              country={country}
              active={selectedCollection === collection.handle}
            />
          ))}
        </div>

        {selectedCollection && (
          <div className="flex justify-center mb-6">
            <Link
              href={`/shop`}
              className="inline-block text-sm font-extralight uppercase text-neutral-500 hover:text-black transition-colors"
            >
              ← Back to All Products
            </Link>
          </div>
        )}
      </section>

      <ProductGrid
        products={products}
        country={country}
        selectedCollection={selectedCollection}
      />

      <Footer />
    </div>
  );
}
