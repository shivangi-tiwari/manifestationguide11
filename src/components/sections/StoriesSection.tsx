'use client'

import { Doodle } from '@/components/ui/Doodle'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import { PortableText } from '@/components/ui/PortableText'
import { clsx } from 'clsx'

interface SuccessStory {
  _id: string
  clientName: string
  photo?: unknown
  headline: string
  story: unknown
  youtubeVideoId?: string
  date: string
  featured: boolean
  order: number
  published: boolean
}

interface StoriesSectionProps {
  stories: SuccessStory[]
}

function InitialsAvatar({ name }: { name: string }) {
  const isAnonymous = name.toLowerCase() === 'anonymous'
  const initials = isAnonymous ? 'A' : name.trim().charAt(0).toUpperCase()
  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brown to-olive flex items-center justify-center flex-shrink-0">
      <span className="text-cream font-bold text-lg">{initials}</span>
    </div>
  )
}

export function StoriesSection({ stories }: StoriesSectionProps) {
  // Sort: featured first, then by order, then by date desc
  const sorted = [...stories]
    .filter((s) => s.published)
    .sort((a, b) => {
      if (a.featured !== b.featured) return b.featured ? 1 : -1
      if (a.order !== b.order) return a.order - b.order
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

  return (
    <Section variant="sage" size="lg" id="stories" aria-labelledby="stories-heading">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div>
          <SectionHeader
            title="Success stories"
            subtitle="Real transformations from real people"
            align="left"
          />
          <p className="text-sm text-muted italic mt-8">Results vary from person to person.</p>
        </div>
        <div>
          <Doodle name="stories" className="hidden lg:block mx-auto max-w-xs mb-8" />
          <div className="space-y-6">
            {sorted.map((story) => {
              const storyContent = Array.isArray(story.story) ? story.story : []
              return (
                <Card key={story._id} variant="outlined" padding="lg" className="flex flex-col">
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <InitialsAvatar name={story.clientName} />
                      <div>
                        <p className="font-semibold text-foreground">{story.clientName}</p>
                        <p className="text-sm text-muted">
                          {new Date(story.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-3">{story.headline}</h4>
                    {storyContent.length > 0 && (
                      <div className="prose max-w-none text-sm mb-4 flex-1">
                        <PortableText value={storyContent} />
                      </div>
                    )}
                    {story.youtubeVideoId && (
                      <a
                        href={`https://youtube.com/watch?v=${story.youtubeVideoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-brown hover:underline mt-auto inline-flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Watch Video
                      </a>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
          {sorted.length === 0 && (
            <div className="text-center py-12 text-muted">
              No success stories yet. Check back soon!
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}