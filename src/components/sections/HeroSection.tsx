'use client'

import { Doodle } from '@/components/ui/Doodle'
import { Button } from '@/components/ui/Button'
import { clsx } from 'clsx'
import Link from 'next/link'

interface HeroSectionProps {
  siteName: string
  tagline?: string
}

export function HeroSection({ siteName, tagline }: HeroSectionProps) {
  return (
    <section
      id="home"
      className={clsx('relative bg-cream py-20 md:py-32 lg:py-40')}
      aria-labelledby="home-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <h1
              id="home-heading"
              className="text-display-lg font-display font-bold text-foreground tracking-tight mb-6"
            >
              {siteName}
            </h1>
            {tagline && (
              <p className="text-body-lg text-muted max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                {tagline}
              </p>
            )}
            <Button asChild size="lg" className="w-full sm:w-auto min-h-[48px]">
              <Link
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  const target = document.getElementById('contact')
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    history.replaceState(null, '', '#contact')
                  }
                }}
              >
                Book a session
              </Link>
            </Button>
          </div>
          <div className="relative">
            <Doodle name="hero" className="mx-auto max-w-md" />
          </div>
        </div>
      </div>
    </section>
  )
}