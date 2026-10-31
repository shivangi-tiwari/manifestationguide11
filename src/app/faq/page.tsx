import { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity/client'
import { queries } from '@/lib/sanity/queries'
import { MainLayout } from '@/components/layout/MainLayout'
import { FAQ } from '@/components/sections/FAQ'
import { Section } from '@/components/ui/Section'
import type { SiteSettings, FAQ as FAQType } from '@/types'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about manifestation coaching, packages, sessions, and more.',
}

async function getFAQData() {
  const [siteSettings, faqs] = await Promise.all([
    sanityFetch<SiteSettings | null>({ query: queries.siteSettings, tags: ['sanity', 'faq'] }),
    sanityFetch<FAQType[]>({ query: queries.faqs, tags: ['sanity', 'faq'] }),
  ])
  return { siteSettings, faqs }
}

export default async function FAQPage() {
  const { siteSettings, faqs } = await getFAQData()

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
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">Frequently Asked Questions</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Everything you need to know before starting your manifestation journey.
          </p>
        </div>
      </Section>

      <FAQ
        headline="Common Questions"
        subheadline="Can't find your answer? <a href='/contact' className='text-purple-600 dark:text-purple-400 underline'>Contact me directly</a>."
        faqs={faqs || []}
      />

      <Section variant="dark" size="md" className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Still have questions?</h2>
        <p className="text-white/70 mb-8 max-w-2xl mx-auto">I&apos;m happy to answer any other questions you might have.</p>
        <a href="/contact" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors">
          Contact Me
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </a>
      </Section>
    </MainLayout>
  )
}