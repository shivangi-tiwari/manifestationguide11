import { Metadata } from 'next'
import { MainLayout } from '@/components/layout/MainLayout'
import { Section } from '@/components/ui/Section'
import { PortableText } from '@/components/ui/PortableText'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund policy for manifestation coaching services - all sales are final.',
}

export default function RefundPage() {
  const refundContent = [
    { _type: 'block', children: [{ _type: 'span', text: 'Last updated: January 2025' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'Please read this policy carefully before purchasing any coaching package or session.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'All Sales Are Final' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'All coaching packages, sessions, and digital products are non-refundable. Once payment is received, no refunds will be issued under any circumstances.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Why No Refunds?' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'When you book a coaching package, we reserve that time exclusively for you. This means we turn away other potential clients. Our preparation, energy, and schedule commitment are invested before our first session even begins.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'What This Covers' }] },
    { _type: 'block', children: [{ _type: 'span', text: '1:1 coaching packages' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'Individual sessions' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'Digital products (worksheets, guides, recordings)' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'Any paid coaching service' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Rescheduling Policy' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'While we don\'t offer refunds, we do allow rescheduling with 24+ hours notice. Please contact us to reschedule.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Exceptional Circumstances' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'In truly exceptional circumstances (medical emergency, etc.), we may offer a credit for future sessions at our sole discretion. This is not guaranteed.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Before You Buy' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'We encourage you to:' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'Watch the mandatory playlist before inquiring' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'Read our FAQ and success stories' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'Book a free clarity call if unsure' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'Review this policy carefully' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Payment Methods' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'We accept GPay and UPI payments only. Payment details are shared after we agree on a schedule.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Contact' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'Questions about this policy? Email manifestationcoach55@gmail.com before purchasing.' }] },
  ]

  return (
    <MainLayout
      siteName="Manifestation Coach"
      tagline="Transform your reality"
      instagramHandle="manifestationcoach55"
      email="manifestationcoach55@gmail.com"
      youtubeChannelId="ManifestationGuide11"
    >
      <Section variant="dark" size="xl" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-orange-900/50" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">Refund Policy</h1>
        </div>
      </Section>

      <Section variant="default" size="lg">
        <div className="max-w-3xl mx-auto">
          <PortableText value={refundContent} />
        </div>
      </Section>
    </MainLayout>
  )
}