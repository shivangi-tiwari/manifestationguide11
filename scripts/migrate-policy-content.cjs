const fs = require('node:fs')
const path = require('node:path')
const { loadEnvConfig } = require('@next/env')
const { createClient } = require('next-sanity')

loadEnvConfig(process.cwd())

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) {
  throw new Error('SANITY_API_WRITE_TOKEN is missing. Add a Sanity write token to .env.local, then rerun this script.')
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
if (!projectId) {
  throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is missing.')
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

const seed = JSON.parse(fs.readFileSync(path.join(__dirname, 'policy-seed.json'), 'utf8'))

function toPortableText(blocks) {
  return blocks.map(([style, text], index) => ({
    _type: 'block',
    _key: `policy-${index}`,
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: `span-${index}`, text, marks: [] }],
  }))
}

function hasContent(value) {
  return Array.isArray(value) && value.length > 0
}

async function migrate() {
  const settings = await client.fetch(
    '*[_type == "siteSettings"][0]{_id, policies}',
  )

  if (!settings?._id) {
    throw new Error('No Site Settings document was found in the configured Sanity dataset.')
  }

  const policies = settings.policies || {}
  const fieldsToSet = {}

  for (const [field, blocks] of Object.entries(seed)) {
    if (!hasContent(policies[field])) fieldsToSet[field] = toPortableText(blocks)
  }

  if (Object.keys(fieldsToSet).length === 0) {
    console.log('Policy fields are already populated; no changes were made.')
    return
  }

  await client
    .patch(settings._id)
    .set({ policies: { ...policies, ...fieldsToSet } })
    .commit()

  console.log(`Migrated policy content to Site Settings: ${Object.keys(fieldsToSet).join(', ')}`)
}

migrate().catch((error) => {
  console.error('Policy migration failed:', error.message)
  process.exitCode = 1
})
