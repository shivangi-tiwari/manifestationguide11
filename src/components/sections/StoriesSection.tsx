'use client'

import { SectionImage } from '@/components/ui/SectionImage'
import { Section, SectionHeader } from '@/components/ui/Section'
import type { SuccessStory, Video } from '@/types'

interface StoriesSectionProps {
  stories: SuccessStory[]
  syncedStoryVideos: Video[]
  storiesImage?: any
  storiesSubtitle?: string
}

export function StoriesSection({
  stories,
  syncedStoryVideos,
  storiesImage,
  storiesSubtitle,
}: StoriesSectionProps) {
  const videoById = new Map<string, {
    videoId: string
    title: string
    publishedAt: string
    featured: boolean
  }>()

  for (const video of syncedStoryVideos) {
    videoById.set(video.youtubeId, {
      videoId: video.youtubeId,
      title: video.title,
      publishedAt: video.publishedAt,
      featured: video.featured,
    })
  }

  for (const story of stories) {
    if (!story.published || !story.youtubeVideoId || videoById.has(story.youtubeVideoId)) continue
    videoById.set(story.youtubeVideoId, {
      videoId: story.youtubeVideoId,
      title: story.headline,
      publishedAt: story.date,
      featured: story.featured,
    })
  }

  const videos = [...videoById.values()].sort((a, b) =>
    Number(b.featured) - Number(a.featured) ||
    Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  )

  return (
    <Section variant="cream" size="lg" id="stories" aria-labelledby="stories-heading" waveTo="sage">
      <SectionHeader
        title="Success stories"
        subtitle={storiesSubtitle}
        align="left"
        number="04"
        label="Stories"
      />
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionImage
          sanityImage={storiesImage}
          doodleName="stories"
          alt="Stories illustration"
          className="max-w-[260px] mx-auto lg:max-w-md lg:mx-0"
        />
        <div>
          <h3 className="mb-4 text-heading-lg font-display font-semibold text-foreground">
            Recent success story videos
          </h3>
          <ul
            className="max-h-[36rem] space-y-3 overflow-y-auto overscroll-contain pr-2"
            aria-label="Recent success story videos"
          >
            {videos.map((video) => (
              <li key={video.videoId}>
                <a
                  href={`https://www.youtube.com/watch?v=${encodeURIComponent(video.videoId)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-[72px] items-center gap-4 rounded-card border border-border bg-white/70 p-4 transition-colors hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown"
                >
                  <span
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brown text-cream"
                    aria-hidden="true"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-foreground group-hover:underline">
                      {video.title}
                    </span>
                    <time
                      className="mt-1 block text-sm text-muted"
                      dateTime={video.publishedAt}
                    >
                      {new Date(video.publishedAt).toLocaleDateString('en-IN', {
                        timeZone: 'UTC',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          {videos.length === 0 && (
            <p className="rounded-card border border-border bg-white/70 p-6 text-muted">
              No success story videos are available yet.
            </p>
          )}
          <p className="mt-4 text-sm text-muted italic">Results vary from person to person.</p>
        </div>
      </div>
    </Section>
  )
}
