import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/lib/sanity/client'
import { queries } from '@/lib/sanity/queries'
import { MainLayout } from '@/components/layout/MainLayout'
import { Section } from '@/components/ui/Section'
import { PortableText } from '@/components/ui/PortableText'
import type { Page, SiteSettings } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const pages = await sanityFetch<Page[]>({ query: queries.pages, tags: ['sanity'] })
  return pages?.map((page) => ({ slug: page.slug.current })) || []
}

async function getPageData(slug: string) {
  const [siteSettings, page] = await Promise.all([
    sanityFetch<SiteSettings | null>({ query: queries.siteSettings, tags: ['sanity', `page-${slug}`] }),
    sanityFetch<Page | null>({ query: queries.pageBySlug(slug), tags: ['sanity', `page-${slug}`] }),
  ])
  return { siteSettings, page }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { page } = await getPageData(slug)
  if (!page) return { title: 'Page Not Found' }
  return {
    title: page.title,
    description: page.seo?.description || page.title,
    openGraph: {
      title: page.seo?.ogTitle || page.title,
      description: page.seo?.description || page.title,
      images: page.seo?.ogImage ? [{ url: page.seo.ogImage }] : [],
    },
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const { siteSettings, page } = await getPageData(slug)

  if (!page) notFound()

  return (
    <MainLayout
      siteName={siteSettings?.title || 'Manifestation Coach'}
      tagline={siteSettings?.tagline}
      instagramHandle={siteSettings?.instagramHandle}
      email={siteSettings?.contactEmail}
      youtubeChannelId={siteSettings?.youtubeChannelId}
      mustWatchPlaylistUrl={siteSettings?.mustWatchPlaylistUrl}
      footerText={siteSettings?.footerText}
      developerCredit={siteSettings?.developerCredit}
      disclaimerText={siteSettings?.disclaimerText}
    >
      <Section variant="dark" size="xl" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-orange-900/50" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">{page.title}</h1>
          {page.seo?.description && (
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">{page.seo.description}</p>
          )}
        </div>
      </Section>

      <Section variant="default" size="lg">
        <div className="max-w-4xl mx-auto">
          {page.body && page.body.length > 0 && <PortableText value={page.body} />}
        </div>
      </Section>
    </MainLayout>
  )
}