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
    defineField({ name: 'disclaimerText', title: 'Disclaimer Text', type: 'text' }),
  ],
})