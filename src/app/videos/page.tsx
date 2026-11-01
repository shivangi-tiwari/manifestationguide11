import { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity/client'
import { queries } from '@/lib/sanity/queries'
import { MainLayout } from '@/components/layout/MainLayout'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { Button } from '@/components/ui/Button'
import type { SiteSettings, Video } from '@/types'

export const metadata: Metadata = {
  title: 'Free Manifestation Videos',
  description: 'Watch free manifestation tutorials, guided meditations, and success stories on YouTube. New videos weekly.',
}

async function getVideosData() {
  const [siteSettings, videos] = await Promise.all([
    sanityFetch<SiteSettings | null>({ query: queries.siteSettings, tags: ['sanity', 'videos'] }),
    sanityFetch<Video[]>({ query: queries.videos, tags: ['sanity', 'videos'] }),
  ])
  return { siteSettings, videos }
}

export default async function VideosPage() {
  const { siteSettings, videos } = await getVideosData()
  const youtubeChannelId = siteSettings?.youtubeChannelId?.trim()

  const categorized = (videos || []).reduce((acc: Record<string, Video[]>, video) => {
    const cat = video.category || 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(video)
    return acc
  }, {} as Record<string, Video[]>)

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
        <div className="absolute inset-0 bg-gradient-to-br from-space-cadet-900/80 via-warm-brown-700/60 to-deep-burgundy-700/80" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-display-xl font-display font-bold text-background tracking-tight mb-6">Free Videos & Tutorials</h1>
          <p className="text-body-lg md:text-heading-md text-background/90 max-w-2xl mx-auto">
            Learn manifestation techniques, watch guided meditations, and get inspired by real success stories. Subscribe for weekly updates.
          </p>
          {youtubeChannelId && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button size="lg" variant="outline" className="border-background/30 text-background hover:bg-background/10" asChild>
                <a href={`https://www.youtube.com/channel/${encodeURIComponent(youtubeChannelId)}`} target="_blank" rel="noopener noreferrer">
                  Subscribe on YouTube
                </a>
              </Button>
            </div>
          )}
        </div>
      </Section>

      <Section variant="default" size="lg">
        {Object.entries(categorized).map(([category, categoryVideos]) => (
          <div key={category} className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-heading-xl font-display font-bold text-foreground">{category}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryVideos.map((video) => (
                <Card key={video._id} variant="outlined" padding="none" className="overflow-hidden flex flex-col">
                  <div className="relative aspect-video">
                    <YouTubeEmbed videoId={video.youtubeId} title={video.title} lazy />
                  </div>
                  <CardContent className="flex-1 flex flex-col p-6">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-muted mb-4 flex-1 line-clamp-3">{video.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted mb-4">
                      <time dateTime={video.publishedAt}>
                        {new Date(video.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </time>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={`https://youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </Section>
    </MainLayout>
  )
}