import { MainLayout } from '@/components/layout/MainLayout'
import { Section } from '@/components/ui/Section'
import { PortableText } from '@/components/ui/PortableText'
import type { PortableTextBlock } from '@portabletext/react'
import type { SiteSettings } from '@/types'

interface PolicyContentPageProps {
  title: string
  content?: PortableTextBlock[]
  siteSettings: SiteSettings | null
}

export function PolicyContentPage({ title, content, siteSettings }: PolicyContentPageProps) {
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
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">{title}</h1>
        </div>
      </Section>

      <Section variant="default" size="lg">
        <div className="prose mx-auto max-w-3xl">
          {content && content.length > 0 ? (
            <PortableText value={content} />
          ) : (
            <p>This policy is not available yet. Please check back later.</p>
          )}
        </div>
      </Section>
    </MainLayout>
  )
}
