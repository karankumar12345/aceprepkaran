import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '*',

    },
    sitemap: 'https://aceprepkaran-lucx.vercel.app/sitemap.xml',
  }
}