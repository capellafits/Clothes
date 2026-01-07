// lib/shopifyAdmin.ts
// Admin API integration for fetching metaobjects

export type Country = "IN" | "CA";

// Banner slide type matching the metaobject structure
export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  desktopImage: string;
  mobileImage: string;
  ctaText: string;
  ctaLink: string;
}

// Get Admin API configuration for a country
function getAdminConfig(country: Country) {
  if (country === "CA") {
    return {
      domain: process.env.SHOPIFY_STORE_DOMAIN_CA!,
      adminToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN_CA!
    };
  }
  return {
    domain: process.env.SHOPIFY_STORE_DOMAIN_IN!,
    adminToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN_IN!
  };
}

/**
 * Core Admin API fetch function
 */
export async function shopifyAdminFetch<T = any>(
  query: string,
  variables: Record<string, any> = {},
  country: Country = "CA"
): Promise<T> {
  const { domain, adminToken } = getAdminConfig(country);

  if (!domain || !adminToken) {
    console.error(`Missing Shopify Admin credentials for ${country}`);
    throw new Error(`Missing Shopify Admin credentials for ${country}`);
  }

  try {
    const res = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": adminToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error('Shopify Admin API Error:', { status: res.status, body: txt });
      throw new Error(`Shopify Admin fetch failed: ${res.status}`);
    }

    const json = await res.json();

    if (json.errors) {
      console.error('GraphQL Errors:', json.errors);
      throw new Error(`GraphQL Error: ${json.errors[0]?.message || 'Unknown error'}`);
    }

    return json;
  } catch (error) {
    console.error('shopifyAdminFetch error:', error);
    throw error;
  }
}

/**
 * Resolve file/media GIDs to URLs
 */
async function resolveFileIds(
  fileIds: string[],
  country: Country = "CA"
): Promise<Record<string, string | null>> {
  if (fileIds.length === 0) return {};

  try {
    // Separate different types of file IDs
    const mediaImageIds = fileIds.filter(id => id.includes('MediaImage'));
    const genericFileIds = fileIds.filter(id =>
      id.includes('GenericFile') || (id.includes('File') && !id.includes('MediaImage'))
    );

    // Build query parts
    const queryParts: string[] = [];

    mediaImageIds.forEach((id, idx) => {
      queryParts.push(`media${idx}: node(id: "${id}") {
        ... on MediaImage {
          id
          image {
            url
          }
        }
      }`);
    });

    genericFileIds.forEach((id, idx) => {
      queryParts.push(`file${idx}: node(id: "${id}") {
        ... on GenericFile {
          id
          url
        }
      }`);
    });

    if (queryParts.length === 0) return {};

    const query = `query ResolveFiles { ${queryParts.join('\n')} }`;
    const result = await shopifyAdminFetch<{ data: Record<string, any> }>(query, {}, country);

    const fileMap: Record<string, string | null> = {};

    if (result.data) {
      Object.entries(result.data).forEach(([_key, item]: [string, any]) => {
        if (item?.id) {
          if (item.image?.url) {
            fileMap[item.id] = item.image.url;
          } else if (item.url) {
            fileMap[item.id] = item.url;
          }
        }
      });
    }

    return fileMap;
  } catch (error) {
    console.error('Error resolving file IDs:', error);
    return {};
  }
}

/**
 * Parse metaobject fields into a key-value object
 */
function parseMetaobjectFields(
  fields: Array<{
    key: string;
    type: string;
    value: string;
    reference?: any;
    references?: any;
  }>,
  fileMap: Record<string, string | null> = {}
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const field of fields) {
    let parsedValue: any;

    // Try to parse JSON
    try {
      parsedValue = JSON.parse(field.value);
    } catch {
      parsedValue = field.value;
    }

    // Handle single reference (MediaImage, etc.)
    if (field.reference) {
      if (field.reference.image?.url) {
        result[field.key] = field.reference.image.url;
        continue;
      } else if (field.reference.url) {
        result[field.key] = field.reference.url;
        continue;
      } else if (field.reference.fields) {
        result[field.key] = parseMetaobjectFields(field.reference.fields, fileMap);
        continue;
      }
    }

    // Handle list references
    if (field.references?.edges?.length > 0) {
      result[field.key] = field.references.edges.map((edge: any) => {
        if (edge.node.image?.url) {
          return edge.node.image.url;
        } else if (edge.node.url) {
          return edge.node.url;
        } else if (edge.node.fields) {
          return parseMetaobjectFields(edge.node.fields, fileMap);
        }
        return edge.node;
      });
      continue;
    }

    // Handle file GID resolution
    if (typeof parsedValue === 'string' && parsedValue.startsWith('gid://shopify/')) {
      result[field.key] = fileMap[parsedValue] || parsedValue;
      continue;
    }

    // Default: use parsed value
    result[field.key] = parsedValue;
  }

  return result;
}

/**
 * Generic metaobject fetcher
 */
export async function getMetaobject<T = Record<string, any>>({
  handle,
  type,
  country = "CA"
}: {
  handle: string;
  type: string;
  country?: Country;
}): Promise<T | null> {
  try {
    const query = `
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
              ... on MediaImage {
                id
                image {
                  url
                  altText
                  width
                  height
                }
              }
              ... on GenericFile {
                id
                url
              }
              ... on Metaobject {
                id
                handle
                type
                fields {
                  key
                  type
                  value
                  reference {
                    ... on MediaImage {
                      id
                      image {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
            references(first: 50) {
              edges {
                node {
                  ... on MediaImage {
                    id
                    image {
                      url
                      altText
                      width
                      height
                    }
                  }
                  ... on Metaobject {
                    id
                    handle
                    type
                    fields {
                      key
                      type
                      value
                      reference {
                        ... on MediaImage {
                          id
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
            }
          }
        }
      }
    `;

    const result = await shopifyAdminFetch<{
      data: {
        metaobjectByHandle: {
          id: string;
          handle: string;
          type: string;
          fields: Array<{
            key: string;
            type: string;
            value: string;
            reference?: any;
            references?: any;
          }>;
        } | null;
      };
    }>(query, { handle, type }, country);

    const metaobject = result.data?.metaobjectByHandle;
    if (!metaobject) {
      console.error(`Metaobject not found: ${type}/${handle}`);
      return null;
    }

    // Extract file IDs that need resolution
    const fileIds: string[] = [];
    metaobject.fields.forEach(field => {
      if (typeof field.value === 'string' && field.value.startsWith('gid://shopify/')) {
        fileIds.push(field.value);
      }
    });

    // Resolve file IDs if needed
    const fileMap = fileIds.length > 0 ? await resolveFileIds(fileIds, country) : {};

    // Parse fields
    const parsed = parseMetaobjectFields(metaobject.fields, fileMap);

    return parsed as T;
  } catch (error) {
    console.error(`Error fetching metaobject (${type}/${handle}):`, error);
    return null;
  }
}

/**
 * Map a raw banner object to HeroSlide format
 * Handles both camelCase and lowercase field names
 */
function mapBannerToSlide(banner: any, index: number): HeroSlide {
  return {
    id: index + 1,
    title: banner.title || '',
    subtitle: banner.subtitle || '',
    description: banner.description || '',
    // Handle both camelCase and lowercase field names
    desktopImage: banner.desktopImage || banner.desktopimage || banner.desktop_image || '',
    mobileImage: banner.mobileImage || banner.mobileimage || banner.mobile_image || banner.desktopImage || banner.desktopimage || '',
    ctaText: banner.ctaText || banner.ctatext || banner.cta_text || 'Shop Now',
    ctaLink: banner.ctaLink || banner.ctalink || banner.cta_link || '/shop',
  };
}

/**
 * Fetch homepage banners from Shopify metaobject
 * Returns array of HeroSlide objects for the banner carousel
 */
export async function getHomepageBanners(country: Country = "CA"): Promise<HeroSlide[]> {
  try {
    console.log('📸 Fetching homepage banners from Shopify...');

    const metaobject = await getMetaobject<Record<string, any>>({
      handle: 'multi-homepage-banner',
      type: 'multi_homepage_banner',
      country
    });

    if (!metaobject) {
      console.log('⚠️ No homepage banner metaobject found, using fallback');
      return [];
    }

    console.log('📦 Metaobject data:', JSON.stringify(metaobject, null, 2));

    // Check for list field (the actual structure from Shopify)
    const bannerList = metaobject.list || metaobject.banners || metaobject.slides || metaobject.items;

    if (Array.isArray(bannerList) && bannerList.length > 0) {
      console.log(`✅ Found ${bannerList.length} banners in list`);
      return bannerList.map(mapBannerToSlide);
    }

    // Single banner as direct fields (fallback check)
    if (metaobject.title && (metaobject.desktopImage || metaobject.desktopimage)) {
      console.log('✅ Found single banner');
      return [mapBannerToSlide(metaobject, 0)];
    }

    console.log('⚠️ No banners found in metaobject, using fallback');
    return [];
  } catch (error) {
    console.error('getHomepageBanners error:', error);
    return [];
  }
}
