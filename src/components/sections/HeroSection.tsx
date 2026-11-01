'use client'

import { SectionImage } from '@/components/ui/SectionImage'
import { Button } from '@/components/ui/Button'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import Link from 'next/link'

interface HeroSectionProps {
  siteName: string
  tagline?: string
  hero?: {
    heading?: string
    subheading?: string
    ctaText?: string
    ctaLink?: string
  }
  heroImage?: any
}

export function HeroSection({ siteName, tagline, hero, heroImage }: HeroSectionProps) {
  const heading = hero?.heading || siteName
  const subheading = hero?.subheading || tagline
  const ctaHref = hero?.ctaLink?.trim() || '#contact'
  const ctaText = hero?.ctaText || 'Book a session'

  return (
    <section
      id="home"
      className="relative bg-cream py-[clamp(4rem,8vw,6rem)]"
      aria-labelledby="home-heading"
    >
      <RevealOnScroll className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <p className="mb-4 text-base font-semibold uppercase tracking-[0.2em] text-brown">
              <span className="mr-3 font-display text-3xl">01</span>
              Manifestation coach
            </p>
            <h1
              id="home-heading"
              className="mb-6 text-[clamp(2.75rem,8vw,6.5rem)] font-display font-bold leading-[0.9] tracking-tight text-foreground"
            >
              {heading}
            </h1>
            {subheading && (
              <p className="text-body-lg text-muted max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                {subheading}
              </p>
            )}
            <Button asChild size="lg" className="w-full sm:w-auto min-h-[48px]">
              <Link
                href={ctaHref}
                onClick={(e) => {
                  if (ctaHref !== '#contact') return
                  e.preventDefault()
                  const target = document.getElementById('contact')
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    history.replaceState(null, '', '#contact')
                  }
                }}
              >
                {ctaText}
              </Link>
            </Button>
          </div>
          <div className="relative">
            <SectionImage
            sanityImage={heroImage}
            doodleName="hero"
            alt={siteName}
            priority
            className="max-w-[260px] mx-auto lg:max-w-md lg:mx-0"
          />
          </div>
        </div>
      </RevealOnScroll>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[clamp(2rem,5vw,4rem)] w-full fill-sage"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
      >
        <path d="M0 32 C120 0 240 64 360 32 C480 0 600 64 720 32 C840 0 960 64 1080 32 C1200 0 1320 64 1440 32 L1440 80 L0 80 Z" />
      </svg>
    </section>
  )
}