import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
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
    <div className="w-full min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <Header />

      {/* Fixed Header Spacer */}
      <div className="h-[60px] sm:h-[84px]"></div>

      <section className="max-w-7xl mx-auto pt-2 sm:pt-4 pb-0" style={{ backgroundColor: '#FFFFFF' }}>
        <CategoryNav active={selectedCollection} country={country} />

        {selectedCollection && (
          <div className="flex justify-center mb-6">
            <Link
              href={`/shop`}
              className="inline-block text-[11px] sm:text-xs font-bold uppercase text-neutral-500 hover:text-black transition-colors"
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
