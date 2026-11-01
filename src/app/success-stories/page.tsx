import { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity/client'
import { queries } from '@/lib/sanity/queries'
import { MainLayout } from '@/components/layout/MainLayout'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import { PortableText } from '@/components/ui/PortableText'
import type { SiteSettings, SuccessStory } from '@/types'

export const metadata: Metadata = {
  title: 'Success Stories',
  description: 'Read real transformation stories from people who manifested their dreams with our coaching programs.',
}

async function getStoriesData() {
  const [siteSettings, stories] = await Promise.all([
    sanityFetch<SiteSettings | null>({ query: queries.siteSettings, tags: ['sanity', 'stories'] }),
    sanityFetch<SuccessStory[]>({ query: queries.successStories, tags: ['sanity', 'stories'] }),
  ])
  return { siteSettings, stories }
}

export default async function SuccessStoriesPage() {
  const { siteSettings, stories } = await getStoriesData()

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
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">Success Stories</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Real people. Real transformations. See how manifestation coaching changed their lives.
          </p>
        </div>
      </Section>

      <Section variant="alternate" size="lg">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories?.map((story) => {
              // Type narrowing for PortableText
              const storyContent = Array.isArray(story.story) ? story.story : []

              return (
                <Card key={story._id} variant="outlined" padding="lg" className="flex flex-col">
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      {story.photo ? (
                        <img src={story.photo as string} alt={story.clientName} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{story.clientName.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{story.clientName}</p>
                        {story.location && <p className="text-sm text-gray-500 dark:text-gray-400">{story.location}</p>}
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{story.headline}</h4>
                    {storyContent.length > 0 && (
                      <div className="prose dark:prose-invert max-w-none text-sm mb-4 flex-1">
                        <PortableText value={storyContent} />
                      </div>
                    )}
                    {story.youtubeVideoId && (
                      <a href={`https://youtube.com/watch?v=${story.youtubeVideoId}`} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 dark:text-purple-400 hover:underline mt-auto inline-flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        Watch Video
                      </a>
                    )}
                  </CardContent>
                </Card>
              )
            })}
        </div>
      </Section>
    </MainLayout>
  )
}