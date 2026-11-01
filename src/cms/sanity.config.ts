import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const studioConfig = defineConfig({
  name: 'manifest-coach',
  title: 'Manifestation Coach',
  basePath: '/studio',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Manifestation Guide')
          .items([
            S.listItem()
              .title('Site Settings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.divider(),
            S.listItem()
              .title('Site Content')
              .child(
                S.list()
                  .title('Site Content')
                  .items([
                    S.documentTypeListItem('page').title('Pages'),
                    S.listItem()
                      .title('Packages')
                      .child(
                        S.documentTypeList('package')
                          .title('Packages')
                          .defaultOrdering([
                            { field: 'order', direction: 'asc' },
                            { field: 'title', direction: 'asc' },
                          ])
                      ),
                    S.listItem()
                      .title('FAQs')
                      .child(
                        S.documentTypeList('faq')
                          .title('FAQs')
                          .defaultOrdering([{ field: 'order', direction: 'asc' }])
                      ),
                    S.listItem()
                      .title('Written Success Stories')
                      .child(
                        S.documentTypeList('successStory')
                          .title('Written Success Stories')
                          .defaultOrdering([
                            { field: 'order', direction: 'asc' },
                            { field: 'date', direction: 'desc' },
                          ])
                      ),
                  ])
              ),
            S.listItem()
              .title('Videos')
              .child(
                S.list()
                  .title('Videos')
                  .items([
                    S.listItem()
                      .title('All Videos')
                      .child(
                        S.documentTypeList('video')
                          .title('All Videos')
                          .defaultOrdering([
                            { field: 'order', direction: 'asc' },
                            { field: 'publishedAt', direction: 'desc' },
                          ])
                      ),
                    S.listItem()
                      .title('Teaching Videos')
                      .child(
                        S.documentTypeList('video')
                          .title('Teaching Videos')
                          .filter('_type == "video" && isSuccessStory != true && hidden != true')
                          .defaultOrdering([
                            { field: 'order', direction: 'asc' },
                            { field: 'publishedAt', direction: 'desc' },
                          ])
                      ),
                    S.listItem()
                      .title('Success Story Videos')
                      .child(
                        S.documentTypeList('video')
                          .title('Success Story Videos')
                          .filter('_type == "video" && isSuccessStory == true && hidden != true')
                          .defaultOrdering([
                            { field: 'order', direction: 'asc' },
                            { field: 'publishedAt', direction: 'desc' },
                          ])
                      ),
                    S.listItem()
                      .title('Hidden Videos')
                      .child(
                        S.documentTypeList('video')
                          .title('Hidden Videos')
                          .filter('_type == "video" && hidden == true')
                          .defaultOrdering([
                            { field: 'order', direction: 'asc' },
                            { field: 'publishedAt', direction: 'desc' },
                          ])
                      ),
                  ])
              ),
            S.listItem()
              .title('Inquiries')
              .child(
                S.list()
                  .title('Inquiries')
                  .items([
                    S.listItem()
                      .title('All Inquiries')
                      .child(
                        S.documentTypeList('inquiry')
                          .title('All Inquiries')
                          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('New')
                      .child(
                        S.documentTypeList('inquiry')
                          .title('New')
                          .filter('_type == "inquiry" && status == "new"')
                          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Replied')
                      .child(
                        S.documentTypeList('inquiry')
                          .title('Replied')
                          .filter('_type == "inquiry" && status == "replied"')
                          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Closed')
                      .child(
                        S.documentTypeList('inquiry')
                          .title('Closed')
                          .filter('_type == "inquiry" && status == "closed"')
                          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                      ),
                  ])
              ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    newDocumentOptions: (previousOptions) =>
      previousOptions.filter((option) => option.templateId !== 'inquiry'),
  },
})

export default studioConfig