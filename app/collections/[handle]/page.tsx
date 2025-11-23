// app/collection/[handle]/page.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { fetchProductsByCollection, type Country } from '@/lib/shopify';

interface CollectionPageProps {
  params: {
    handle: string;
  };
  searchParams: {
    country?: string;
  };
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const collectionNameMap: { [key: string]: string } = {
    'tshirts': 'T-Shirts',
    'shirts': 'Shirts',
    'pants': 'Pants',
  };

  const name = collectionNameMap[params.handle] || params.handle;

  return {
    title: `${name} - Capella Fits`,
    description: `Shop our ${name} collection at Capella Fits`,
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const country = (searchParams.country as Country) || 'IN';
  const { handle } = params;

  // Fetch products for this collection
  const products = await fetchProductsByCollection(handle, country);

  const collectionNameMap: { [key: string]: string } = {
    'tshirts': 'T-Shirts',
    'shirts': 'Shirts',
    'pants': 'Pants',
  };

  const collectionName = collectionNameMap[handle] || handle;

  return (
    <div className="w-full min-h-screen bg-white">
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-20 sm:h-24"></div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-3 tracking-wide">
            {collectionName}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base font-light">
            {products.length} products in collection
          </p>
        </div>

        {/* Back to Shop Link */}
        <div className="text-center mb-12">
          <a
            href="/shop"
            className="inline-block px-6 sm:px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition font-light text-sm"
          >
            ← Back to Shop
          </a>
        </div>
      </section>

      {/* Products Section */}
      <ProductGrid
        products={products}
        country={country}
        selectedCollection={handle}
      />

      <Footer />
    </div>
  );
}
