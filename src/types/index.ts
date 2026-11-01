import type { PortableTextBlock } from '@portabletext/react'

// Sanity image block type (extends PortableTextBlock for image blocks)
export interface SanityImageBlock {
  _type: 'image'
  asset: {
    _ref: string
  }
  alt?: string
  caption?: PortableTextBlock[]
}

export interface SanityDocument {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
}

export interface Page extends SanityDocument {
  _type: 'page'
  title: string
  slug: { current: string }
  body: PortableTextBlock[]
  seo?: {
    title?: string
    description?: string
    ogTitle?: string
    ogImage?: string
  }
}

export interface SiteSettings extends SanityDocument {
  _type: 'siteSettings'
  title: string
  tagline: string
  hero?: {
    heading?: string
    subheading?: string
    ctaText?: string
    ctaLink?: string
  }
  aboutSummary?: string
  aboutSubtitle?: string
  contactEmail: string
  instagramHandle?: string
  socialLinks: {
    instagram?: string
    youtube?: string
    twitter?: string
    linkedin?: string
  }
  youtubeChannelId?: string
  mandatoryPlaylistId?: string
  mustWatchPlaylistUrl?: string
  mustWatchPlaylistId?: string
  contactIntro?: string
  storiesSubtitle?: string
  seoDefaults: {
    title: string
    description: string
    ogImage?: string
  }
  footerText?: string
  developerCredit?: string
  disclaimerText?: string
  policies?: {
    termsConditions?: PortableTextBlock[]
  }
  sectionImages?: {
    hero?: SanityImageBlock
    about?: SanityImageBlock
    videos?: SanityImageBlock
    stories?: SanityImageBlock
    contact?: SanityImageBlock
  }
}

export interface Package extends SanityDocument {
  _type: 'package'
  title: string
  slug: { current: string }
  shortDescription: string
  fullDescription: PortableTextBlock[]
  price: number
  currency: string
  priceNote?: string
  duration?: string
  sessions?: number
  featured: boolean
  order: number
  published: boolean
}

export interface Video extends SanityDocument {
  _type: 'video'
  title: string
  youtubeId: string
  description?: string
  thumbnailUrl?: string
  publishedAt: string
  category?: string
  featured: boolean
  hidden: boolean
  isSuccessStory?: boolean
  order: number
  source: 'youtube-sync' | 'manual'
}

export interface SuccessStory extends SanityDocument {
  _type: 'successStory'
  clientName: string
  photo?: SanityImageBlock
  headline: string
  story: PortableTextBlock[]
  youtubeVideoId?: string
  date: string
  location?: string
  featured: boolean
  order: number
  published: boolean
}

export interface FAQ extends SanityDocument {
  _type: 'faq'
  question: string
  answer: PortableTextBlock[]
  order: number
}

export interface Inquiry extends SanityDocument {
  _type: 'inquiry'
  name: string
  email: string
  phone?: string
  interest?: string // package reference or free text
  message: string
  preferredTiming?: string
  termsAccepted: boolean
  status: 'new' | 'replied' | 'closed'
  createdAt: string
  source: string
}