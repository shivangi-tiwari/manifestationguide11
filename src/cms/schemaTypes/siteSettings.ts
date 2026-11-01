import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Site Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required() },
        { name: 'subheading', title: 'Subheading', type: 'text' },
        { name: 'ctaText', title: 'CTA Text', type: 'string' },
        { name: 'ctaLink', title: 'CTA Link', type: 'string' },
      ],
    }),
    defineField({ name: 'aboutSummary', title: 'About Summary', type: 'text' }),
    defineField({ name: 'aboutSubtitle', title: 'About Subtitle', type: 'string', description: 'Optional subtitle for the About section (e.g., "A note from your coach")' }),
    defineField({ name: 'contactEmail', title: 'Contact Email', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'instagramHandle', title: 'Instagram Handle', type: 'string' }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'instagram', title: 'Instagram URL', type: 'url' },
        { name: 'youtube', title: 'YouTube URL', type: 'url' },
      ],
    }),
    defineField({ name: 'youtubeChannelId', title: 'YouTube Channel ID', type: 'string' }),
    defineField({ name: 'mandatoryPlaylistId', title: 'Mandatory Playlist ID (for auto-reply)', type: 'string' }),
    defineField({
      name: 'mustWatchPlaylistUrl',
      title: 'Must-Watch Playlist URL',
      type: 'url',
      description: 'Optional link for the Self Concept playlist entry in the Videos & Teaching section.',
    }),
    defineField({
      name: 'mustWatchPlaylistId',
      title: 'Must-Watch Playlist ID',
      type: 'string',
      description: 'Identifies the Self Concept playlist in the channel playlist list.',
    }),
    defineField({ name: 'contactIntro', title: 'Contact Intro', type: 'string', description: 'Optional intro text for the Contact section' }),
    defineField({ name: 'storiesSubtitle', title: 'Stories Subtitle', type: 'string', description: 'Optional subtitle for the Success Stories section' }),
    defineField({
      name: 'seoDefaults',
      title: 'SEO Defaults',
      type: 'object',
      fields: [
        { name: 'title', title: 'Default Title', type: 'string' },
        { name: 'description', title: 'Default Description', type: 'text' },
        { name: 'ogImage', title: 'Open Graph Image', type: 'image' },
      ],
    }),
    defineField({ name: 'footerText', title: 'Footer Text', type: 'string' }),
    defineField({ name: 'developerCredit', title: 'Developer Credit', type: 'string', description: 'Optional footer credit. Leave empty to hide it.' }),
    defineField({ name: 'disclaimerText', title: 'Disclaimer Text', type: 'text' }),
    defineField({
      name: 'policies',
      title: 'Terms & Conditions',
      type: 'object',
      fields: [
        defineField({
          name: 'termsConditions',
          title: 'Terms & Conditions',
          type: 'array',
          of: [{ type: 'block' }],
        }),
      ],
    }),
    defineField({
      name: 'sectionImages',
      title: 'Section Illustrations',
      type: 'object',
      fields: [
        { name: 'hero', title: 'Hero Illustration', type: 'image', options: { hotspot: true } },
        { name: 'about', title: 'About Illustration', type: 'image', options: { hotspot: true } },
        { name: 'videos', title: 'Videos Illustration', type: 'image', options: { hotspot: true } },
        { name: 'stories', title: 'Stories Illustration', type: 'image', options: { hotspot: true } },
        { name: 'contact', title: 'Contact Illustration', type: 'image', options: { hotspot: true } },
      ],
      description: 'Upload custom illustrations for each section. Leave empty to use default doodles.',
    }),
  ],
})