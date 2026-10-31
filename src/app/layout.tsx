import type { Metadata, Viewport } from 'next'
import { Arimo, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const arimo = Arimo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arimo',
  display: 'swap',
  preload: true,
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'Manifestation Coach - Transform Your Reality',
    template: '%s | Manifestation Coach',
  },
  description: 'Manifest your dream life with proven manifestation techniques. 1:1 coaching, guided programs, and free resources.',
  keywords: ['manifestation', 'coaching', 'law of attraction', 'mindset', 'personal development', 'spirituality'],
  authors: [{ name: 'Manifestation Coach' }],
  creator: 'Manifestation Coach',
  publisher: 'Manifestation Coach',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://manifestationcoach.in',
    siteName: 'Manifestation Coach',
    title: 'Manifestation Coach - Transform Your Reality',
    description: 'Manifest your dream life with proven manifestation techniques. 1:1 coaching, guided programs, and free resources.',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Manifestation Coach',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manifestation Coach - Transform Your Reality',
    description: 'Manifest your dream life with proven manifestation techniques.',
    images: ['/og-default.jpg'],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFF5D6' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1A1A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${arimo.variable} ${cormorant.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body className="min-h-screen bg-cream text-olive dark:bg-olive dark:text-cream antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}