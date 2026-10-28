import { MetadataRoute } from 'next'
import { sanityFetch } from '@/lib/sanity/client'
import { queries } from '@/lib/sanity/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://manifestationcoach.in'

  const [pages, packages, videos, stories] = await Promise.all([
    sanityFetch({ query: queries.pages, tags: ['sanity'] }),
    sanityFetch({ query: queries.packages, tags: ['sanity'] }),
    sanityFetch({ query: queries.videos, tags: ['sanity'] }),
    sanityFetch({ query: queries.successStories, tags: ['sanity'] }),
  ])

  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/packages`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/videos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/success-stories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const pageRoutes = (pages || []).map((page: any) => ({
    url: `${baseUrl}/${page.slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const packageRoutes = (packages || []).map((pkg: any) => ({
    url: `${baseUrl}/packages/${pkg.slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const videoRoutes = (videos || []).map((video: any) => ({
    url: `${baseUrl}/videos/${video._id}`,
    lastModified: new Date(video.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const storyRoutes = (stories || []).map((story: any) => ({
    url: `${baseUrl}/success-stories/${story._id}`,
    lastModified: new Date(story.date),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...pageRoutes, ...packageRoutes, ...videoRoutes, ...storyRoutes]
}