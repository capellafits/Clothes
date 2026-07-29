// app/layout.tsx
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono,League_Spartan,Inter } from 'next/font/google';
import Header from '@/components/Header';
import CartModal from '@/components/Cartmodal';
import { fetchAllProducts, type Country } from '@/lib/shopify';
import NextTopLoader from 'nextjs-toploader';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});
const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-league-spartan',
});

export const metadata: Metadata = {
  title: 'Capella - Premium Fashion',
  description: 'Discover premium quality clothing from Capella Fits',
};

// Helper function to filter products by tag
function filterProductsByTag(products: any[], tag: string) {
  if (!tag) return products;
  return products.filter(product =>
    product.tags.some((t: string) => t.toLowerCase() === tag.toLowerCase())
  );
}

// Component to fetch category products
async function HeaderWithProducts() {
  try {
    const country: Country = 'CA';

    const allProducts = await fetchAllProducts(country);

    const tshirtProducts = filterProductsByTag(allProducts, 'tshirt').slice(0, 2);
    const shirtProducts = filterProductsByTag(allProducts, 'shirt').slice(0, 2);
    const pantsProducts = filterProductsByTag(allProducts, 'pants').slice(0, 2);

    return (
      <Header
        categoryProducts={{
          all: allProducts.slice(0, 2),
          'T-Shirts': tshirtProducts,
          'Shirts': shirtProducts,
          'Pants': pantsProducts,
        }}
      />
    );
  } catch (error) {
    console.error('Error fetching products for header:', error);
    return (
      <Header
        categoryProducts={{
          all: [],
          'T-Shirts': [],
          'Shirts': [],
          'Pants': []
        }}
      />
    );
  }
}

function HeaderFallback() {
  return (
    <Header
      categoryProducts={{
        all: [],
        'T-Shirts': [],
        'Shirts': [],
        'Pants': []
      }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${leagueSpartan.variable} antialiased bg-[#f5f3ef]`}
      >
        <NextTopLoader color="#000000" height={2} showSpinner={false} />

        {/* Header with Suspense */}
        <Suspense fallback={<HeaderFallback />}>
          <HeaderWithProducts />
        </Suspense>

        {/* Cart Modal */}
        <CartModal />

        {/* Main Content */}
        <main>{children}</main>

        {/* Klaviyo Onsite Script */}
        <Script
          src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=Y4BGsF"
          strategy="afterInteractive"
        />

        {/* Vercel Web Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
