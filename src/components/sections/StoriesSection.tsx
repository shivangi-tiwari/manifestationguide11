'use client'

import { SectionImage } from '@/components/ui/SectionImage'
import { Section, SectionHeader } from '@/components/ui/Section'
import { PortableText } from '@/components/ui/PortableText'
import type { SanityImageBlock, SuccessStory, Video } from '@/types'
import { useState } from 'react'

interface StoriesSectionProps {
  stories: SuccessStory[]
  syncedStoryVideos: Video[]
  storiesImage?: SanityImageBlock
  storiesSubtitle?: string
}

export function StoriesSection({
  stories,
  syncedStoryVideos,
  storiesImage,
  storiesSubtitle,
}: StoriesSectionProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
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
  const writtenStories = stories
    .filter((story) => story.published)
    .sort((a, b) =>
      Number(b.featured) - Number(a.featured) ||
      Date.parse(b.date) - Date.parse(a.date)
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
          {videos.length > 0 && (
            <>
              <h3 className="mb-4 text-heading-lg font-display font-semibold text-foreground">
                Recent success story videos
              </h3>
              <ul
                className="max-h-[36rem] space-y-3 overflow-y-auto overscroll-contain pr-2"
                aria-label="Recent success story videos"
              >
                {videos.map((video) => (
                  <li key={video.videoId}>
                    <div className="overflow-hidden rounded-card border border-border bg-white/70">
                      <button
                        type="button"
                        onClick={() => setActiveVideoId(activeVideoId === video.videoId ? null : video.videoId)}
                        aria-expanded={activeVideoId === video.videoId}
                        aria-controls={`success-video-${video.videoId}`}
                        className="group flex min-h-[72px] w-full items-center gap-4 p-4 text-left transition-colors hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown"
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
                        <span className="text-sm font-semibold text-brown">
                          {activeVideoId === video.videoId ? 'Hide video' : 'Watch video'}
                        </span>
                      </button>
                      {activeVideoId === video.videoId && (
                        <iframe
                          id={`success-video-${video.videoId}`}
                          className="aspect-video w-full border-0"
                          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.videoId)}?autoplay=1`}
                          title={video.title}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
          {writtenStories.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-heading-lg font-display font-semibold text-foreground">
                Written success stories
              </h3>
              {writtenStories.map((story) => (
                <article key={story._id} className="rounded-card border border-border bg-white/70 p-5">
                  <h4 className="font-semibold text-foreground">{story.headline}</h4>
                  <p className="mt-1 text-sm text-muted">
                    {story.clientName}
                    {story.date && (
                      <>
                        {' · '}
                        <time dateTime={story.date}>{story.date}</time>
                      </>
                    )}
                  </p>
                  <PortableText value={story.story} className="mt-3 text-body text-foreground" />
                </article>
              ))}
            </div>
          )}
          {videos.length === 0 && writtenStories.length === 0 && (
            <p className="rounded-card border border-border bg-white/70 p-6 text-muted">
              Success stories will appear here when available.
            </p>
          )}
          <p className="mt-4 text-sm text-muted italic">Results vary from person to person.</p>
        </div>
      </div>
    </Section>
  )
}
