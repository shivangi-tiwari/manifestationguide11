'use client'

import { useState } from 'react'
import { SectionImage } from '@/components/ui/SectionImage'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'

interface Video {
  _id: string
  title: string
  youtubeId: string
  description?: string
  thumbnailUrl?: string
  publishedAt: string
  category?: string
  featured: boolean
  hidden: boolean
  order: number
  source: 'youtube-sync' | 'manual'
}

interface VideosSectionProps {
  videos: Video[]
  mustWatchPlaylistUrl?: string
  mustWatchPlaylistId?: string
  youtubeChannelId?: string
  videosImage?: any
}

function MustWatchCallout({ playlistUrl, playlistId }: { playlistUrl?: string; playlistId?: string }) {
  const [isEmbedLoaded, setIsEmbedLoaded] = useState(false)

  const fallbackUrl = 'https://www.youtube.com/@ManifestationGuide11/playlists'
  const url = playlistUrl || fallbackUrl

  return (
    <Card variant="outlined" padding="lg" className="mx-auto mb-12 w-full max-w-4xl overflow-hidden border-cream/25 bg-olive text-center text-cream">
      <div className="mx-auto w-full max-w-3xl">
        <h3 className="text-heading-xl font-display font-bold text-cream mb-2">
          Must-Watch Playlist
        </h3>
        <p className="text-cream mb-6">Watch these first to learn the basics before anything else</p>
        <Button asChild size="lg" variant="primary" className="mb-6">
          <a href={url} target="_blank" rel="noopener noreferrer">
            Open playlist
          </a>
        </Button>
        {playlistId && (
          <div className="relative aspect-video overflow-hidden rounded-xl">
            {isEmbedLoaded ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1`}
                title="Must-watch playlist"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEmbedLoaded(true)}
                className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-sage via-sage to-butter text-olive transition-colors hover:from-butter hover:to-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-inset"
                aria-label="Load must-watch playlist player"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brown text-cream shadow-[4px_4px_0_#FBD86B] transition-transform hover:scale-105">
                  <svg className="ml-1 h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="text-base font-semibold">Play playlist preview</span>
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

function HowITeach() {
  const points = [
    'Self-concept work over quick techniques',
    'Law of Assumption as the foundation',
    'In-depth work on limiting beliefs',
  ]

  return (
    <div>
      <h3 className="text-heading-lg font-display font-semibold text-foreground mb-6">How I teach</h3>
      <ol className="space-y-4">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-3 p-4 bg-sage rounded-card">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brown flex items-center justify-center text-cream text-sm font-bold">
              {i + 1}
            </span>
            <span className="text-brown text-body">{point}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function VideoGrid({ videos, youtubeChannelId }: { videos: Video[]; youtubeChannelId?: string }) {
  // Sort: featured first, then by order, then by publishedAt desc
  const sorted = [...videos].sort((a, b) => {
    if (a.featured !== b.featured) return b.featured ? 1 : -1
    if (a.order !== b.order) return a.order - b.order
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((video) => (
          <Card key={video._id} variant="outlined" padding="none" className="overflow-hidden flex flex-col">
            <div className="relative aspect-video">
              <YouTubeEmbed videoId={video.youtubeId} title={video.title} lazy />
            </div>
            <CardContent className="flex-1 flex flex-col p-6">
              <h4 className="font-semibold text-foreground mb-2 line-clamp-2">{video.title}</h4>
              {video.description && (
                <p className="text-sm text-muted mb-4 flex-1 line-clamp-3">{video.description}</p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted mb-4">
                <time dateTime={video.publishedAt}>
                  {new Date(video.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </time>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={`https://youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer">
                  Watch on YouTube
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Button variant="outline" asChild size="sm">
          <a href={`https://www.youtube.com/@${youtubeChannelId || 'ManifestationGuide11'}`} target="_blank" rel="noopener noreferrer">
            Watch more on YouTube
          </a>
        </Button>
      </div>
    </div>
  )
}

export function VideosSection({ videos, mustWatchPlaylistUrl, mustWatchPlaylistId, youtubeChannelId, videosImage }: VideosSectionProps) {
  return (
    <Section variant="butter" size="lg" id="videos" aria-labelledby="videos-heading" waveTo="cream">
      <div className="space-y-12">
        <SectionHeader
          id="videos-heading"
          title="Videos & Teaching"
          subtitle="Free manifestation guidance on YouTube"
          align="left"
          className="mb-0"
          number="03"
          label="Watch and learn"
        />
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <HowITeach />
          <SectionImage sanityImage={videosImage} doodleName="videos" alt="Videos illustration" className="max-w-sm lg:max-w-md" />
        </div>
        <MustWatchCallout playlistUrl={mustWatchPlaylistUrl} playlistId={mustWatchPlaylistId} />
        <VideoGrid videos={videos} youtubeChannelId={youtubeChannelId} />
      </div>
    </Section>
  )
}