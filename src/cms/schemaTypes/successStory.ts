import { defineField, defineType } from 'sanity'

export const successStory = defineType({
  name: 'successStory',
  title: 'Success Story',
  type: 'document',
  fields: [
    defineField({
      name: 'clientName',
      title: 'Display Name (or Anonymous)',
      type: 'string',
      description: 'Use Anonymous if the client has not agreed to share their name.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Illustration (no people)',
      type: 'image',
      description: 'Optional decorative illustration only; do not upload a photo of a person.',
    }),
    defineField({ name: 'headline', title: 'Headline', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'story', title: 'Story', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'youtubeVideoId', title: 'YouTube Video ID (optional)', type: 'string' }),
    defineField({ name: 'date', title: 'Date', type: 'date' }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Smaller numbers appear first on the public site.',
      initialValue: 0,
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      description: 'Only published written stories are shown on the public site.',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'clientName', media: 'photo' },
  },
})