import { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity/client'
import { queries } from '@/lib/sanity/queries'
import { MainLayout } from '@/components/layout/MainLayout'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PortableText } from '@/components/ui/PortableText'
import type { SiteSettings, Package } from '@/types'

export const metadata: Metadata = {
  title: 'Coaching Packages',
  description: 'Choose from our manifestation coaching packages. 1:1 Zoom sessions, personalized guidance, and proven techniques.',
}

async function getPackagesData() {
  const [siteSettings, packages] = await Promise.all([
    sanityFetch<SiteSettings | null>({ query: queries.siteSettings, tags: ['sanity', 'packages'] }),
    sanityFetch<Package[]>({ query: queries.packages, tags: ['sanity', 'packages'] }),
  ])
  return { siteSettings, packages }
}

export default async function PackagesPage() {
  const { siteSettings, packages } = await getPackagesData()

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
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">Coaching Packages</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Choose the path that aligns with your goals. All packages include 1:1 Zoom sessions, personalized action plans, and ongoing support.
          </p>
        </div>
      </Section>

      <Section variant="alternate" size="lg">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages?.map((pkg) => (
            <Card key={pkg._id} variant={pkg.featured ? 'elevated' : 'outlined'} padding="lg" className="relative flex flex-col">
              {pkg.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle>{pkg.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {pkg.currency || '₹'}{pkg.price.toLocaleString('en-IN')}
                  </span>
                  {pkg.priceNote && <span className="text-gray-500 dark:text-gray-400 ml-2">{pkg.priceNote}</span>}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{pkg.shortDescription}</p>
                <ul className="space-y-3 mb-6">
                  {pkg.fullDescription && (
                    <PortableText value={pkg.fullDescription} className="prose dark:prose-invert max-w-none" />
                  )}
                </ul>
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <p>{pkg.duration}</p>
                  {pkg.sessions && <p>{pkg.sessions} 1:1 Zoom sessions</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={pkg.featured ? 'primary' : 'outline'} asChild>
                  <a href={`/contact?package=${pkg._id}`}>Select This Package</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Section>

      <Section variant="dark" size="md" className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Still not sure which package is right for you?</h2>
        <p className="text-white/70 mb-8 max-w-2xl mx-auto">Book a free 15-minute clarity call to discuss your goals and find the perfect fit.</p>
        <Button size="lg" asChild>
          <a href="/contact">Book Clarity Call</a>
        </Button>
      </Section>
    </MainLayout>
  )
}