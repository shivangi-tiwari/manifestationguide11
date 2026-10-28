'use client'

import { Section, SectionHeader } from '@/components/ui/Section'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { clsx } from 'clsx'

interface Video {
  _id: string
  title: string
  description?: string
  youtubeId: string
  thumbnailUrl?: string
  publishedAt: string
  tags?: string[]
}

interface FeaturedVideosProps {
  headline?: string
  subheadline?: string
  videos: Video[]
  ctaText?: string
  ctaHref?: string
}

export function FeaturedVideos({ headline = 'Latest Videos', subheadline, videos, ctaText = 'View All Videos', ctaHref = '/videos' }: FeaturedVideosProps) {
  const featured = videos.slice(0, 3)

  return (
    <Section variant="default" size="lg" id="videos">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
        <SectionHeader title={headline} subtitle={subheadline} align="left" className="mb-0" />
        <Button variant="ghost" asChild>
          <a href={ctaHref}>{ctaText}</a>
        </Button>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {featured.map((video, index) => (
          <Card key={video._id} variant="outlined" padding="none" className="overflow-hidden flex flex-col">
            <div className="relative aspect-video">
              <YouTubeEmbed videoId={video.youtubeId} title={video.title} lazy />
            </div>
            <CardContent className="flex-1 flex flex-col">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{video.title}</h3>
              {video.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-3">{video.description}</p>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                <time dateTime={video.publishedAt}>
                  {new Date(video.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </time>
                {video.tags && video.tags.length > 0 && (
                  <>
                    <span>•</span>
                    <span>{video.tags.slice(0, 2).join(', ')}</span>
                  </>
                )}
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={`/videos/${video._id}`}>Watch Video</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {videos.length > 3 && (
        <div className="text-center mt-10">
          <Button variant="outline" size="lg" asChild>
            <a href={ctaHref}>{ctaText} ({videos.length} total)</a>
          </Button>
        </div>
      )}
    </Section>
  )
}