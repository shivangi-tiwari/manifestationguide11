'use client'

import { Section, SectionHeader } from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import { PortableText } from '@/components/ui/PortableText'
import { clsx } from 'clsx'

interface SuccessStory {
  _id: string
  name: string
  location?: string
  headline: string
  story: any[]
  image?: string
  rating?: number
  packageName?: string
}

interface SuccessStoriesProps {
  headline?: string
  subheadline?: string
  stories: SuccessStory[]
  ctaText?: string
  ctaHref?: string
}

export function SuccessStories({ headline = 'Success Stories', subheadline, stories, ctaText = 'Read All Stories', ctaHref = '/success-stories' }: SuccessStoriesProps) {
  return (
    <Section variant="alternate" size="lg" id="stories">
      <SectionHeader title={headline} subtitle={subheadline} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map((story) => (
          <Card key={story._id} variant="outlined" padding="lg" className="flex flex-col">
            <CardContent className="flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                {story.image ? (
                  <img src={story.image} alt={story.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{story.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{story.name}</p>
                  {story.location && <p className="text-sm text-gray-500 dark:text-gray-400">{story.location}</p>}
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{story.headline}</h4>
              {story.story && story.story.length > 0 && (
                <div className="prose dark:prose-invert max-w-none text-sm mb-4 flex-1">
                  <PortableText value={story.story} />
                </div>
              )}
              {story.packageName && (
                <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full mt-auto">
                  {story.packageName}
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {stories.length > 3 && (
        <div className="text-center mt-10">
          <a href={ctaHref} className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
            {ctaText} ({stories.length} total)
          </a>
        </div>
      )}
    </Section>
  )
}