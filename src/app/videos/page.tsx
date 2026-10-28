import { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity/client'
import { queries } from '@/lib/sanity/queries'
import { MainLayout } from '@/components/layout/MainLayout'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Free Manifestation Videos',
  description: 'Watch free manifestation tutorials, guided meditations, and success stories on YouTube. New videos weekly.',
}

async function getVideosData() {
  const [siteSettings, videos] = await Promise.all([
    sanityFetch({ query: queries.siteSettings, tags: ['sanity', 'videos'] }),
    sanityFetch({ query: queries.videos, tags: ['sanity', 'videos'] }),
  ])
  return { siteSettings, videos }
}

export default async function VideosPage() {
  const { siteSettings, videos } = await getVideosData()

  const categorized = (videos || []).reduce((acc: any, video: any) => {
    const cat = video.category || 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(video)
    return acc
  }, {})

  return (
    <MainLayout
      siteName={siteSettings?.title || 'Manifestation Coach'}
      tagline={siteSettings?.tagline}
      instagramHandle={siteSettings?.instagramHandle}
      email={siteSettings?.contactEmail}
    >
      <Section variant="dark" size="xl" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-orange-900/50" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">Free Videos & Tutorials</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Learn manifestation techniques, watch guided meditations, and get inspired by real success stories. Subscribe for weekly updates.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <a href={`https://youtube.com/@${siteSettings?.youtubeChannelId || 'manifestationcoach55'}`} target="_blank" rel="noopener noreferrer">
                Subscribe on YouTube
              </a>
            </Button>
          </div>
        </div>
      </Section>

      <Section variant="default" size="lg">
        {Object.entries(categorized).map(([category, categoryVideos]: [string, any]) => (
          <div key={category} className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{category}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryVideos.map((video: any) => (
                <Card key={video._id} variant="outlined" padding="none" className="overflow-hidden flex flex-col">
                  <div className="relative aspect-video">
                    <YouTubeEmbed videoId={video.youtubeId} title={video.title} lazy />
                  </div>
                  <CardContent className="flex-1 flex flex-col p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-3">{video.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
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