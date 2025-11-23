import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WishlistContent from '@/components/Wishlistcontent';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default function WishlistPage() {
  return (
  
    <div className="w-full min-h-screen" style={{ backgroundColor: '#F2EFE8' }}>
      <Header />
      
      <main className="pt-32 pb-20">
        <WishlistContent />
      </main>

      <Footer />
    </div>
  )
}
