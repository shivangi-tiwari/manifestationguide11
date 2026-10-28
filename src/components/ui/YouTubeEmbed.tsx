'use client'

import { useState, useEffect, useRef } from 'react'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
  lazy?: boolean
  className?: string
}

export function YouTubeEmbed({ videoId, title, lazy = true, className }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(!lazy)
  const [isPlaying, setIsPlaying] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!lazy) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '200px' }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [lazy])

  const handleClick = () => {
    if (!isPlaying && iframeRef.current) {
      setIsPlaying(true)
      iframeRef.current.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
    }
  }

  if (!isLoaded) {
    return (
      <div
        ref={containerRef}
        className={clsx('relative aspect-video rounded-xl bg-gray-100 dark:bg-gray-800 cursor-pointer overflow-hidden', className)}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        aria-label={`Play video: ${title || videoId}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
        {title && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <p className="text-white text-sm font-medium truncate">{title}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={clsx('relative aspect-video rounded-xl overflow-hidden', className)}>
      <iframe
        ref={iframeRef}
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