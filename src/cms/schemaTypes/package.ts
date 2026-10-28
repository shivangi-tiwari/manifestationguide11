import { defineField, defineType } from 'sanity'

export const packageType = defineType({
  name: 'package',
  title: 'Package (Fee/Offering)',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'shortDescription', title: 'Short Description', type: 'text', validation: (r) => r.required() }),
    defineField({ name: 'fullDescription', title: 'Full Description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'price', title: 'Price (optional)', type: 'number' }),
    defineField({ name: 'currency', title: 'Currency', type: 'string', initialValue: 'INR' }),
    defineField({ name: 'priceNote', title: 'Price Note (e.g., "per session")', type: 'string' }),
    defineField({ name: 'duration', title: 'Duration (e.g., "60 minutes")', type: 'string' }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 0 }),
    defineField({ name: 'published', title: 'Published', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'price', media: 'image' },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ? `${subtitle} INR` : 'Price on enquiry' }
    },
  },
})