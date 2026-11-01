import { defineField, defineType } from 'sanity'

export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  description: 'YouTube videos synced to the Videos and Success stories sections.',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Imported from YouTube when first created; later syncs preserve editor changes.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'youtubeId',
      title: 'YouTube ID',
      type: 'string',
      description: 'The video ID from its YouTube URL.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Imported from YouTube when first created; later syncs preserve editor changes.',
    }),
    defineField({ name: 'thumbnailUrl', title: 'Thumbnail URL', type: 'url', readOnly: true }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime', readOnly: true }),
    defineField({ name: 'category', title: 'Category', type: 'string', description: 'Optional label for organizing videos.' }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'hidden', title: 'Hidden', type: 'boolean', initialValue: false, description: 'Hidden videos are excluded from the public site.' }),
    defineField({
      name: 'isSuccessStory',
      title: 'Show in Success stories',
      type: 'boolean',
      description: 'Choose which site section displays this video. The automatic title check runs only when a synced video is first created.',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Smaller numbers appear first on the public site.',
      initialValue: 0,
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Indicates whether this record came from YouTube sync or was added manually.',
      options: {
        list: [
          { title: 'YouTube Sync', value: 'youtube-sync' },
          { title: 'Manual', value: 'manual' },
        ],
      },
      initialValue: 'manual',
      readOnly: false,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'youtubeId', media: 'thumbnailUrl' },
  },
})