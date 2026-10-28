'use client'

import { Header } from './Header'
import { Footer } from '@/components/sections/Footer'
import { clsx } from 'clsx'

interface MainLayoutProps {
  children: React.ReactNode
  siteName: string
  tagline?: string
  instagramHandle?: string
  email?: string
}

export function MainLayout({
  children,
  siteName,
  tagline,
  instagramHandle,
  email,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header siteName={siteName} instagramHandle={instagramHandle} />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer
        siteName={siteName}
        tagline={tagline}
        instagramHandle={instagramHandle}
        email={email}
      />
    </div>
  )
}