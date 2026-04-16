import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://capellafits.com', changeFrequency: 'weekly', priority: 1 },
    { url: 'https://capellafits.com/collections', changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://capellafits.com/collections/all', changeFrequency: 'weekly', priority: 0.8 },
  ]
}
