import { defineField, defineType } from 'sanity'

export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'youtubeId', title: 'YouTube ID', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'thumbnailUrl', title: 'Thumbnail URL', type: 'url' }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
    defineField({ name: 'category', title: 'Category', type: 'string' }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'hidden', title: 'Hidden', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 0 }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: { list: ['youtube-sync', 'manual'] },
      initialValue: 'manual',
      readOnly: false,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'youtubeId', media: 'thumbnailUrl' },
  },
})