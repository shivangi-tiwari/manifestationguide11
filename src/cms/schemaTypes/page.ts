import { defineField, defineType } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  description: 'Long-form pages such as Terms & Conditions.',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      description: 'The page URL segment. For example, Terms & Conditions uses "terms".',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      description: 'Optional search and social-sharing metadata for this page.',
      fields: [
        { name: 'title', title: 'SEO Title', type: 'string', description: 'Overrides the page title in search results.' },
        { name: 'description', title: 'SEO Description', type: 'text' },
        { name: 'ogTitle', title: 'Social Sharing Title', type: 'string' },
        { name: 'ogImage', title: 'Social Sharing Image', type: 'image' },
      ],
    }),
  ],
})