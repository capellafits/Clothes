import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WishlistContent from '@/components/Wishlistcontent';
import { fetchAllProducts } from '@/lib/shopify';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const products = await fetchAllProducts('CA');
  return (
  
    <div className="w-full min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <Header />
      
      <main className="pt-20 sm:pt-28 pb-12">
        <WishlistContent products={products} />
      </main>

      <Footer />
    </div>
  )
}
