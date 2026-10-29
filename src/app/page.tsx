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
import type { SiteSettings, Package, Video, SuccessStory, FAQ as FAQType, SanityImageBlock } from '@/types'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Manifest your dream life with proven manifestation techniques. 1:1 coaching, guided programs, and free resources.',
}

async function getHomeData() {
  const [siteSettings, packages, videos, stories, faqs] = await Promise.all([
    sanityFetch<SiteSettings | null>({ query: queries.siteSettings, tags: ['sanity', 'home'] }),
    sanityFetch<Package[]>({ query: queries.featuredPackages, tags: ['sanity', 'home'] }),
    sanityFetch<Video[]>({ query: queries.featuredVideos, tags: ['sanity', 'home'] }),
    sanityFetch<SuccessStory[]>({ query: queries.featuredSuccessStories, tags: ['sanity', 'home'] }),
    sanityFetch<FAQType[]>({ query: queries.faqs, tags: ['sanity', 'home'] }),
  ])

  return { siteSettings, packages, videos, stories, faqs }
}

export default async function HomePage() {
  const { siteSettings, packages, videos, stories, faqs } = await getHomeData()

  // Transform packages to match Packages component's expected shape
  const displayPackages = (packages || []).map((pkg) => ({
    _id: pkg._id,
    name: pkg.title,
    description: pkg.shortDescription,
    price: pkg.price,
    duration: pkg.duration || 'Monthly',
    sessions: pkg.sessions || 4,
    features: pkg.fullDescription ? ['Personalized guidance', 'Weekly check-ins', 'Resource library'] : [],
    popular: pkg.featured,
    ctaText: 'Select Package',
  }))

  // Transform stories to match SuccessStories component's expected shape
  const displayStories = (stories || []).map((story) => ({
    _id: story._id,
    name: story.clientName,
    location: undefined,
    headline: story.headline,
    story: (story.story as any[]) || [],
    image: story.photo as string | undefined,
    rating: undefined,
    packageName: undefined,
  }))

  const heroVideoId = siteSettings?.hero?.videoId
  const heroTitle = siteSettings?.hero?.title || 'Manifest Your Dream Life'
  const heroSubtitle = siteSettings?.hero?.subtitle || 'Proven manifestation techniques to transform your reality. 1:1 coaching, guided programs, and a supportive community.'

  // Transform packages for Contact component
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
        image={(siteSettings?.aboutSummary?.[0] as SanityImageBlock)?.asset?._ref ? undefined : '/coach-placeholder.jpg'}
      />

      <FeaturedVideos
        headline="Latest Insights"
        subheadline="Free manifestation guidance on YouTube"
        videos={videos || []}
      />

      <Packages
        headline="Coaching Packages"
        subheadline="Choose the path that fits your journey"
        packages={displayPackages}
      />

      <SuccessStories
        headline="Real Transformations"
        subheadline="Stories from people who manifested their dreams"
        stories={displayStories}
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
        packages={contactPackages}
        turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
        instagramHandle={siteSettings?.instagramHandle}
        email={siteSettings?.contactEmail}
      />
    </MainLayout>
  )
}