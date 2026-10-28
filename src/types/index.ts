// Sanity document types (placeholders for Phase 2+)
export interface SanityDocument {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
}

export interface SiteSettings extends SanityDocument {
  _type: 'siteSettings'
  title: string
  tagline: string
  hero: {
    heading: string
    subheading: string
    ctaText: string
  }
  aboutSummary: string
  contactEmail: string
  whatsappNumber?: string
  socialLinks: {
    instagram?: string
    youtube?: string
    twitter?: string
    linkedin?: string
  }
  youtubeChannelId?: string
  seoDefaults: {
    title: string
    description: string
    ogImage?: string
  }
  footerText: string
  disclaimerText: string
}

export interface Package extends SanityDocument {
  _type: 'package'
  title: string
  slug: { current: string }
  shortDescription: string
  fullDescription: unknown // Portable Text
  price: number
  currency: string
  priceNote?: string
  duration?: string
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
  order: number
  source: 'youtube-sync' | 'manual'
}

export interface SuccessStory extends SanityDocument {
  _type: 'successStory'
  clientName: string
  photo?: unknown // Sanity image
  headline: string
  story: unknown // Portable Text
  youtubeVideoId?: string
  date: string
  featured: boolean
  order: number
  published: boolean
}

export interface FAQ extends SanityDocument {
  _type: 'faq'
  question: string
  answer: string
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
  status: 'new' | 'replied' | 'closed'
  createdAt: string
  source: string
}