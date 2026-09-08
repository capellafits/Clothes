import { pageMetadata } from '@/lib/seo';
import Footer from '@/components/Footer'
import WishlistContent from '@/components/Wishlistcontent';
import { fetchAllProducts } from '@/lib/shopify';

export const metadata = pageMetadata("Favourites", "View your saved Capella Fits products, choose a size and add your favourites to your cart.", "/wishlist", undefined, false);

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const products = await fetchAllProducts('CA');
  return (
  
    <div className="w-full min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      
      <div className="pt-20 sm:pt-28 pb-12">
        <WishlistContent products={products} />
      </div>

      <Footer />
    </div>
  )
}
