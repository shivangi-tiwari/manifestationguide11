import type { MetadataRoute } from 'next'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  const sitemap = configuredUrl
    ? `${new URL(configuredUrl).origin}/sitemap.xml`
    : undefined

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/', '/api/', '/_next/', '/static/'],
    },
    ...(sitemap ? { sitemap } : {}),
  }
}