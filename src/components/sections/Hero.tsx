'use client'

import { Section } from '@/components/ui/Section'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { Button } from '@/components/ui/Button'
import { clsx } from 'clsx'

interface HeroProps {
  headline: string
  subheadline?: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  videoId?: string
  videoTitle?: string
  backgroundImage?: string
}

export function Hero({
  headline,
  subheadline,
  ctaText = 'Start Your Journey',
  ctaHref = '/contact',
  secondaryCtaText = 'Watch Free Content',
  secondaryCtaHref = '/videos',
  videoId,
  videoTitle,
}: HeroProps) {
  return (
    <Section variant="dark" size="xl" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-space-cadet-900/80 via-warm-brown-700/60 to-deep-burgundy-700/80" />
      {videoId && (
        <div className="absolute inset-0 z-0">
          <YouTubeEmbed videoId={videoId} title={videoTitle} lazy={false} className="opacity-20 pointer-events-none" />
        </div>
      )}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="text-sm font-medium text-accent-foreground">Accepting new clients for Q1 2025</span>
        </div>
        <h1 className="text-display-xl font-display font-bold text-background tracking-tight mb-6 leading-[1.1]">
          {headline}
        </h1>
        {subheadline && (
          <p className="text-body-lg md:text-heading-md lg:text-heading-lg text-background/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            {subheadline}
          </p>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" variant="primary" className="w-full sm:w-auto" asChild>
            <a href={ctaHref} className="w-full">
              {ctaText}
            </a>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto border-background/30 text-background hover:bg-background/10" asChild>
            <a href={secondaryCtaHref} className="w-full">
              {secondaryCtaText}
            </a>
          </Button>
        </div>
        <p className="mt-8 text-background/70 text-sm">
          No payment required to inquire. All sessions are 1:1 via Zoom.{' '}
          <a href="/terms" className="underline hover:text-background">Terms apply</a>
        </p>
      </div>
    </Section>
  )
}