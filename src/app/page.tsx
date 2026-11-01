import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity/client'
import { queries } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import { MainLayout } from '@/components/layout/MainLayout'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { VideosSection } from '@/components/sections/VideosSection'
import { StoriesSection } from '@/components/sections/StoriesSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { fetchChannelPlaylists } from '@/lib/youtube'
import type { YouTubePlaylist } from '@/lib/youtube'
import type { SiteSettings, Package, Video, SuccessStory, FAQ as FAQType } from '@/types'

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await sanityFetch<SiteSettings | null>({
    query: queries.siteSettings,
    tags: ['sanity', 'home'],
  })

  const title =
    siteSettings?.seoDefaults?.title?.trim() ||
    siteSettings?.title?.trim() ||
    'Manifestation Guide'
  const description =
    siteSettings?.seoDefaults?.description?.trim() ||
    siteSettings?.tagline?.trim() ||
    undefined
  const imageSource = siteSettings?.seoDefaults?.ogImage
  const imageUrl = imageSource?.asset?._ref
    ? urlFor(imageSource)?.width(1200).height(630).fit('crop').url()
    : undefined
  const images = imageUrl
    ? [{ url: imageUrl, width: 1200, height: 630, alt: title }]
    : undefined

  return {
    title: { absolute: title },
    description,
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      siteName: siteSettings?.title || 'Manifestation Guide',
      title,
      description,
      images,
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title,
      description,
      images,
    },
  }
}

async function getHomeData() {
  const [siteSettings, packages, stories, successStoryVideos, faqs] = await Promise.all([
    sanityFetch<SiteSettings | null>({ query: queries.siteSettings, tags: ['sanity', 'home'] }),
    sanityFetch<Package[]>({ query: queries.packages, tags: ['sanity', 'home'] }),
    sanityFetch<SuccessStory[]>({ query: queries.successStories, tags: ['sanity', 'home'] }),
    sanityFetch<Video[]>({ query: queries.successStoryVideos, tags: ['sanity', 'home'] }),
    sanityFetch<FAQType[]>({ query: queries.faqs, tags: ['sanity', 'home'] }),
  ])

  const playlists: YouTubePlaylist[] = []
  let playlistsError = false
  const channelId = siteSettings?.youtubeChannelId?.trim() || process.env.YOUTUBE_CHANNEL_ID?.trim()
  const apiKey = process.env.YOUTUBE_API_KEY?.trim()

  if (channelId && apiKey) {
    try {
      playlists.push(...await fetchChannelPlaylists(channelId, apiKey))
    } catch (error) {
      console.error('Failed to load YouTube playlists.', error)
      playlistsError = true
    }
  } else {
    console.error('Cannot load YouTube playlists: the channel ID or API key is missing.')
    playlistsError = true
  }

  return { siteSettings, packages, stories, successStoryVideos, faqs, playlists, playlistsError }
}

export default async function HomePage() {
  const { siteSettings, packages, stories, successStoryVideos, faqs, playlists, playlistsError } = await getHomeData()

  // Transform packages for ContactSection (minimal shape)
  const contactPackages = (packages || []).map((pkg) => ({
    _id: pkg._id,
    title: pkg.title,
    price: pkg.price,
  }))

  const sectionImages = siteSettings?.sectionImages

  return (
    <MainLayout
      siteName={siteSettings?.title || 'Manifestation Coach'}
      tagline={siteSettings?.tagline}
      instagramHandle={siteSettings?.instagramHandle}
      email={siteSettings?.contactEmail}
      youtubeChannelId={siteSettings?.youtubeChannelId}
      mustWatchPlaylistUrl={siteSettings?.mustWatchPlaylistUrl}
      footerText={siteSettings?.footerText}
      developerCredit={siteSettings?.developerCredit}
      disclaimerText={siteSettings?.disclaimerText}
    >
      <HeroSection
        siteName={siteSettings?.title || 'Manifestation Coach'}
        tagline={siteSettings?.tagline}
        hero={siteSettings?.hero}
        heroImage={sectionImages?.hero}
      />
      <AboutSection
        aboutSummary={siteSettings?.aboutSummary}
        aboutSubtitle={siteSettings?.aboutSubtitle}
        instagramHandle={siteSettings?.instagramHandle}
        aboutImage={sectionImages?.about}
      />
      <VideosSection
        playlists={playlists}
        playlistsError={playlistsError}
        mustWatchPlaylistUrl={siteSettings?.mustWatchPlaylistUrl}
        mustWatchPlaylistId={siteSettings?.mustWatchPlaylistId}
        videosImage={sectionImages?.videos}
      />
      <StoriesSection
        stories={stories || []}
        syncedStoryVideos={successStoryVideos || []}
        storiesSubtitle={siteSettings?.storiesSubtitle}
        storiesImage={sectionImages?.stories}
      />
      <ContactSection
        packages={contactPackages}
        faqs={faqs || []}
        turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
        instagramHandle={siteSettings?.instagramHandle}
        email={siteSettings?.contactEmail}
        contactIntro={siteSettings?.contactIntro}
      />
    </MainLayout>
  )
}