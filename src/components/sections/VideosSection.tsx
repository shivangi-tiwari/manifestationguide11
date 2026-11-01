'use client'

import { useState } from 'react'
import { SectionImage } from '@/components/ui/SectionImage'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import type { YouTubePlaylist } from '@/lib/youtube'
import type { SanityImageBlock } from '@/types'

interface VideosSectionProps {
  playlists: YouTubePlaylist[]
  playlistsError?: boolean
  mustWatchPlaylistUrl?: string
  mustWatchPlaylistId?: string
  videosImage?: SanityImageBlock
}

function MustWatchCallout({
  playlistUrl,
  playlistId,
  playlists,
  playlistsError = false,
}: {
  playlistUrl?: string
  playlistId?: string
  playlists: YouTubePlaylist[]
  playlistsError?: boolean
}) {
  const [previewLoaded, setPreviewLoaded] = useState(false)
  const displayPlaylists = [...playlists]
    .map((playlist) => ({
      ...playlist,
      title: playlist.playlistId === playlistId ? 'Self Concept' : playlist.title,
    }))
    .sort((a, b) => {
      const aIsFeatured = a.playlistId === playlistId
      const bIsFeatured = b.playlistId === playlistId
      return Number(bIsFeatured) - Number(aIsFeatured) || a.title.localeCompare(b.title)
    })

  return (
    <Card variant="outlined" padding="lg" className="mx-auto mb-12 w-full max-w-4xl overflow-hidden border-cream/25 bg-olive text-center text-cream">
      <div className="mx-auto w-full max-w-3xl">
        <h3 className="text-heading-xl font-display font-bold text-cream mb-2">
          Must-Watch Playlists
        </h3>
        <p className="mb-6 text-cream">
          Watching these is a must to get a gist of what you need to work on, whether individually or with me.
        </p>
        {(playlistId || playlistUrl) && (
          <div className="mx-auto mb-8 w-full max-w-3xl">
            {playlistId && (
              previewLoaded ? (
                <iframe
                  className="aspect-video w-full rounded-card border-0"
                  src={`https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(playlistId)}`}
                  title="Must-Watch playlist"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPreviewLoaded(true)}
                  className="group flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-card bg-sage p-6 text-olive transition-colors hover:bg-sage/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-butter"
                  aria-label="Watch the playlist"
                >
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-olive text-cream transition-transform group-hover:scale-105">
                    <svg className="ml-1 h-10 w-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className="text-lg font-semibold">Watch the playlist</span>
                </button>
              )
            )}
            {playlistUrl && (
              <a
                href={playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full border border-cream/50 px-6 py-2 font-semibold text-cream underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-butter"
              >
                Open playlist
              </a>
            )}
          </div>
        )}
        {displayPlaylists.length > 0 && (
          <div className="mt-8 text-left">
            <ul
              className="max-h-[24rem] space-y-3 overflow-y-auto overscroll-contain pr-2"
              aria-label="YouTube playlists"
            >
              {displayPlaylists.map((playlist) => (
                <li key={playlist.playlistId}>
                  <a
                    href={playlist.playlistId === playlistId && playlistUrl
                      ? playlistUrl
                      : `https://www.youtube.com/playlist?list=${encodeURIComponent(playlist.playlistId)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[64px] items-center gap-4 rounded-card border border-cream/25 bg-cream/10 p-4 text-cream transition-colors hover:bg-cream/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-butter"
                  >
                    <span
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-butter text-olive"
                      aria-hidden="true"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                    <span className="font-semibold group-hover:underline">
                      {playlist.title}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {playlistsError && (
          <p className="mt-6 text-cream" role="status">
            Playlists could not be loaded right now.
          </p>
        )}
        {!playlistsError && playlists.length === 0 && (
          <p className="mt-6 text-cream">No public playlists are available.</p>
        )}
      </div>
    </Card>
  )
}

function HowITeach() {
  const points = [
    'Self-concept work over quick techniques',
    'Law of Assumption as the foundation',
    'In-depth uprooting of limiting beliefs',
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

export function VideosSection({ playlists, playlistsError, mustWatchPlaylistUrl, mustWatchPlaylistId, videosImage }: VideosSectionProps) {
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
          <SectionImage
            sanityImage={videosImage}
            doodleName="videos"
            alt="Videos illustration"
            className="max-w-[260px] mx-auto lg:max-w-md lg:mx-0"
          />
        </div>
        <MustWatchCallout
          playlistUrl={mustWatchPlaylistUrl}
          playlistId={mustWatchPlaylistId}
          playlists={playlists}
          playlistsError={playlistsError}
        />
      </div>
    </Section>
  )
}