// app/products/[handle]/page.tsx
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetail from '@/components/ProductDetail';
import SimilarProducts from '@/components/Similarproduct';
import { fetchAllProducts, Country } from '@/lib/shopify';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{
    handle: string;
  }>;
  searchParams: Promise<{
    country?: string;
  }>;
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { handle } = await params;
  const { country = 'CA' } = await searchParams;

  // Fetch all products and find the one with matching handle.
  // An empty catalog means the Shopify fetch failed (the store is never
  // actually empty), so retry once, then surface the error boundary
  // instead of a misleading 404.
  let allProducts = await fetchAllProducts(country as Country);
  if (allProducts.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 400));
    allProducts = await fetchAllProducts(country as Country);
  }
  if (allProducts.length === 0) {
    throw new Error('Product data temporarily unavailable');
  }

  const product = allProducts.find(p => p.handle === handle);

  if (!product) {
    notFound();
  }

  const similarProducts = allProducts
    .filter(p => p.id !== product.id)
    .slice(0, 6);

  // GET 2 RANDOM PRODUCTS FOR MODAL
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-20 sm:h-24"></div>

      {/* --- BREADCRUMBS SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <nav className="flex items-center gap-2 text-xs text-gray-500">
          <Link
            href={`/`}
            className="hover:text-black transition underline-offset-2 hover:underline"
          >
            Home
          </Link>

          <ChevronRight size={12} className="text-gray-400" />

          <Link
            href={`/shop`}
            className="hover:text-black transition underline-offset-2 hover:underline"
          >
            Shop
          </Link>

          <ChevronRight size={12} className="text-gray-400" />

          <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">
            {product.title}
          </span>
        </nav>
      </div>

      <ProductDetail
        product={product}
        relatedProducts={relatedProducts}
      />

      {similarProducts.length > 0 && (
        <SimilarProducts products={similarProducts} country={country} />
      )}

      <Footer />
    </div>
  );
}
