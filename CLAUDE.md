# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture Overview

This is a **Next.js 16 e-commerce clothing store** (Capella Fits) with multi-region support for India and Canada, using Shopify Storefront API as the backend.

### Multi-Region System

- **Domains**: `capellafits.com` (global/Canada), `in.capellafits.com` (India)
- **Middleware** (`middleware.ts`): Geo-redirects users based on `x-vercel-ip-country` header, maintains `country` query param (IN/CA)
- **Shopify stores**: Two separate stores with region-specific pricing (CAD/INR)
- **Environment variables**: `SHOPIFY_STORE_DOMAIN_CA`, `SHOPIFY_STOREFRONT_TOKEN_CA`, `SHOPIFY_STORE_DOMAIN_IN`, `SHOPIFY_STOREFRONT_TOKEN_IN`

### Data Layer

- **`lib/shopify.ts`**: All Shopify GraphQL queries. Exports `Country` type ("IN" | "CA"), `Product`, `Variant`, `Collection` interfaces. Key functions:
  - `fetchAllProducts(country)` - Get all products
  - `fetchProductByHandle(handle, country)` - Single product
  - `fetchProductsByCollection(handle, country)` - Filter by tag (tshirts, shirts, pants, hoodies)
  - `searchProducts(term, country)` - Search
- **`lib/shopifyCustomer.ts`**: Customer-related Shopify operations

### State Management

- **Zustand** for global state
- **Hooks** (`hooks/`):
  - `useCart.ts` - Cart with localStorage persistence + cross-tab sync
  - `useWishlist.ts` - Wishlist functionality
  - `useAuth.ts` / `useCustomer.ts` - Authentication state
  - `usecartmodel.ts` - Cart modal visibility
  - `usecountry.tsx` - Current country context

### Key Components

- **`components/Header.tsx`**: Main navigation with category product previews
- **`components/Cartmodal.tsx`**: Slide-out cart drawer
- **`components/ProductDetail.tsx`**: Full product page with variants
- **`components/Productcard.tsx`**: Product cards for grids
- **UI primitives in `components/ui/` using Radix UI + CVA (class-variance-authority)

### Routing Structure

- **Product categories**: `/tshirts`, `/shirts`, `/pants`, `/hoddies`, `/shop`, `/collections`
- **Product detail**: `/products/[handle]`
- **Auth**: `/auth/login`, `/auth/signup`
- **API routes**: `/api/auth/*` (login, logout, signup, me), `/api/shopify/checkout`
- **Static pages**: `/Aboutus`, `/Contactus`, `/Returns`, `/Shipping`

### Styling

- **Tailwind CSS v4** with custom CSS variables in `globals.css`
- **tw-animate-css** for animations
- **Framer Motion** for complex animations
- Brand color: beige background `#f5f3ef`

### Checkout Flow

Checkout redirects to appropriate Shopify store based on country query param (configured in `next.config.ts` redirects).
