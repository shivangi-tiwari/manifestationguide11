import type { Metadata } from 'next'
import { PolicyContentPage } from '@/components/sections/PolicyContentPage'
import { sanityFetch } from '@/lib/sanity/client'
import { queries } from '@/lib/sanity/queries'
import type { SiteSettings } from '@/types'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for manifestation coaching services.',
}

export default async function TermsPage() {
  const siteSettings = await sanityFetch<SiteSettings | null>({
    query: queries.siteSettings,
    tags: ['sanity'],
  })

  return (
    <PolicyContentPage
      title="Terms & Conditions"
      content={siteSettings?.policies?.termsConditions}
      siteSettings={siteSettings}
    />
  )
}
