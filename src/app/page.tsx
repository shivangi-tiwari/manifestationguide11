import { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity/client'
import { queries } from '@/lib/sanity/queries'
import { MainLayout } from '@/components/layout/MainLayout'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { FeaturedVideos } from '@/components/sections/FeaturedVideos'
import { Packages } from '@/components/sections/Packages'
import { SuccessStories } from '@/components/sections/SuccessStories'
import { FAQ } from '@/components/sections/FAQ'
import { Contact } from '@/components/sections/Contact'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Manifest your dream life with proven manifestation techniques. 1:1 coaching, guided programs, and free resources.',
}

async function getHomeData() {
  const [siteSettings, packages, videos, stories, faqs] = await Promise.all([
    sanityFetch({ query: queries.siteSettings, tags: ['sanity', 'home'] }),
    sanityFetch({ query: queries.featuredPackages, tags: ['sanity', 'home'] }),
    sanityFetch({ query: queries.featuredVideos, tags: ['sanity', 'home'] }),
    sanityFetch({ query: queries.featuredSuccessStories, tags: ['sanity', 'home'] }),
    sanityFetch({ query: queries.faqs, tags: ['sanity', 'home'] }),
  ])

  return { siteSettings, packages, videos, stories, faqs }
}

export default async function HomePage() {
  const { siteSettings, packages, videos, stories, faqs } = await getHomeData()

  const heroVideoId = siteSettings?.hero?.videoId
  const heroTitle = siteSettings?.hero?.title || 'Manifest Your Dream Life'
  const heroSubtitle = siteSettings?.hero?.subtitle || 'Proven manifestation techniques to transform your reality. 1:1 coaching, guided programs, and a supportive community.'

  return (
    <MainLayout
      siteName={siteSettings?.title || 'Manifestation Coach'}
      tagline={siteSettings?.tagline}
      instagramHandle={siteSettings?.instagramHandle}
      email={siteSettings?.contactEmail}
    >
      <Hero
        headline={heroTitle}
        subheadline={heroSubtitle}
        videoId={heroVideoId}
        videoTitle={siteSettings?.hero?.videoTitle}
        ctaText="Start Your Journey"
        ctaHref="/contact"
        secondaryCtaText="Watch Free Videos"
        secondaryCtaHref="/videos"
      />

      <About
        headline="About Your Coach"
        subheadline="Meet the guide behind your transformation"
        content={siteSettings?.aboutSummary || []}
        instagramHandle={siteSettings?.instagramHandle}
        image={siteSettings?.aboutSummary?.[0]?.asset?._ref ? undefined : '/coach-placeholder.jpg'}
      />

      <FeaturedVideos
        headline="Latest Insights"
        subheadline="Free manifestation guidance on YouTube"
        videos={videos || []}
      />

      <Packages
        headline="Coaching Packages"
        subheadline="Choose the path that fits your journey"
        packages={packages || []}
      />

      <SuccessStories
        headline="Real Transformations"
        subheadline="Stories from people who manifested their dreams"
        stories={stories || []}
      />

      <FAQ
        headline="Frequently Asked Questions"
        subheadline="Everything you need to know before starting"
        faqs={faqs || []}
      />

      <Contact
        headline="Ready to Begin?"
        subheadline="Submit an inquiry and I'll personally review it within 24 hours"
        content={siteSettings?.contactEmail ? [{ _type: 'block', children: [{ _type: 'span', text: `Questions? Email me at ${siteSettings.contactEmail}` }] }] : []}
        packages={packages || []}
        onSubmit={async (data) => {
          const res = await fetch('/api/inquiry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
          if (!res.ok) throw new Error('Failed to submit inquiry')
        }}
        turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
        instagramHandle={siteSettings?.instagramHandle}
        email={siteSettings?.contactEmail}
      />
    </MainLayout>
  )
}