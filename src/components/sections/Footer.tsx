'use client'

import { InstagramButton } from '@/components/ui/InstagramButton'
import Link from 'next/link'
import { getContactEmail } from '@/lib/utils'
import { Mail } from 'lucide-react'

interface FooterProps {
  siteName: string
  tagline?: string
  instagramHandle?: string
  email?: string
  youtubeChannelId?: string
  mustWatchPlaylistUrl?: string
  copyrightText?: string
  disclaimerText?: string
  policyPages?: Array<{ label: string; href: string }>
}

export function Footer({
  siteName,
  tagline,
  instagramHandle,
  email,
  youtubeChannelId,
  mustWatchPlaylistUrl,
  copyrightText,
  disclaimerText,
  policyPages = [
    { label: 'Terms & Conditions', href: '/terms' },
  ],
}: FooterProps) {
  const currentYear = new Date().getFullYear()
  const contactEmail = getContactEmail(email) || 'manifestationcoach55@gmail.com'
  const youtubeUrl = youtubeChannelId
    ? `https://www.youtube.com/@${youtubeChannelId}`
    : 'https://www.youtube.com/@ManifestationGuide11'
  const playlistUrl = mustWatchPlaylistUrl || 'https://www.youtube.com/@ManifestationGuide11/playlists'
  const instagramUrl = `https://instagram.com/${(instagramHandle || 'manifestationcoach55').replace('@', '')}`

  return (
    <footer className="bg-olive text-cream border-t border-cream/20" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <h3 className="text-2xl font-display font-bold text-cream mb-4">
              {siteName}
            </h3>
            {tagline && <p className="text-cream max-w-xs mb-6">{tagline}</p>}
            {instagramHandle && (
              <InstagramButton handle={instagramHandle} variant="default" size="md" />
            )}
          </div>
          <nav>
            <h4 className="font-semibold text-cream mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {policyPages.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="inline-flex min-h-[44px] items-center text-cream hover:text-cream underline-offset-4 hover:underline transition-colors"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={playlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center text-cream hover:text-cream underline-offset-4 hover:underline transition-colors"
                >
                  YouTube Playlist
                </a>
              </li>
            </ul>
          </nav>
          <nav>
            <h4 className="font-semibold text-cream mb-4">Connect</h4>
            <ul className="space-y-3">
              {contactEmail && (
                <li>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="inline-flex min-h-[44px] items-center gap-2 text-cream hover:text-cream underline-offset-4 hover:underline transition-colors"
                  >
                    <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
                    {contactEmail}
                  </a>
                </li>
              )}
              <li>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 text-cream hover:text-cream underline-offset-4 hover:underline transition-colors"
                >
                  <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  {instagramHandle ? `@${instagramHandle.replace('@', '')}` : 'Instagram'}
                </a>
              </li>
              <li>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 text-cream hover:text-cream underline-offset-4 hover:underline transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  YouTube
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="pt-8 border-t border-cream/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream text-sm">
            {copyrightText || `© ${currentYear} ${siteName}. All rights reserved.`}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
            {disclaimerText === undefined ? (
              <p className="text-cream text-sm">No refunds. Prices are subject to change.</p>
            ) : disclaimerText.trim() ? (
              <p className="text-cream text-sm">{disclaimerText}</p>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  )
}