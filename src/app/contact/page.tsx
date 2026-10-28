import { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity/client'
import { queries } from '@/lib/sanity/queries'
import { MainLayout } from '@/components/layout/MainLayout'
import { Contact } from '@/components/sections/Contact'
import { Section } from '@/components/ui/Section'

export const metadata: Metadata = {
  title: 'Contact & Inquiries',
  description: 'Ready to start your manifestation journey? Submit an inquiry and I\'ll get back to you within 24 hours.',
}

async function getContactData() {
  const [siteSettings, packages] = await Promise.all([
    sanityFetch({ query: queries.siteSettings, tags: ['sanity', 'contact'] }),
    sanityFetch({ query: queries.packages, tags: ['sanity', 'contact'] }),
  ])
  return { siteSettings, packages }
}

export default async function ContactPage() {
  const { siteSettings, packages } = await getContactData()

  return (
    <MainLayout
      siteName={siteSettings?.title || 'Manifestation Coach'}
      tagline={siteSettings?.tagline}
      instagramHandle={siteSettings?.instagramHandle}
      email={siteSettings?.contactEmail}
    >
      <Section variant="dark" size="xl" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-orange-900/50" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">Start Your Transformation</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Submit an inquiry and I'll personally review it within 24 hours. No payment required upfront.
          </p>
        </div>
      </Section>

      <Contact
        headline="Submit Your Inquiry"
        subheadline="Tell me about your goals and I'll recommend the best path forward"
        packages={packages || []}
        onSubmit={async (data) => {
          const res = await fetch('/api/inquiry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
          if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || 'Failed to submit inquiry')
          }
        }}
        turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
        instagramHandle={siteSettings?.instagramHandle}
        email={siteSettings?.contactEmail}
      />
    </MainLayout>
  )
}