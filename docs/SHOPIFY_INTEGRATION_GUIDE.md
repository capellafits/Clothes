# Shopify Storefront API Integration Guide

> **Purpose**: This comprehensive documentation enables LLMs and developers to implement an identical Shopify Storefront API integration in any Next.js application. It covers all aspects: authentication, data fetching, GraphQL queries, type definitions, cart operations, metaobjects, and best practices.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Environment Configuration](#2-environment-configuration)
3. [Core Fetch Functions](#3-core-fetch-functions)
4. [GraphQL Fragments](#4-graphql-fragments)
5. [Product Operations](#5-product-operations)
6. [Collection Operations](#6-collection-operations)
7. [Cart Operations](#7-cart-operations)
8. [Metaobjects & Metafields](#8-metaobjects--metafields)
9. [Type Definitions](#9-type-definitions)
10. [Data Reshaping Utilities](#10-data-reshaping-utilities)
11. [Caching Strategy](#11-caching-strategy)
12. [Error Handling](#12-error-handling)
13. [File Structure](#13-file-structure)
14. [Implementation Checklist](#14-implementation-checklist)

---

## 1. Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js Application                       │
├─────────────────────────────────────────────────────────────────┤
│  Components (Client)          │  Server Components/Actions       │
│  ├── CartContext              │  ├── server.ts (cached queries)  │
│  ├── ProductStoreContext      │  ├── actions.ts (mutations)      │
│  └── MetaobjectsStoreContext  │  └── API Routes (/api/cart/*)    │
├─────────────────────────────────────────────────────────────────┤
│                     lib/shopify/ (Core Layer)                    │
│  ├── index.ts       - Main fetch functions & reshaping          │
│  ├── server.ts      - Cached server-side operations             │
│  ├── types.ts       - TypeScript type definitions               │
│  ├── fragments/     - GraphQL fragments                         │
│  ├── queries/       - GraphQL queries                           │
│  └── mutations/     - GraphQL mutations                         │
├─────────────────────────────────────────────────────────────────┤
│                    Shopify Storefront API                        │
│  Endpoint: https://{store}.myshopify.com/api/2023-01/graphql.json│
└─────────────────────────────────────────────────────────────────┘
```

### Two API Types Used

1. **Storefront API** (Public, customer-facing)
   - Authentication: `X-Shopify-Storefront-Access-Token`
   - Endpoint: `/api/2023-01/graphql.json`
   - Used for: Products, Collections, Cart, Checkout

2. **Admin API** (Private, internal operations)
   - Authentication: `X-Shopify-Access-Token`
   - Endpoint: `/admin/api/2024-01/graphql.json`
   - Used for: Metaobjects, File Resolution, Admin data

---

## 2. Environment Configuration

### Required Environment Variables

```env
# .env.local

# Required - Shopify Store Domain
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com

# Required - Storefront API Access Token (public)
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token

# Required for Admin operations - Admin API Access Token (private)
SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-access-token

# Optional - Webhook validation secret
SHOPIFY_REVALIDATION_SECRET=your-revalidation-secret

# Optional - Public client-side variables
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_CURRENCY=USD
NEXT_PUBLIC_SHOPIFY_SHOP_ID=your-shop-id
```

### Constants Configuration

```typescript
// lib/constants.ts
export const SHOPIFY_GRAPHQL_API_ENDPOINT = '/api/2023-01/graphql.json';

export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart',
};

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
export const DEFAULT_OPTION = 'Default Title';
```

### Environment Validation

```typescript
// lib/utils.ts
export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    'SHOPIFY_STORE_DOMAIN',
    'SHOPIFY_STOREFRONT_ACCESS_TOKEN'
  ];

  const missingEnvironmentVariables: string[] = [];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing: ${missingEnvironmentVariables.join(', ')}. ` +
      'Please add them to your .env.local file.'
    );
  }

  // Validate domain format
  if (
    process.env.SHOPIFY_STORE_DOMAIN?.includes('[') ||
    process.env.SHOPIFY_STORE_DOMAIN?.includes(']')
  ) {
    throw new Error(
      'Your SHOPIFY_STORE_DOMAIN environment variable includes brackets. ' +
      'Please remove them and use just the domain name.'
    );
  }
};
```

---

## 3. Core Fetch Functions

### Storefront API Fetch Function

```typescript
// lib/shopify/index.ts

import { SHOPIFY_GRAPHQL_API_ENDPOINT } from '../constants';
import { isShopifyError } from '../type-guards';

type ExtractVariables<T> = T extends { variables: object }
  ? T['variables']
  : never;

// Helper to ensure domain starts with https://
const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

// Configuration
const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://')
  : '';
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

/**
 * Main Shopify Storefront API fetch function
 * Used for all public customer-facing operations
 */
export async function shopifyFetch<T>({
  headers,
  query,
  variables
}: {
  headers?: HeadersInit;
  query: string;
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      })
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query
      };
    }

    throw {
      error: e,
      query
    };
  }
}
```

### Admin API Fetch Function

```typescript
// lib/shopify/index.ts (continued)

const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
const adminEndpoint = `${domain}/admin/api/2024-01/graphql.json`;

/**
 * Shopify Admin API fetch function
 * Used for metaobjects, file resolution, and admin operations
 */
export async function shopifyAdminFetch<T>({
  headers,
  query,
  variables
}: {
  headers?: HeadersInit;
  query: string;
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(adminEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminAccessToken,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      })
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query
      };
    }

    throw {
      error: e,
      query
    };
  }
}
```

---

## 4. GraphQL Fragments

### Image Fragment

```typescript
// lib/shopify/fragments/image.ts
export const imageFragment = /* GraphQL */ `
  fragment image on Image {
    url
    altText
    width
    height
  }
`;
```

### SEO Fragment

```typescript
// lib/shopify/fragments/seo.ts
export const seoFragment = /* GraphQL */ `
  fragment seo on SEO {
    description
    title
  }
`;
```

### Product Fragment (Full)

```typescript
// lib/shopify/fragments/product.ts
import { imageFragment } from './image';
import { seoFragment } from './seo';

export const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    metafields(
      identifiers: [
        { namespace: "custom", key: "product_aesthetic_media" },
        { namespace: "custom", key: "accessories_extended_info" },
        { namespace: "custom", key: "hero_section_landing_media_desktop" },
        { namespace: "custom", key: "hero_section_landing_media_mobile" },
        { namespace: "custom", key: "exit_section_media_mobile" },
        { namespace: "custom", key: "exit_section_media_desktop" },
        { namespace: "custom", key: "product_assembly_guide_pdf" },
        { namespace: "custom", key: "product_assembly_guide_video" },
        { namespace: "custom", key: "product_usage_guide_manual" },
        { namespace: "custom", key: "product_usage_guide_video" },
        { namespace: "custom", key: "product_popularity_tag" },
        { namespace: "custom", key: "preorder_popup" }
      ]
    ) {
      namespace
      key
      type
      value
      references(first: 20) {
        edges {
          node {
            __typename
            ... on MediaImage {
              image {
                ...image
              }
            }
            ... on Video {
              id
              sources {
                url
                mimeType
              }
            }
          }
        }
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          metafields(
            identifiers: [
              { namespace: "custom", key: "media" },
              { namespace: "custom", key: "primary_color" },
              { namespace: "custom", key: "pre_order" },
              { namespace: "custom", key: "pre_order_delivery_date" },
              { namespace: "custom", key: "offer" },
              { namespace: "custom", key: "product_aesthetic_media" },
              { namespace: "custom", key: "accent_color" },
              { namespace: "custom", key: "configurator_image" },
              { namespace: "custom", key: "store_media_card_new" },
              { namespace: "custom", key: "preorder_popup" },
              { namespace: "custom", key: "configurator_image_mobile" }
            ]
          ) {
            namespace
            key
            type
            value
            reference {
              __typename
              ... on MediaImage {
                image {
                  ...image
                }
              }
              ... on Video {
                id
                sources {
                  url
                  mimeType
                }
              }
              ... on GenericFile {
                id
                url
                mimeType
              }
              ... on Metaobject {
                id
                type
                fields {
                  key
                  value
                }
              }
            }
            references(first: 20) {
              edges {
                node {
                  __typename
                  ... on MediaImage {
                    image {
                      ...image
                    }
                  }
                  ... on Video {
                    id
                    sources {
                      url
                      mimeType
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
  }
  ${imageFragment}
  ${seoFragment}
`;
```

### Cart Fragment

```typescript
// lib/shopify/fragments/cart.ts
import { productFragment } from './product';

export const cartFragment = /* GraphQL */ `
  fragment cart on Cart {
    id
    checkoutUrl
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                ...product
              }
            }
          }
        }
      }
    }
    totalQuantity
  }
  ${productFragment}
`;
```

---

## 5. Product Operations

### Product Queries

```typescript
// lib/shopify/queries/product.ts
import { productFragment } from '../fragments/product';

// Get single product by handle
export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;

// Get multiple products with sorting and filtering
export const getProductsQuery = /* GraphQL */ `
  query getProducts($sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(sortKey: $sortKey, reverse: $reverse, query: $query, first: 100) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;

// Get product recommendations
export const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...product
    }
  }
  ${productFragment}
`;

// Get collections that a product belongs to
export const getProductCollectionsQuery = /* GraphQL */ `
  query ProductCollections($handle: String!) {
    productByHandle(handle: $handle) {
      collections(first: 10) {
        edges {
          node {
            handle
            title
          }
        }
      }
    }
  }
`;
```

### Product Server Functions

```typescript
// lib/shopify/server.ts
'use cache';

import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache';
import { shopifyFetch } from './index';
import { TAGS, HIDDEN_PRODUCT_TAG } from '../constants';
import type { Product, ShopifyProductOperation, ShopifyProductsOperation } from './types';

export async function getProduct(handle: string): Promise<Product | undefined> {
  cacheTag(TAGS.products);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    variables: { handle }
  });

  return reshapeProduct(res.body.data.product, false);
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
} = {}): Promise<Product[]> {
  cacheTag(TAGS.products);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    variables: {
      query,
      reverse,
      sortKey
    }
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  cacheTag(TAGS.products);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    variables: { productId }
  });

  return reshapeProducts(res.body.data.productRecommendations);
}
```

---

## 6. Collection Operations

### Collection Queries

```typescript
// lib/shopify/queries/collection.ts
import { productFragment } from '../fragments/product';
import { seoFragment } from '../fragments/seo';

const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    handle
    title
    description
    seo {
      ...seo
    }
    updatedAt
  }
  ${seoFragment}
`;

// Get single collection
export const getCollectionQuery = /* GraphQL */ `
  query getCollection($handle: String!) {
    collection(handle: $handle) {
      ...collection
    }
  }
  ${collectionFragment}
`;

// Get all collections
export const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    collections(first: 100, sortKey: TITLE) {
      edges {
        node {
          ...collection
        }
      }
    }
  }
  ${collectionFragment}
`;

// Get products in a collection with sorting
export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      products(sortKey: $sortKey, reverse: $reverse, first: 100) {
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`;
```

### Collection Server Functions

```typescript
// lib/shopify/server.ts (continued)

export async function getCollection(
  handle: string
): Promise<Collection | undefined> {
  cacheTag(TAGS.collections);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    variables: { handle }
  });

  return reshapeCollection(res.body.data.collection);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
    }
  });

  if (!res.body.data.collection) {
    return [];
  }

  return reshapeProducts(
    removeEdgesAndNodes(res.body.data.collection.products)
  );
}

export async function getCollections(): Promise<Collection[]> {
  cacheTag(TAGS.collections);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery
  });

  const shopifyCollections = removeEdgesAndNodes(res.body.data.collections);

  // Add synthetic "All" collection
  const collections = [
    {
      handle: '',
      title: 'All',
      description: 'All products',
      seo: { title: 'All', description: 'All products' },
      path: '/search',
      updatedAt: new Date().toISOString()
    },
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith('hidden')
    )
  ];

  return collections;
}
```

---

## 7. Cart Operations

### Cart Queries

```typescript
// lib/shopify/queries/cart.ts
import { cartFragment } from '../fragments/cart';

export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${cartFragment}
`;
```

### Cart Mutations

```typescript
// lib/shopify/mutations/cart.ts
import { cartFragment } from '../fragments/cart';

export const createCartMutation = /* GraphQL */ `
  mutation createCart($lineItems: [CartLineInput!]) {
    cartCreate(input: { lines: $lineItems }) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

export const addToCartMutation = /* GraphQL */ `
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

export const editCartItemsMutation = /* GraphQL */ `
  mutation editCartItems($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

export const removeFromCartMutation = /* GraphQL */ `
  mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;
```

### Cart Functions

```typescript
// lib/shopify/index.ts (continued)
import { cookies } from 'next/headers';

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation
  });

  const cart = res.body.data.cartCreate.cart;
  if (!cart) {
    throw new Error('Failed to create cart - Shopify returned null');
  }

  return reshapeCart(cart);
}

export async function getCart(): Promise<Cart | undefined> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get('cartId')?.value;

  if (!cartId) return undefined;

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId }
  });

  if (!res.body.data.cart) return undefined;

  return reshapeCart(res.body.data.cart);
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get('cartId')?.value;

  if (!cartId) {
    throw new Error('Missing cartId cookie');
  }

  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: { cartId, lines }
  });

  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get('cartId')?.value;

  if (!cartId) {
    throw new Error('Missing cartId cookie');
  }

  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: { cartId, lines }
  });

  const cart = res.body.data.cartLinesUpdate.cart;
  if (!cart) {
    return createCart();
  }

  return reshapeCart(cart);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get('cartId')?.value;

  if (!cartId) {
    throw new Error('Missing cartId cookie');
  }

  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: { cartId, lineIds }
  });

  const cart = res.body.data.cartLinesRemove.cart;
  if (!cart) {
    return createCart();
  }

  return reshapeCart(cart);
}
```

### Cart API Routes

```typescript
// app/api/cart/create/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createCart } from '@/lib/shopify';

export async function POST() {
  const cart = await createCart();
  const cookieStore = await cookies();

  cookieStore.set('cartId', cart.id!, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/'
  });

  return NextResponse.json({ status: 'created', cartId: cart.id });
}

// app/api/cart/add/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addToCart } from '@/lib/shopify';

export async function POST(req: NextRequest) {
  const { lines } = await req.json();
  const cart = await addToCart(lines);
  return NextResponse.json(cart);
}

// app/api/cart/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateCart } from '@/lib/shopify';

export async function POST(req: NextRequest) {
  const { lines } = await req.json();

  // Retry logic for concurrent cart updates
  const maxRetries = 3;
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const cart = await updateCart(lines);
      return NextResponse.json(cart);
    } catch (error: any) {
      const isConflict =
        error?.extensions?.code === 'CONFLICT' ||
        error?.message?.includes('Cart changed');

      if (isConflict && attempt < maxRetries - 1) {
        await new Promise(r => setTimeout(r, 100 * Math.pow(2, attempt)));
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  return NextResponse.json({ error: 'Conflict' }, { status: 409 });
}

// app/api/cart/remove/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { removeFromCart } from '@/lib/shopify';

export async function POST(req: NextRequest) {
  const { lineIds } = await req.json();
  const cart = await removeFromCart(lineIds);
  return NextResponse.json(cart);
}
```

### Cart Context (Client-Side State)

```typescript
// components/cart/cart-context.tsx
'use client';

import { createContext, useContext, useReducer, useEffect, use } from 'react';
import type { Cart, Product, ProductVariant } from '@/lib/shopify/types';

type UpdateType = 'plus' | 'minus' | 'delete';

type CartContextType = {
  cart: Cart | undefined;
  updateCartItem: (merchandiseId: string, updateType: UpdateType) => void;
  addCartItem: (variant: ProductVariant, product: Product) => void;
  addCartItems: (lines: { variant: ProductVariant; product: Product }[]) => void;
  removeCartItem: (variant: ProductVariant, product: Product) => void;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// API functions
const apiAddToCart = async (lines: { merchandiseId: string; quantity: number }[]) =>
  fetch('/api/cart/add', { method: 'POST', body: JSON.stringify({ lines }) });

const apiRemoveFromCart = async (lineIds: string[]) =>
  fetch('/api/cart/remove', { method: 'POST', body: JSON.stringify({ lineIds }) });

const apiUpdateCart = async (lines: { id: string; merchandiseId: string; quantity: number }[]) =>
  fetch('/api/cart/update', { method: 'POST', body: JSON.stringify({ lines }) });

// Reducer
type CartAction =
  | { type: 'UPDATE_ITEM'; merchandiseId: string; updateType: UpdateType }
  | { type: 'ADD_ITEM'; variant: ProductVariant; product: Product }
  | { type: 'ADD_ITEMS'; lines: { variant: ProductVariant; product: Product }[] }
  | { type: 'REMOVE_ITEM'; variant: ProductVariant; product: Product }
  | { type: 'REPLACE_CART'; cart: Cart };

function cartReducer(state: Cart | undefined, action: CartAction): Cart | undefined {
  // Implementation of state updates
  switch (action.type) {
    case 'UPDATE_ITEM':
      // Update quantity or remove item
      return state;
    case 'ADD_ITEM':
      // Add new item or increment quantity
      return state;
    case 'ADD_ITEMS':
      // Bulk add items
      return state;
    case 'REMOVE_ITEM':
      // Remove specific item
      return state;
    case 'REPLACE_CART':
      return action.cart;
    default:
      return state;
  }
}

export function CartProvider({
  children,
  cartPromise = Promise.resolve(undefined)
}: {
  children: React.ReactNode;
  cartPromise?: Promise<Cart | undefined>;
}) {
  const initialCart = use(cartPromise);
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  const [isLoading, setIsLoading] = useState(false);

  const updateCartItem = (merchandiseId: string, updateType: UpdateType) => {
    dispatch({ type: 'UPDATE_ITEM', merchandiseId, updateType });
    // Call API asynchronously
  };

  const addCartItem = (variant: ProductVariant, product: Product) => {
    dispatch({ type: 'ADD_ITEM', variant, product });
    apiAddToCart([{ merchandiseId: variant.id, quantity: 1 }]);
  };

  const addCartItems = (lines: { variant: ProductVariant; product: Product }[]) => {
    dispatch({ type: 'ADD_ITEMS', lines });
    apiAddToCart(lines.map(l => ({ merchandiseId: l.variant.id, quantity: 1 })));
  };

  const removeCartItem = (variant: ProductVariant, product: Product) => {
    dispatch({ type: 'REMOVE_ITEM', variant, product });
    // Find lineId and call apiRemoveFromCart
  };

  return (
    <CartContext.Provider value={{
      cart,
      updateCartItem,
      addCartItem,
      addCartItems,
      removeCartItem,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
```

---

## 8. Metaobjects & Metafields

### Metaobject Type Definitions

```typescript
// lib/shopify/metaobjects.ts

export const METAOBJECT_TYPES = [
  'homepage_landing_media',
  'loved_by_professional',
  'sales_strip_v2',
  'general_offer',
  'homepage',
  'store_page',
  'sale_central_box',
  'coupon_payment',
  'sales_strip',
  'reviews_page',
  'homepage_landing_section_2'
] as const;

export type MetaobjectType = (typeof METAOBJECT_TYPES)[number];

export const METAOBJECT_HANDLES: Record<MetaobjectType, string> = {
  homepage_landing_media: 'homepage-landing-media',
  sales_strip_v2: 'product-sales-strip',
  general_offer: '5-percent-discount',
  homepage: '',
  store_page: 'store-page-ccwgd0nc',
  sale_central_box: 'general-sale',
  coupon_payment: 'coupon-payment-wbgfoalm',
  sales_strip: 'winter-sale',
  reviews_page: 'source',
  homepage_landing_section_2: 'homepage-landing-section-rotation',
  loved_by_professional: 'loved-by-professional-l6epvsas'
};

export type MetaobjectData = Record<string, any>;
export type MetaobjectsMap = { [K in MetaobjectType]?: MetaobjectData };

export function isValidMetaobjectType(type: string): type is MetaobjectType {
  return METAOBJECT_TYPES.includes(type as MetaobjectType);
}
```

### Metaobject Fetching (Admin API)

```typescript
// lib/admin/index.ts
import { shopifyAdminFetch } from '@/lib/shopify';

// Cache for metaobjects (30 minute TTL)
const metaobjectCache: Map<string, { data: any; timestamp: number }> = new Map();
const CACHE_TTL = 30 * 60 * 1000;

export async function getMetaobject(
  handle: string,
  type: string
): Promise<any | null> {
  const cacheKey = `${type}:${handle}`;
  const cached = metaobjectCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const query = /* GraphQL */ `
    query GetMetaobject($handle: String!, $type: String!) {
      metaobjectByHandle(handle: { handle: $handle, type: $type }) {
        id
        handle
        type
        fields {
          key
          type
          value
          reference {
            __typename
            ... on Metaobject {
              id
              type
              fields {
                key
                type
                value
                reference {
                  __typename
                  ... on MediaImage {
                    image {
                      url
                      altText
                      width
                      height
                    }
                  }
                  ... on Video {
                    id
                    sources {
                      url
                      mimeType
                    }
                  }
                }
              }
            }
            ... on MediaImage {
              image {
                url
                altText
                width
                height
              }
            }
            ... on Video {
              id
              sources {
                url
                mimeType
              }
            }
          }
          references(first: 250) {
            edges {
              node {
                __typename
                ... on Metaobject {
                  id
                  type
                  fields {
                    key
                    type
                    value
                  }
                }
                ... on MediaImage {
                  image {
                    url
                    altText
                    width
                    height
                  }
                }
                ... on Video {
                  id
                  sources {
                    url
                    mimeType
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await shopifyAdminFetch<any>({
    query,
    variables: { handle, type }
  });

  const metaobject = res.body.data?.metaobjectByHandle;
  if (!metaobject) return null;

  const parsed = parseMetaobjectFields(metaobject.fields);

  metaobjectCache.set(cacheKey, { data: parsed, timestamp: Date.now() });

  return parsed;
}

// Parse metaobject fields into structured data
function parseMetaobjectFields(fields: any[]): Record<string, any> {
  const result: Record<string, any> = {};

  for (const field of fields) {
    let value: any;

    // Try to parse JSON value
    try {
      value = JSON.parse(field.value);
    } catch {
      value = field.value;
    }

    // Handle single reference
    if (field.reference) {
      if (field.reference.fields) {
        // Nested metaobject
        value = parseMetaobjectFields(field.reference.fields);
      } else if (field.reference.image?.url) {
        // MediaImage
        value = field.reference.image.url;
      } else if (field.reference.sources?.[0]?.url) {
        // Video
        value = field.reference.sources[0].url;
      }
    }

    // Handle list references
    if (field.references?.edges?.length) {
      value = field.references.edges.map((edge: any) => {
        const node = edge.node;
        if (node.fields) {
          return parseMetaobjectFields(node.fields);
        } else if (node.image?.url) {
          return node.image.url;
        } else if (node.sources?.[0]?.url) {
          return node.sources[0].url;
        }
        return node;
      });
    }

    result[field.key] = value;
  }

  return result;
}
```

### File ID Resolution (Admin API)

```typescript
// lib/admin/index.ts (continued)

export async function resolveFileIds(
  fileIds: string[]
): Promise<Map<string, string>> {
  const urlMap = new Map<string, string>();
  if (!fileIds.length) return urlMap;

  // Separate by type
  const regularFiles: string[] = [];
  const mediaImages: string[] = [];
  const videos: string[] = [];

  for (const id of fileIds) {
    if (id.includes('MediaImage')) {
      mediaImages.push(id);
    } else if (id.includes('Video')) {
      videos.push(id);
    } else {
      regularFiles.push(id);
    }
  }

  // Build dynamic query
  let query = 'query ResolveFiles {';

  regularFiles.forEach((id, i) => {
    query += `file${i}: file(id: "${id}") { id, url }`;
  });

  mediaImages.forEach((id, i) => {
    query += `media${i}: node(id: "${id}") {
      ... on MediaImage { image { url altText width height } }
    }`;
  });

  videos.forEach((id, i) => {
    query += `video${i}: node(id: "${id}") {
      ... on Video { sources { url mimeType } }
    }`;
  });

  query += '}';

  const res = await shopifyAdminFetch<any>({ query });
  const data = res.body.data;

  // Extract URLs
  regularFiles.forEach((id, i) => {
    if (data[`file${i}`]?.url) {
      urlMap.set(id, data[`file${i}`].url);
    }
  });

  mediaImages.forEach((id, i) => {
    if (data[`media${i}`]?.image?.url) {
      urlMap.set(id, data[`media${i}`].image.url);
    }
  });

  videos.forEach((id, i) => {
    if (data[`video${i}`]?.sources?.[0]?.url) {
      urlMap.set(id, data[`video${i}`].sources[0].url);
    }
  });

  return urlMap;
}
```

### Metafield Utility Functions

```typescript
// lib/configurator/metafield-utils.ts

export function getValidMetafields(variant: ProductVariant) {
  return variant.metafields?.filter(Boolean) || [];
}

export function findMetafield(
  variant: ProductVariant,
  namespace: string,
  key: string
) {
  return getValidMetafields(variant).find(
    (m) => m.namespace === namespace && m.key === key
  );
}

export function getPreorderFlag(variant: ProductVariant): boolean {
  const metafield = findMetafield(variant, 'custom', 'pre_order') ||
                    findMetafield(variant, 'custom', 'preorder');

  if (!metafield) return false;

  const value = metafield.value;
  return value === true || value === 'true' || value === '1';
}

export function getPreorderDeliveryDate(variant: ProductVariant): string | null {
  const metafield = findMetafield(variant, 'custom', 'pre_order_delivery_date');
  return metafield?.value || null;
}

export function getOfferData(variant: ProductVariant) {
  const metafield = findMetafield(variant, 'custom', 'offer');

  if (!metafield?.reference?.fields) {
    return { offerName: null, offerPercentage: null, saleBannerText: null };
  }

  const fields = metafield.reference.fields;
  const findField = (keys: string[]) =>
    fields.find((f: any) => keys.includes(f.key))?.value;

  return {
    offerName: findField(['variant_offer_name', 'name']),
    offerPercentage: findField(['off_percentage', 'percentage']),
    saleBannerText: findField(['sale_banner_text'])
  };
}

export function getVariantFeaturedImage(variant: ProductVariant): string | undefined {
  const metafield = findMetafield(variant, 'custom', 'media');

  if (!metafield?.references?.edges?.length) return undefined;

  const firstMedia = metafield.references.edges[0]?.node;
  if (firstMedia?.__typename === 'MediaImage') {
    return firstMedia.image?.url;
  }

  return undefined;
}

export function getConfiguratorImageUrl(
  variant: ProductVariant,
  fallbackUrl?: string
): string | undefined {
  const metafield = findMetafield(variant, 'custom', 'configurator_image');
  return metafield?.reference?.image?.url || fallbackUrl;
}
```

---

## 9. Type Definitions

### Core Types

```typescript
// lib/shopify/types.ts

// Generic utility types
export type Maybe<T> = T | null;

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

// Money type
export type Money = {
  amount: string;
  currencyCode: string;
};

// Image type
export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

// SEO type
export type SEO = {
  title: string;
  description: string;
};

// Media reference type (union)
export type MediaReference =
  | {
      __typename: 'MediaImage';
      image: {
        url: string;
        altText?: string | null;
        width?: number;
        height?: number;
      };
    }
  | {
      __typename: 'Video';
      id: string;
      sources: {
        url: string;
        mimeType: string;
      }[];
    };

// Product option type
export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

// Product variant type
export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
  featuredImage?: Image;
  metafields?: {
    namespace: string;
    key: string;
    type: string;
    value: string;
    reference?: {
      __typename: string;
      image?: {
        url: string;
        altText?: string | null;
      };
      fields?: Array<{ key: string; value: string }>;
    };
    references?: {
      edges: {
        node: MediaReference;
      }[];
    };
  }[];
};

// Shopify Product (raw from API)
export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  seo: SEO;
  tags: string[];
  updatedAt: string;
  metafields: any;
};

// Product (reshaped for app use)
export type Product = Omit<ShopifyProduct, 'variants' | 'images'> & {
  variants: ProductVariant[];
  images: Image[];
  metafields?: {
    namespace: string;
    key: string;
    type: string;
    value: string;
    references?: {
      edges: {
        node: MediaReference;
      }[];
    };
  }[];
};

// Shopify Cart (raw from API)
export type ShopifyCart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<CartItem>;
  totalQuantity: number;
};

// Cart (reshaped for app use)
export type Cart = Omit<ShopifyCart, 'lines'> & {
  lines: CartItem[];
};

// Cart item type
export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: CartProduct;
  };
};

// Cart product (simplified product in cart)
export type CartProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: Image;
  metafields: {
    namespace: string;
    key: string;
    type: string;
    value: string;
  }[];
  variants: ProductVariant[];
  images: Image[];
  seo: SEO;
  tags: string[];
  updatedAt: string;
  availableForSale: boolean;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
};

// Shopify Collection (raw from API)
export type ShopifyCollection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
};

// Collection (reshaped for app use)
export type Collection = ShopifyCollection & {
  path: string;
};

// Menu type
export type Menu = {
  title: string;
  path: string;
};

// Page type
export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};
```

### Operation Types (GraphQL)

```typescript
// lib/shopify/types.ts (continued)

// Cart operations
export type ShopifyCartOperation = {
  data: { cart: ShopifyCart };
  variables: { cartId: string };
};

export type ShopifyCreateCartOperation = {
  data: { cartCreate: { cart: ShopifyCart } };
};

export type ShopifyAddToCartOperation = {
  data: { cartLinesAdd: { cart: ShopifyCart } };
  variables: {
    cartId: string;
    lines: { merchandiseId: string; quantity: number }[];
  };
};

export type ShopifyRemoveFromCartOperation = {
  data: { cartLinesRemove: { cart: ShopifyCart } };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};

export type ShopifyUpdateCartOperation = {
  data: { cartLinesUpdate: { cart: ShopifyCart } };
  variables: {
    cartId: string;
    lines: { id: string; merchandiseId: string; quantity: number }[];
  };
};

// Collection operations
export type ShopifyCollectionOperation = {
  data: { collection: ShopifyCollection };
  variables: { handle: string };
};

export type ShopifyCollectionProductsOperation = {
  data: {
    collection: {
      products: Connection<ShopifyProduct>;
    };
  };
  variables: {
    handle: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type ShopifyCollectionsOperation = {
  data: { collections: Connection<ShopifyCollection> };
};

// Product operations
export type ShopifyProductOperation = {
  data: { product: ShopifyProduct };
  variables: { handle: string };
};

export type ShopifyProductsOperation = {
  data: { products: Connection<ShopifyProduct> };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type ShopifyProductRecommendationsOperation = {
  data: { productRecommendations: ShopifyProduct[] };
  variables: { productId: string };
};

export type ShopifyProductCollectionsOperation = {
  variables: { handle: string };
  data: {
    productByHandle: {
      collections: {
        edges: { node: { handle: string; title: string } }[];
      };
    } | null;
  };
};

// Menu operation
export type ShopifyMenuOperation = {
  data: {
    menu?: {
      items: { title: string; url: string }[];
    };
  };
  variables: { handle: string };
};

// Page operations
export type ShopifyPageOperation = {
  data: { pageByHandle: Page };
  variables: { handle: string };
};

export type ShopifyPagesOperation = {
  data: { pages: Connection<Page> };
};
```

### Error Types

```typescript
// lib/type-guards.ts

export interface ShopifyErrorLike {
  status: number;
  message: Error;
  cause?: Error;
}

const isObject = (object: unknown): object is Record<string, unknown> => {
  return typeof object === 'object' && object !== null && !Array.isArray(object);
};

const findError = <T extends object>(error: T): boolean => {
  if (Object.prototype.toString.call(error) === '[object Error]') {
    return true;
  }

  const prototype = Object.getPrototypeOf(error) as T | null;

  return prototype === null ? false : findError(prototype);
};

export const isShopifyError = (error: unknown): error is ShopifyErrorLike => {
  if (!isObject(error)) return false;

  if (error instanceof Error) return true;

  return findError(error);
};
```

---

## 10. Data Reshaping Utilities

```typescript
// lib/shopify/index.ts (continued)

import { HIDDEN_PRODUCT_TAG } from '../constants';

// Extract nodes from GraphQL edges
export const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

// Reshape cart (flatten lines)
const reshapeCart = (cart: ShopifyCart): Cart => {
  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines),
    cost: {
      ...cart.cost,
      totalTaxAmount: cart.cost.totalTaxAmount || { amount: '0', currencyCode: 'USD' }
    }
  };
};

// Reshape collection (add path)
const reshapeCollection = (
  collection: ShopifyCollection
): Collection | undefined => {
  if (!collection) return undefined;

  return {
    ...collection,
    path: `/search/${collection.handle}`
  };
};

// Reshape multiple collections
const reshapeCollections = (collections: ShopifyCollection[]): Collection[] => {
  const reshapedCollections: Collection[] = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);
      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

// Reshape images (add fallback alt text)
const reshapeImages = (images: Connection<Image>, productTitle: string): Image[] => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => ({
    ...image,
    altText: image.altText || `${productTitle} image`
  }));
};

// Reshape product (flatten variants/images, filter hidden)
const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true
): Product | undefined => {
  if (!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants)
  };
};

// Reshape multiple products
const reshapeProducts = (products: ShopifyProduct[]): Product[] => {
  const reshapedProducts: Product[] = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);
      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};
```

---

## 11. Caching Strategy

### Next.js Cache Configuration

```typescript
// lib/shopify/server.ts
'use cache';

import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag
} from 'next/cache';
import { revalidateTag } from 'next/cache';

// Example cached function
export async function getProducts(): Promise<Product[]> {
  cacheTag(TAGS.products);  // Tag for invalidation
  cacheLife('days');        // Cache duration

  // ... fetch logic
}

// Revalidation (triggered by webhooks)
export async function revalidate(req: Request): Promise<Response> {
  const { topic } = await req.json();

  if (topic === 'products/update' || topic === 'products/create' || topic === 'products/delete') {
    revalidateTag(TAGS.products);
  }

  if (topic.startsWith('collections/')) {
    revalidateTag(TAGS.collections);
  }

  return new Response('Revalidated', { status: 200 });
}
```

### Client-Side Caching (Context)

```typescript
// lib/contexts/product-store-context.tsx
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

interface CachedProduct {
  product: Product;
  timestamp: number;
  preloaded: boolean;
}

const productCache: Map<string, CachedProduct> = new Map();

export function getProduct(handle: string): Promise<Product | null> {
  const cached = productCache.get(handle);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return Promise.resolve(cached.product);
  }

  // Fetch and cache
  return fetch(`/api/products/${handle}`)
    .then(res => res.json())
    .then(product => {
      productCache.set(handle, {
        product,
        timestamp: Date.now(),
        preloaded: false
      });
      return product;
    });
}
```

---

## 12. Error Handling

### Error Handling Patterns

```typescript
// Comprehensive error handling in shopifyFetch
export async function shopifyFetch<T>({
  headers,
  query,
  variables
}: {
  headers?: HeadersInit;
  query: string;
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      })
    });

    const body = await result.json();

    // GraphQL-level errors
    if (body.errors) {
      throw body.errors[0];
    }

    return { status: result.status, body };
  } catch (e) {
    // Shopify error detection
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query // Include query for debugging
      };
    }

    throw { error: e, query };
  }
}

// Conflict retry pattern (for cart operations)
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      const isConflict =
        error?.extensions?.code === 'CONFLICT' ||
        error?.message?.includes('Cart changed');

      if (isConflict && attempt < maxRetries - 1) {
        // Exponential backoff: 100ms, 200ms, 400ms
        await new Promise(r => setTimeout(r, 100 * Math.pow(2, attempt)));
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  throw lastError;
}
```

### Higher-Level Function Error Handling

```typescript
// Example: createCart with error handling
export async function createCart(): Promise<Cart> {
  try {
    const res = await shopifyFetch<ShopifyCreateCartOperation>({
      query: createCartMutation
    });

    const cart = res.body.data.cartCreate.cart;
    if (!cart) {
      throw new Error('Failed to create cart - Shopify returned null');
    }

    return reshapeCart(cart);
  } catch (err) {
    console.error('createCart failed:', {
      error: err instanceof Error ? err.message : err
    });
    throw err; // Re-throw for caller to handle
  }
}
```

---

## 13. File Structure

```
lib/
├── shopify/
│   ├── index.ts              # Core fetch functions, reshaping utilities
│   ├── server.ts             # Cached server-side operations
│   ├── types.ts              # TypeScript type definitions
│   ├── metaobjects.ts        # Metaobject type definitions
│   ├── fragments/
│   │   ├── cart.ts           # Cart fragment
│   │   ├── image.ts          # Image fragment
│   │   ├── product.ts        # Product fragment
│   │   └── seo.ts            # SEO fragment
│   ├── queries/
│   │   ├── cart.ts           # Cart queries
│   │   ├── collection.ts     # Collection queries
│   │   ├── menu.ts           # Menu queries
│   │   ├── page.ts           # Page queries
│   │   ├── product.ts        # Product queries
│   │   └── productCollection.ts
│   └── mutations/
│       └── cart.ts           # Cart mutations
├── admin/
│   └── index.ts              # Admin API functions (metaobjects, files)
├── contexts/
│   ├── cart-context.tsx      # Cart state management
│   ├── product-store-context.tsx  # Product caching
│   └── metaobjects-store-context.tsx
├── configurator/
│   └── metafield-utils.ts    # Metafield extraction utilities
├── constants.ts              # App constants
├── type-guards.ts            # Type guard functions
└── utils.ts                  # General utilities

app/
├── api/
│   ├── cart/
│   │   ├── route.ts          # GET cart
│   │   ├── create/route.ts   # POST create cart
│   │   ├── add/route.ts      # POST add to cart
│   │   ├── update/route.ts   # POST update cart
│   │   ├── remove/route.ts   # POST remove from cart
│   │   └── set/route.ts      # POST set cart ID cookie
│   ├── products/
│   │   └── [handle]/route.ts # GET product by handle
│   ├── metaobjects/
│   │   └── [handle]/route.ts # GET metaobject by handle
│   └── revalidate/
│       └── route.ts          # POST webhook revalidation

components/
└── cart/
    ├── cart-context.tsx      # Cart provider & hooks
    ├── actions.ts            # Server actions for cart
    ├── add-to-cart.tsx       # Add to cart button
    ├── delete-item-button.tsx
    ├── edit-item-quantity-button.tsx
    ├── modal.tsx             # Cart sidebar/modal
    └── persist-cart.tsx      # Cart ID persistence
```

---

## 14. Implementation Checklist

### Phase 1: Core Setup
- [ ] Create environment variables (.env.local)
- [ ] Set up lib/constants.ts with API endpoint and tags
- [ ] Create lib/utils.ts with validateEnvironmentVariables()
- [ ] Create lib/type-guards.ts with error type guards

### Phase 2: Type Definitions
- [ ] Create lib/shopify/types.ts with all core types
- [ ] Define operation types for all GraphQL queries/mutations
- [ ] Create metaobject type definitions

### Phase 3: GraphQL Fragments
- [ ] Create lib/shopify/fragments/image.ts
- [ ] Create lib/shopify/fragments/seo.ts
- [ ] Create lib/shopify/fragments/product.ts (with metafields)
- [ ] Create lib/shopify/fragments/cart.ts

### Phase 4: Core Fetch Functions
- [ ] Implement shopifyFetch() for Storefront API
- [ ] Implement shopifyAdminFetch() for Admin API
- [ ] Add reshaping utilities (removeEdgesAndNodes, reshapeCart, etc.)

### Phase 5: Product Operations
- [ ] Create lib/shopify/queries/product.ts
- [ ] Implement getProduct() in server.ts
- [ ] Implement getProducts() in server.ts
- [ ] Implement getProductRecommendations() in server.ts
- [ ] Create API route for product fetching

### Phase 6: Collection Operations
- [ ] Create lib/shopify/queries/collection.ts
- [ ] Implement getCollection() in server.ts
- [ ] Implement getCollections() in server.ts
- [ ] Implement getCollectionProducts() in server.ts

### Phase 7: Cart Operations
- [ ] Create lib/shopify/queries/cart.ts
- [ ] Create lib/shopify/mutations/cart.ts
- [ ] Implement createCart(), getCart(), addToCart(), updateCart(), removeFromCart()
- [ ] Create all cart API routes
- [ ] Implement CartProvider and useCart hook
- [ ] Add cart persistence (cookies)

### Phase 8: Metaobjects
- [ ] Create lib/shopify/metaobjects.ts type definitions
- [ ] Implement getMetaobject() with Admin API
- [ ] Create parseMetaobjectFields() utility
- [ ] Implement resolveFileIds() for media resolution
- [ ] Create API route for metaobject fetching

### Phase 9: Metafield Utilities
- [ ] Create lib/configurator/metafield-utils.ts
- [ ] Implement getPreorderFlag(), getOfferData(), etc.

### Phase 10: Caching & Revalidation
- [ ] Add cache tags to all server functions
- [ ] Implement webhook revalidation endpoint
- [ ] Set up client-side caching contexts

### Phase 11: Error Handling
- [ ] Add comprehensive error handling to all fetch functions
- [ ] Implement retry logic for cart operations
- [ ] Add error logging

### Phase 12: Testing
- [ ] Test all product queries
- [ ] Test all collection queries
- [ ] Test cart flow (create, add, update, remove, checkout)
- [ ] Test metaobject fetching
- [ ] Test error scenarios

---

## Quick Reference

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/cart` | GET | Get current cart |
| `/api/cart/create` | POST | Create new cart |
| `/api/cart/add` | POST | Add items to cart |
| `/api/cart/update` | POST | Update cart items |
| `/api/cart/remove` | POST | Remove items from cart |
| `/api/cart/set` | POST | Set cart ID cookie |
| `/api/products/[handle]` | GET | Get product by handle |
| `/api/metaobjects/[handle]` | GET | Get metaobject by handle |
| `/api/revalidate` | POST | Webhook revalidation |

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SHOPIFY_STORE_DOMAIN` | Yes | Store domain |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Yes | Public API token |
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | For metaobjects | Private API token |
| `SHOPIFY_REVALIDATION_SECRET` | For webhooks | Webhook secret |

### Cache Tags

| Tag | Used For |
|-----|----------|
| `products` | Product queries |
| `collections` | Collection queries |
| `cart` | Cart operations |

---

*This documentation was generated to enable full reproduction of this Shopify Storefront API integration in any Next.js application.*
