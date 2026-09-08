import { cache } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import Footer from '@/components/Footer';
import CategoryNav from '@/components/CategoryNav';
import ProductGrid from '@/components/ProductGrid';
import { fetchProductsByCollection } from '@/lib/shopify';
import { categoryPages, pageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
interface CollectionPageProps { params: Promise<{ handle: string }> }
const getProducts = cache((handle: string) => fetchProductsByCollection(handle, 'CA'));

function canonicalCategory(handle: string) {
  if (handle === 'all') permanentRedirect('/shop');
  if (categoryPages[handle]) permanentRedirect(categoryPages[handle].path);
}
function collectionName(handle: string) {
  return handle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const { handle } = await params;
  canonicalCategory(handle);
  const name = collectionName(handle);
  return pageMetadata(`${name} Collection`, `Explore the ${name} collection from Capella Fits. View product photos, prices and available sizes.`, `/collections/${handle}`);
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params;
  canonicalCategory(handle);
  const products = await getProducts(handle);
  if (!products.length) notFound();
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="h-[60px] sm:h-[84px]" />
      <div className="max-w-7xl mx-auto pt-2 sm:pt-4">
        <h1 className="px-4 sm:px-6 lg:px-8 mb-2 text-sm font-bold uppercase">{collectionName(handle)}</h1>
        <CategoryNav active={handle} />
      </div>
      <ProductGrid products={products} country="CA" selectedCollection={handle} />
      <Footer />
    </div>
  );
}
