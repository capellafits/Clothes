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


      // Shopify's checkout and legacy storefront links use Shopify's own URL
      // conventions, none of which exist here, so shoppers coming back from
      // checkout hit a 404. Map them onto this storefront's routes.
      // The cart is a modal rather than a page; ?cart=open makes it appear.
      {
        source: "/cart",
        destination: "/?cart=open",
        permanent: false,
      },
      {
        source: "/account/login",
        destination: "/auth/login",
        permanent: false,
      },
      {
        source: "/account/register",
        destination: "/auth/signup",
        permanent: false,
      },
      {
        source: "/account",
        destination: "/auth/login",
        permanent: false,
      },
      {
        source: "/account/:path*",
        destination: "/auth/login",
        permanent: false,
      },
      {
        source: "/policies/refund-policy",
        destination: "/Returns",
        permanent: true,
      },
      {
        source: "/policies/shipping-policy",
        destination: "/Shipping",
        permanent: true,
      },
      {
        source: "/policies/privacy-policy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/policies/terms-of-service",
        destination: "/terms-of-service",
        permanent: true,
      },
      {
        source: "/policies/contact-information",
        destination: "/Contactus",
        permanent: true,
      },
      {
        source: "/pages/contact",
        destination: "/Contactus",
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
