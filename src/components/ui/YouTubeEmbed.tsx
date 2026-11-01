'use client'

import { useState } from 'react'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
  lazy?: boolean
  className?: string
}

export function YouTubeEmbed({ videoId, title, lazy = true, className }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(!lazy)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleClick = () => {
    setIsLoaded(true)
    setIsPlaying(true)
  }

  if (!isLoaded) {
    return (
      <button
        type="button"
        className={clsx(
          'relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-olive text-cream',
          className
        )}
        onClick={handleClick}
        aria-label={`Play video: ${title || videoId}`}
      >
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream/15 shadow-lg md:h-24 md:w-24">
          <svg className="ml-1 h-8 w-8 md:h-10 md:w-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        {title && (
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-left text-sm font-medium text-white">
            {title}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className={clsx('relative aspect-video rounded-xl overflow-hidden', className)}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1${isPlaying ? '&autoplay=1' : ''}`}
        title={title || `YouTube video: ${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
        loading={lazy ? 'lazy' : 'eager'}
      />
    </div>
  )
}

import { clsx } from 'clsx'