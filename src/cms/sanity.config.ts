import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { siteSettings } from './schemaTypes/siteSettings'

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
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .icon(() => '⚙️')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
          ]),
    }),
  ],

  schema: {
    types: [siteSettings],
  },
})

export default studioConfig