import type { MetadataRoute } from 'next'
import { sanityFetch } from '@/lib/sanity/client'
import { queries } from '@/lib/sanity/queries'

interface PageForSitemap {
  slug?: { current?: string }
  _updatedAt?: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!configuredUrl) {
    console.error('Cannot generate sitemap: NEXT_PUBLIC_SITE_URL is not configured.')
    return []
  }

  const baseUrl = new URL(configuredUrl).origin
  const pages = await sanityFetch<PageForSitemap[]>({
    query: queries.pages,
    tags: ['sanity'],
  })
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

  const pageRoutes: MetadataRoute.Sitemap = (pages ?? []).flatMap((page) => {
    const slug = page.slug?.current
    if (!slug || slug === 'terms') return []

    return [{
      url: `${baseUrl}/${slug}`,
      lastModified: page._updatedAt ? new Date(page._updatedAt) : now,
      changeFrequency: 'monthly',
      priority: 0.5,
    }]
  })

  return [...staticRoutes, ...pageRoutes]
}
