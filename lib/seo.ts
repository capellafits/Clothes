import type { Metadata } from 'next';
import type { Product } from './shopify';

export const SITE_URL = 'https://capellafits.com';
export const SITE_NAME = 'Capella Fits';

export const categoryPages: Record<string, { path: string; title: string; heading: string; description: string }> = {
  tshirts: { path: '/tshirts', title: 'Graphic T-Shirts & Waffle Tops', heading: 'T-Shirts & Waffle Tops', description: 'Explore Capella graphic T-shirts and waffle tops. Find statement artwork, relaxed silhouettes and everyday streetwear, with size guides on every product.' },
  shirts: { path: '/shirts', title: 'Statement Shirts & Denim Shirts', heading: 'Shirts', description: 'Shop Capella statement shirts and denim shirts, including G.O.A.T, Starbourne Syndicate, After 7 PM and No Apologies. Explore designs, prices and available sizes.' },
  hoodies: { path: '/hoodies', title: 'Graphic Hoodies & Streetwear', heading: 'Hoodies', description: 'Explore Capella graphic hoodies, from Maharaja Ranjit Singh to Hands of Creation. Discover the artwork, product details and available sizes for each design.' },
  pants: { path: '/pants', title: 'Cargo Pants & Flared Jeans', heading: 'Pants & Jeans', description: 'Shop Capella cargo pants and flared jeans. Explore denim and everyday streetwear bottoms, compare styles and check the size guide to find your fit.' },
};

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function pageMetadata(title: string, description: string, path: string, image?: string, index = true): Metadata {
  const url = absoluteUrl(path);
  const images = image ? [{ url: absoluteUrl(image), alt: title }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', siteName: SITE_NAME, title: `${title} | ${SITE_NAME}`, description, url, ...(images ? { images } : {}) },
    twitter: { card: images ? 'summary_large_image' : 'summary', title: `${title} | ${SITE_NAME}`, description, ...(images ? { images: images.map(item => item.url) } : {}) },
    ...(!index ? { robots: { index: false, follow: true } } : {}),
  };
}

export function plainText(html: string) {
  const entities: Record<string, string> = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”' };
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, entity: string) => {
      if (!entity.startsWith('#')) return entities[entity.toLowerCase()] ?? match;
      const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
    }).replace(/\s+/g, ' ').trim();
}

export function productDescription(product: Product) {
  const text = plainText(product.description) || `Explore ${product.title} by Capella Fits. View product photos, prices, available sizes and the size guide.`;
  if (text.length <= 160) return text;
  return text.slice(0, 157).replace(/\s+\S*$/, '') + '…';
}

// Escape HTML delimiters so catalogue text can never close a JSON-LD script.
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function productStructuredData(product: Product) {
  const url = absoluteUrl(`/products/${product.handle}`);
  return {
    '@context': 'https://schema.org', '@type': 'Product', '@id': `${url}#product`,
    name: product.title, description: plainText(product.description) || productDescription(product),
    image: product.images, url, brand: { '@type': 'Brand', name: SITE_NAME },
    offers: product.variants.map(variant => ({
      '@type': 'Offer', '@id': `${url}#offer-${variant.id.split('/').pop()}`,
      name: `${product.title} — ${variant.size}`, url,
      price: variant.cost.toFixed(2), priceCurrency: variant.currency,
      availability: `https://schema.org/${variant.available ? 'InStock' : 'OutOfStock'}`,
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: SITE_NAME },
    })),
  };
}

export function productBreadcrumbs(product: Product) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: absoluteUrl('/shop') },
      { '@type': 'ListItem', position: 3, name: product.title, item: absoluteUrl(`/products/${product.handle}`) },
    ],
  };
}
