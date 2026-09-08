import type { MetadataRoute } from 'next';
import { fetchAllProducts } from '@/lib/shopify';
import { absoluteUrl, categoryPages } from '@/lib/seo';

// The catalogue uses uncached inventory reads; do not prerender an empty sitemap.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchAllProducts('CA');
  if (!products.length) throw new Error('Cannot generate sitemap: product catalogue unavailable');
  const pages = ['/', '/shop', ...Object.values(categoryPages).map(category => category.path), '/Aboutus', '/Contactus', '/Shipping', '/Returns', '/privacy-policy', '/terms-of-service'];
  return [
    ...pages.map(path => ({ url: absoluteUrl(path) })),
    ...products.map(product => ({ url: absoluteUrl(`/products/${product.handle}`), images: product.images })),
  ];
}
