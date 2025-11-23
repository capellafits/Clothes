import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Image Configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.shopifycdn.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // 2. Redirect Configuration (Fixes Checkout 404s)
  async redirects() {
    return [
      // ============================================================
      // 🇮🇳 INDIA STORE REDIRECTS (Host: in.capellafits.com)
      // Target: 2kgqvk-km.myshopify.com
      // ============================================================
      {
        source: '/cart/c/:path*',
        has: [{ type: 'host', value: 'in.capellafits.com' }],
        destination: 'https://2kgqvk-km.myshopify.com/cart/c/:path*',
        permanent: false, 
      },
      {
        source: '/checkouts/:path*',
        has: [{ type: 'host', value: 'in.capellafits.com' }],
        destination: 'https://2kgqvk-km.myshopify.com/checkouts/:path*',
        permanent: false,
      },

      // ============================================================
      // 🇨🇦 CANADA/GLOBAL STORE REDIRECTS (Host: www.capellafits.com)
      // Target: q00qiq-p0.myshopify.com
      // ============================================================
      {
        source: '/cart/c/:path*',
        has: [{ type: 'host', value: 'www.capellafits.com' }],
        destination: 'https://q00qiq-p0.myshopify.com/cart/c/:path*',
        permanent: false, 
      },
      {
        source: '/checkouts/:path*',
        has: [{ type: 'host', value: 'www.capellafits.com' }],
        destination: 'https://q00qiq-p0.myshopify.com/checkouts/:path*',
        permanent: false,
      },

      // ============================================================
      // 🌍 FALLBACK (For localhost or other domains) -> Default to Canada
      // ============================================================
      {
        source: '/cart/c/:path*',
        destination: 'https://q00qiq-p0.myshopify.com/cart/c/:path*',
        permanent: false, 
      },
      {
        source: '/checkouts/:path*',
        destination: 'https://q00qiq-p0.myshopify.com/checkouts/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

