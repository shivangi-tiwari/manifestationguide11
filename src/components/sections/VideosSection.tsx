'use client'

import { useState, useEffect, useRef } from 'react'
import { Doodle } from '@/components/ui/Doodle'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { clsx } from 'clsx'
import Link from 'next/link'

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
}

function MustWatchCallout({ playlistUrl, playlistId }: { playlistUrl?: string; playlistId?: string }) {
  const [isEmbedLoaded, setIsEmbedLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!playlistId) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsEmbedLoaded(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '200px' }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [playlistId])

  const fallbackUrl = 'https://www.youtube.com/@ManifestationGuide11/playlists'
  const url = playlistUrl || fallbackUrl

  return (
    <Card variant="outlined" padding="lg" className="bg-butter border-brown/30 mb-12 relative overflow-hidden">
      <div className="absolute top-4 right-4">
        <span className="text-xs font-semibold text-brown bg-cream px-3 py-1 rounded-full">
          Start here
        </span>
      </div>
      <div className="max-w-3xl">
        <h3 className="text-heading-xl font-display font-bold text-foreground mb-2">
          Must-Watch Playlist
        </h3>
        <p className="text-muted mb-6">Watch these first to learn the basics before anything else</p>
        <Button asChild size="lg" variant="primary" className="mb-6">
          <a href={url} target="_blank" rel="noopener noreferrer">
            Open Playlist on YouTube
          </a>
        </Button>
        {playlistId && (
          <div ref={containerRef} className="relative aspect-video rounded-xl overflow-hidden bg-sage">
            {isEmbedLoaded ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1`}
                title="Must-watch playlist"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={() => setIsEmbedLoaded(true)}>
                <div className="w-20 h-20 rounded-full bg-brown flex items-center justify-center">
                  <svg className="w-8 h-8 text-cream ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
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
    'New video every Friday or Saturday',
  ]

  return (
    <div className="mb-12">
      <h3 className="text-heading-lg font-display font-semibold text-foreground mb-6">How I teach</h3>
      <ul className="grid sm:grid-cols-3 gap-6">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-3 p-4 bg-sage rounded-card">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brown flex items-center justify-center text-cream text-sm font-bold">
              {i + 1}
            </span>
            <span className="text-muted text-body">{point}</span>
          </li>
        ))}
      </ul>
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
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
        <SectionHeader title="Videos & Teaching" subtitle="Free manifestation guidance on YouTube" align="left" className="mb-0" />
        <Button variant="outline" asChild size="sm">
          <a href={`https://www.youtube.com/@${youtubeChannelId || 'ManifestationGuide11'}`} target="_blank" rel="noopener noreferrer">
            Watch more on YouTube
          </a>
        </Button>
      </div>
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
      {sorted.length === 0 && (
        <div className="text-center py-12 text-muted">
          No videos available yet. Check back soon!
        </div>
      )}
    </div>
  )
}

export function VideosSection({ videos, mustWatchPlaylistUrl, mustWatchPlaylistId, youtubeChannelId }: VideosSectionProps) {
  return (
    <Section variant="cream" size="lg" id="videos" aria-labelledby="videos-heading">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div>
          <MustWatchCallout playlistUrl={mustWatchPlaylistUrl} playlistId={mustWatchPlaylistId} />
          <HowITeach />
        </div>
        <div>
          <Doodle name="videos" className="hidden lg:block mx-auto max-w-xs mb-8" />
          <VideoGrid videos={videos} youtubeChannelId={youtubeChannelId} />
        </div>
      </div>
    </Section>
  )
}