// app/layout.tsx
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';
import { League_Spartan, Inter } from 'next/font/google';
import Header from '@/components/Header';
import CartModal from '@/components/Cartmodal';
import NextTopLoader from 'nextjs-toploader';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({ subsets: ["latin"] });

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-league-spartan',
});

export const metadata: Metadata = {
  ...(process.env.VERCEL_ENV === 'preview' ? { robots: { index: false, follow: true } } : {}),
  metadataBase: new URL(SITE_URL),
  title: { default: 'Capella Fits | Graphic Streetwear & Everyday Clothing', template: '%s | Capella Fits' },
  description: 'Discover Capella Fits graphic T-shirts, statement shirts, waffle tops, hoodies, cargo pants and denim. From stars to streets.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${leagueSpartan.variable} antialiased bg-white`}
      >
        <NextTopLoader color="#000000" height={2} showSpinner={false} />

        {/* Header with Suspense */}
        <Header />

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
