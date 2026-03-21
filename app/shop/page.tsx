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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-10 pb-0" style={{ backgroundColor: '#F2EFE8' }}>
        {/* Grid wrapper - 4 columns on all screen sizes */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-8 mb-4 sm:mb-8">
          {collections.map(collection => (
            <CategoryCard
              key={collection.handle}
              name={collection.name}
              image={collection.image}
              handle={collection.handle}
              country={country}
            />
          ))}
        </div>

        {selectedCollection && (
          <div className="flex justify-center mb-6">
            <Link
              href={`/shop?country=${country}`}
              className="inline-block px-6 sm:px-8 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 active:scale-95 transition-all font-light text-sm duration-300"
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
