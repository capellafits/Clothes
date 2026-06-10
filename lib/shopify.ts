export type Country = "IN" | "CA";

export interface Variant {
  id: string;
  size: string;
  cost: number;
  currency: string;
  available: boolean;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: string[];
  variants: Variant[];
  store: Country;
  tags: string[];
  compareAtPrice?: number;
  createdAt?: string;
  productType?: string;
  productDetails?: Record<string, string>;
  careInstructions?: string;
  sizeChart?: string;
  sizeChartTip?: string;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: string | null;
  store: Country;
}

export interface SpecialProductBanner {
  desktopImage: string;
  mobileImage: string;
  alt?: string;
  link?: string;
}

function getShopifyConfig(country: Country) {
  if (country === "CA") {
    return {
      domain: process.env.SHOPIFY_STORE_DOMAIN_CA!,
      token: process.env.SHOPIFY_STOREFRONT_TOKEN_CA!
    };
  }
  return {
    domain: process.env.SHOPIFY_STORE_DOMAIN_IN!,
    token: process.env.SHOPIFY_STOREFRONT_TOKEN_IN!
  };
}

async function shopifyFetch(query: string, variables: any, country: Country) {
  const { domain, token } = getShopifyConfig(country);

  if (!domain || !token) {
    console.error(`Missing Shopify credentials for ${country}`);
    throw new Error(`Missing Shopify credentials for ${country}`);
  }

  try {
    const res = await fetch(`https://${domain}/api/2024-10/graphql.json`, {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error('Shopify API Error:', {
        status: res.status,
        statusText: res.statusText,
        body: txt
      });
      throw new Error(`Shopify fetch failed ${res.status} ${res.statusText}: ${txt}`);
    }

    const json = await res.json();

    if (json.errors) {
      console.error('GraphQL Errors:', json.errors);
      throw new Error(`GraphQL Error: ${json.errors[0]?.message || 'Unknown error'}`);
    }

    if (!json.data) {
      console.error('No data in response:', json);
      throw new Error('No data returned from Shopify API');
    }

    return json;
  } catch (error) {
    console.error('shopifyFetch error:', error);
    throw error;
  }
}

// 🔥 Currency Helper Functions
export function getCurrencySymbol(country: Country): string {
  return country === 'CA' ? '$' : '₹';
}

export function getCurrencyCode(country: Country): string {
  return country === 'CA' ? 'CAD' : 'INR';
}

export function formatPriceWithCurrency(amount: number, country: Country): string {
  const symbol = getCurrencySymbol(country);
  return `${symbol}${amount.toFixed(2)}`;
}

// 🔥 Fetch all products
export async function fetchAllProducts(country: Country): Promise<Product[]> {
  const query = `query GetProducts {
    products(first: 100, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          title
          handle
          descriptionHtml
          tags
          createdAt
          productType
          sizeChart: metafield(namespace: "custom", key: "size_chart") {
            reference {
              ... on MediaImage {
                image {
                  url
                }
              }
            }
          }
          productDetails: metafield(namespace: "custom", key: "product_details") {
            value
          }
          sizeChartTip: metafield(namespace: "custom", key: "size_chart_tip") {
            value
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                compareAtPriceV2 {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    }
  }`;

  try {
    console.log(`📦 Fetching all products for ${country}...`);
    const data = await shopifyFetch(query, {}, country);

    if (!data.data?.products?.edges) {
      console.error('Invalid products data structure:', data);
      return [];
    }

    const products = data.data.products.edges.map((edge: any) => {
      const p = edge.node;
      const firstVariantCompareAt = p.variants.edges[0]?.node.compareAtPriceV2?.amount;

      return {
        id: p.id,
        title: p.title,
        handle: p.handle,
        description: p.descriptionHtml || '',
        images: p.images.edges.map((e: any) => e.node.url),
        variants: p.variants.edges.map((v: any) => ({
          id: v.node.id,
          size: v.node.title,
          cost: parseFloat(v.node.priceV2.amount),
          currency: v.node.priceV2.currencyCode,
          available: v.node.availableForSale,
        })),
        store: country,
        tags: p.tags || [],
        compareAtPrice: firstVariantCompareAt ? parseFloat(firstVariantCompareAt) : undefined,
        createdAt: p.createdAt,
        productType: p.productType || '',
        productDetails: p.productDetails?.value ? JSON.parse(p.productDetails.value)?.product_details : undefined,
        careInstructions: undefined,
        sizeChart: p.sizeChart?.reference?.image?.url,
        sizeChartTip: p.sizeChartTip?.value || undefined,
      } as Product;
    });

    console.log(` Successfully fetched ${products.length} products`);
    return products;
  } catch (error) {
    console.error('fetchAllProducts error:', error);
    return [];
  }
}

//  FIXED: Fetch products by TAG (using Shopify tags)
export async function fetchProductsByCollection(
  collectionHandle: string,
  country: Country,
  limit: number = 100
): Promise<Product[]> {
  const tagMap: { [key: string]: string } = {
    'tshirts': 'tshirt',
    'shirts': 'shirt',
    'pants': 'pants',
    'hoodies': 'hoodies',
    'new-arrivals': 'new-arrivals'
  };

  const tagToFilter = tagMap[collectionHandle];

  try {
    const allProducts = await fetchAllProducts(country);

    if (tagToFilter) {
      return allProducts
        .filter(product => product.tags.some(tag => tag.toLowerCase() === tagToFilter.toLowerCase()))
        .slice(0, limit);
    }

    const query = `query CollectionByHandle($handle: String!) {
      collectionByHandle(handle: $handle) {
        products(first: 100) { edges { node { handle } } }
      }
    }`;
    const data = await shopifyFetch(query, { handle: collectionHandle }, country);
    const edges = data?.data?.collectionByHandle?.products?.edges || [];
    const handleSet = new Set(edges.map((e: { node: { handle: string } }) => e.node.handle));
    if (handleSet.size === 0) return [];
    return allProducts.filter(product => handleSet.has(product.handle)).slice(0, limit);
  } catch (error) {
    console.error(' fetchProductsByCollection error:', error);
    return [];
  }
}

// 🔥 Fetch single product by handle
export async function fetchProductByHandle(
  handle: string,
  country: Country
): Promise<Product | null> {
  const query = `query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      tags
      createdAt
      productType
      sizeChart: metafield(namespace: "custom", key: "size_chart") {
        reference {
          ... on MediaImage {
            image {
              url
            }
          }
        }
      }
      productDetails: metafield(namespace: "custom", key: "product_details") {
        value
      }
      sizeChartTip: metafield(namespace: "custom", key: "size_chart_tip") {
        value
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            priceV2 {
              amount
              currencyCode
            }
            compareAtPriceV2 {
              amount
              currencyCode
            }
            availableForSale
          }
        }
      }
    }
  }`;

  try {
    console.log('🔍 Fetching product:', { handle, country });
    const data = await shopifyFetch(query, { handle }, country);

    if (!data || !data.data) {
      console.error('Invalid response structure:', data);
      return null;
    }

    const p = data.data.productByHandle;

    if (!p) {
      console.log('⚠️ Product not found for handle:', handle);
      return null;
    }

    const firstVariantCompareAt = p.variants?.edges?.[0]?.node?.compareAtPriceV2?.amount;

    const product = {
      id: p.id,
      title: p.title,
      handle: p.handle,
      description: p.descriptionHtml || '',
      images: p.images?.edges?.map((e: any) => e.node.url) || [],
      variants: p.variants?.edges?.map((v: any) => ({
        id: v.node.id,
        size: v.node.title,
        cost: parseFloat(v.node.priceV2.amount),
        currency: v.node.priceV2.currencyCode,
        available: v.node.availableForSale,
      })) || [],
      store: country,
      tags: p.tags || [],
      compareAtPrice: firstVariantCompareAt ? parseFloat(firstVariantCompareAt) : undefined,
      createdAt: p.createdAt,
      productType: p.productType || '',
      productDetails: p.productDetails?.value ? JSON.parse(p.productDetails.value)?.product_details : undefined,
      careInstructions: undefined,
      sizeChart: p.sizeChart?.reference?.image?.url || undefined,
      sizeChartTip: p.sizeChartTip?.value || undefined,
    };

    console.log(` Successfully fetched product: ${p.title}`);
    return product;
  } catch (error) {
    console.error('fetchProductByHandle error:', error);
    return null;
  }
}

// 🔥 Fetch similar products
export async function fetchSimilarProducts(
  product: Product,
  country: Country,
  limit: number = 6
): Promise<Product[]> {
  try {
    const allProducts = await fetchAllProducts(country);

    const similar = allProducts
      .filter(p => p.id !== product.id)
      .map(p => {
        let score = 0;

        if (p.productType && product.productType &&
          p.productType === product.productType) {
          score += 5;
        }

        const matchingTags = p.tags?.filter(tag =>
          product.tags?.includes(tag)
        ).length || 0;
        score += matchingTags;

        return { product: p, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.product);

    console.log(` Found ${similar.length} similar products for "${product.title}"`);
    return similar;
  } catch (error) {
    console.error('fetchSimilarProducts error:', error);
    return [];
  }
}

// 🔥 Fetch all collections
export async function fetchCollections(country: Country): Promise<Collection[]> {
  const query = `query GetCollections {
    collections(first: 50) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
        }
      }
    }
  }`;

  try {
    console.log(`📚 Fetching collections for ${country}...`);
    const data = await shopifyFetch(query, {}, country);

    if (!data.data?.collections?.edges) {
      console.log('⚠️ No collections found');
      return [];
    }

    const collections: Collection[] = data.data.collections.edges.map((edge: any) => {
      const c = edge.node;
      return {
        id: c.id,
        title: c.title,
        handle: c.handle,
        description: c.description,
        image: c.image?.url || null,
        store: country,
      } as Collection;
    });

    console.log(` Found ${collections.length} collections`);
    collections.forEach((collection: Collection) => 
      console.log(`  - ${collection.title} (handle: ${collection.handle})`)
    );
    
    return collections;
  } catch (error) {
    console.error('fetchCollections error:', error);
    return [];
  }
}

//  Calculate discount percentage
export function calculateDiscount(price: number, compareAtPrice?: number): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

//  Format price with currency
export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

//  Get unique categories from products using tags
export function getUniqueCategories(products: Product[]): string[] {
  const categories = new Set<string>();

  products.forEach(product => {
    product.tags?.forEach(tag => {
      categories.add(tag);
    });
  });

  return Array.from(categories).sort();
}

//  Search products by title or tags
export async function searchProducts(
  searchTerm: string,
  country: Country
): Promise<Product[]> {
  try {
    const allProducts = await fetchAllProducts(country);

    const results = allProducts.filter(product => {
      const title = product.title.toLowerCase();
      const tags = product.tags.map(tag => tag.toLowerCase());
      const search = searchTerm.toLowerCase();

      return title.includes(search) || tags.some(tag => tag.includes(search));
    });

    console.log(`🔍 Search "${searchTerm}" found ${results.length} products`);
    return results;
  } catch (error) {
    console.error('searchProducts error:', error);
    return [];
  }
}

//  Get products sorted by price
export async function fetchProductsSortedByPrice(
  country: Country,
  sortOrder: 'asc' | 'desc' = 'asc'
): Promise<Product[]> {
  try {
    const products = await fetchAllProducts(country);

    const sorted = [...products].sort((a, b) => {
      const priceA = a.variants[0]?.cost || 0;
      const priceB = b.variants[0]?.cost || 0;

      return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });

    console.log(`💰 Sorted ${sorted.length} products by price (${sortOrder})`);
    return sorted;
  } catch (error) {
    console.error('fetchProductsSortedByPrice error:', error);
    return [];
  }
}

//  Get best selling products (by tag)
export async function fetchBestSellingProducts(
  country: Country,
  limit: number = 10
): Promise<Product[]> {
  try {
    const products = await fetchAllProducts(country);

    const bestsellers = products
      .filter(p => p.tags?.some(tag => tag.toLowerCase() === 'bestseller' || tag.toLowerCase() === 'best-seller'))
      .slice(0, limit);

    console.log(`⭐ Found ${bestsellers.length} best-selling products`);
    return bestsellers;
  } catch (error) {
    console.error('fetchBestSellingProducts error:', error);
    return [];
  }
}

//  Get new products
export async function fetchNewProducts(
  country: Country,
  limit: number = 10
): Promise<Product[]> {
  try {
    const products = await fetchAllProducts(country);

    const newProducts = products.slice(0, limit);

    console.log(` Found ${newProducts.length} new products`);
    return newProducts;
  } catch (error) {
    console.error('fetchNewProducts error:', error);
    return [];
  }
}

//  GET RELATED PRODUCTS FOR "FREQUENTLY BOUGHT TOGETHER"
export async function getRelatedProducts(
  productHandle: string,
  country: Country,
  limit: number = 3
): Promise<Product[]> {
  try {
    const mainProduct = await fetchProductByHandle(productHandle, country);
    
    if (!mainProduct) {
      console.log('⚠️ Main product not found for handle:', productHandle);
      return [];
    }

    // Get similar products by matching tags or product type
    const related = await fetchSimilarProducts(mainProduct, country, limit);
    
    console.log(`Found ${related.length} related products for "${mainProduct.title}"`);
    return related;
  } catch (error) {
    console.error('getRelatedProducts error:', error);
    return [];
  }
}

// 🔥 Fetch Special Product Banner from Metaobjects
export async function fetchSpecialProductBanner(
  country: Country
): Promise<SpecialProductBanner | null> {
  const query = `query GetSpecialProductBanner {
    metaobjects(type: "special_product_banner", first: 1) {
      edges {
        node {
          id
          handle
          fields {
            key
            value
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }`;

  try {
    console.log(`🖼️ Fetching special product banner for ${country}...`);
    const data = await shopifyFetch(query, {}, country);

    if (!data.data?.metaobjects?.edges?.length) {
      console.log('⚠️ No special product banner metaobject found');
      return null;
    }

    const metaobject = data.data.metaobjects.edges[0].node;
    const fields = metaobject.fields;

    // Extract fields by key
    const getFieldValue = (key: string) => {
      const field = fields.find((f: any) => f.key === key);
      return field?.value || null;
    };

    const getFieldImage = (key: string) => {
      const field = fields.find((f: any) => f.key === key);
      return field?.reference?.image?.url || null;
    };

    const banner: SpecialProductBanner = {
      desktopImage: getFieldImage('desktop_image') || '/maharaja detailings.svg',
      mobileImage: getFieldImage('mobile_image') || '/M9.svg',
      alt: getFieldValue('alt_text') || 'Special Product',
      link: getFieldValue('link') || undefined,
    };

    console.log('✅ Successfully fetched special product banner');
    return banner;
  } catch (error) {
    console.error('fetchSpecialProductBanner error:', error);
    return null;
  }
}
