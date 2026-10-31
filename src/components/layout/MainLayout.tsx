'use client'

import { Navbar } from './Navbar'
import { Footer } from '@/components/sections/Footer'
import { clsx } from 'clsx'

interface MainLayoutProps {
  children: React.ReactNode
  siteName: string
  tagline?: string
  instagramHandle?: string
  email?: string
  youtubeChannelId?: string
  mustWatchPlaylistUrl?: string
  footerText?: string
  disclaimerText?: string
}

export function MainLayout({
  children,
  siteName,
  tagline,
  instagramHandle,
  email,
  youtubeChannelId,
  mustWatchPlaylistUrl,
  footerText,
  disclaimerText,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar siteName={siteName} instagramHandle={instagramHandle} />
      <main id="main-content" className="flex-1 pt-16">
        {children}
      </main>
      <Footer
        siteName={siteName}
        tagline={tagline}
        instagramHandle={instagramHandle}
        email={email}
        youtubeChannelId={youtubeChannelId}
        mustWatchPlaylistUrl={mustWatchPlaylistUrl}
        copyrightText={footerText}
        disclaimerText={disclaimerText}
      />
    </div>
  )
}