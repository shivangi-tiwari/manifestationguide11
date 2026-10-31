import { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity/client'
import { queries } from '@/lib/sanity/queries'
import { MainLayout } from '@/components/layout/MainLayout'
import { Contact } from '@/components/sections/Contact'
import { Section } from '@/components/ui/Section'
import type { SiteSettings, Package } from '@/types'

export const metadata: Metadata = {
  title: 'Contact & Inquiries',
  description: 'Send an inquiry about coaching sessions.',
}

async function getContactData() {
  const [siteSettings, packages] = await Promise.all([
    sanityFetch<SiteSettings | null>({ query: queries.siteSettings, tags: ['sanity', 'contact'] }),
    sanityFetch<Package[]>({ query: queries.packages, tags: ['sanity', 'contact'] }),
  ])
  return { siteSettings, packages }
}

export default async function ContactPage() {
  const { siteSettings, packages } = await getContactData()

  // Transform packages to match Contact component's expected shape
  const contactPackages = (packages || []).map((pkg) => ({
    _id: pkg._id,
    name: pkg.title,
    price: pkg.price,
  }))

  return (
    <MainLayout
      siteName={siteSettings?.title || 'Manifestation Coach'}
      tagline={siteSettings?.tagline}
      instagramHandle={siteSettings?.instagramHandle}
      email={siteSettings?.contactEmail}
      youtubeChannelId={siteSettings?.youtubeChannelId}
      mustWatchPlaylistUrl={siteSettings?.mustWatchPlaylistUrl}
    >
      <Section variant="dark" size="xl" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-orange-900/50" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">Start Your Transformation</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Send a message about coaching sessions.
          </p>
        </div>
      </Section>

      <Contact
        headline="Submit Your Inquiry"
        subheadline="Share your questions about coaching."
        packages={contactPackages}
        turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
        instagramHandle={siteSettings?.instagramHandle}
        email={siteSettings?.contactEmail}
      />
    </MainLayout>
  )
}