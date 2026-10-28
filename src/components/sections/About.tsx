'use client'

import { Section, SectionHeader } from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import { PortableText } from '@/components/ui/PortableText'
import { InstagramButton } from '@/components/ui/InstagramButton'
import { clsx } from 'clsx'

interface AboutProps {
  headline?: string
  subheadline?: string
  content: any[]
  image?: string
  instagramHandle?: string
  stats?: Array<{ label: string; value: string }>
}

export function About({
  headline = 'About Your Coach',
  subheadline,
  content,
  image,
  instagramHandle,
  stats = [
    { label: 'Clients Served', value: '500+' },
    { label: 'Years Experience', value: '10+' },
    { label: 'Success Rate', value: '95%' },
    { label: 'Countries', value: '15+' },
  ],
}: AboutProps) {
  return (
    <Section variant="default" size="lg" id="about">
      <SectionHeader title={headline} subtitle={subheadline} align="left" />
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div>
          {content && content.length > 0 && <PortableText value={content} />}
          {instagramHandle && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <InstagramButton handle={instagramHandle} size="lg" />
            </div>
          )}
        </div>
        <div className="space-y-6">
          {image && (
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={image}
                alt="Coach portrait"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <Card key={i} variant="outlined" padding="md" className="text-center">
                <CardContent>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}