import { MetadataRoute } from 'next'
import { sanityFetch } from '@/lib/sanity/client'
import { queries } from '@/lib/sanity/queries'
import type { Package, Video, SuccessStory } from '@/types'

interface PageForSitemap {
  slug: { current: string }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://manifestationcoach.in'

  const [pages, packages, videos, stories] = await Promise.all([
    sanityFetch<PageForSitemap[]>({ query: queries.pages, tags: ['sanity'] }),
    sanityFetch<Package[]>({ query: queries.packages, tags: ['sanity'] }),
    sanityFetch<Video[]>({ query: queries.videos, tags: ['sanity'] }),
    sanityFetch<SuccessStory[]>({ query: queries.successStories, tags: ['sanity'] }),
  ])

  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/packages`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/videos`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/success-stories`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
  ]

  const pageRoutes = (pages || []).map((page) => ({
    url: `${baseUrl}/${page.slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const packageRoutes = (packages || []).map((pkg) => ({
    url: `${baseUrl}/packages/${pkg.slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const videoRoutes = (videos || []).map((video) => ({
    url: `${baseUrl}/videos/${video._id}`,
    lastModified: new Date(video.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const storyRoutes = (stories || []).map((story) => ({
    url: `${baseUrl}/success-stories/${story._id}`,
    lastModified: new Date(story.date),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...pageRoutes, ...packageRoutes, ...videoRoutes, ...storyRoutes]
}