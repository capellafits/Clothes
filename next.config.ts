/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "q00qiq-p0.myshopify.com", // Global/Canada Shopify store
      }
    ],
  },

  async redirects() {
    return [
      // Fix legacy misspelled product URL
      {
        source: "/products/no-appologies",
        destination: "/products/no-apologies",
        permanent: true,
      },


      // CANADA checkout
      {
        source: "/checkout/:id",
        has: [
          {
            type: "query",
            key: "country",
            value: "CA",
          },
        ],
        destination:
          "https://q00qiq-p0.myshopify.com/cart/:id",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
