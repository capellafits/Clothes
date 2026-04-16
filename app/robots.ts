import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
    ],
    sitemap: 'https://capellafits.com/sitemap.xml',
  }
}
