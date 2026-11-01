import { defineField, defineType } from 'sanity'

export const inquiry = defineType({
  name: 'inquiry',
  title: 'Inquiry',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: (r) => r.required().email() }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'interest', title: 'Interest (Package or free text)', type: 'string' }),
    defineField({ name: 'message', title: 'Message', type: 'text', validation: (r) => r.required() }),
    defineField({ name: 'preferredTiming', title: 'Preferred Timing', type: 'string' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['new', 'replied', 'closed'] },
      initialValue: 'new',
    }),
    defineField({ name: 'createdAt', title: 'Created At', type: 'datetime', initialValue: () => new Date().toISOString() }),
    defineField({ name: 'source', title: 'Source', type: 'string', initialValue: 'website' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'email', status: 'status' },
    prepare({ title, subtitle, status }) {
      return { title, subtitle: `${subtitle} — ${status}` }
    },
  },
})