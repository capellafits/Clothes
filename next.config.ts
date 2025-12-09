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
        hostname: "2kgqvk-km.myshopify.com", // India Shopify store
      },
      {
        protocol: "https",
        hostname: "q00qiq-p0.myshopify.com", // Global/Canada Shopify store
      }
    ],
  },

  async redirects() {
    return [
      // INDIA checkout
      {
        source: "/checkout/:id",
        has: [
          {
            type: "query",
            key: "country",
            value: "IN",
          },
        ],
        destination:
          "https://2kgqvk-km.myshopify.com/cart/:id",
        permanent: false,
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
