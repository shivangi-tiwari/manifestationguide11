import { existsSync } from 'node:fs'
import { createClient } from '@sanity/client'

if (typeof process.loadEnvFile !== 'function') {
  throw new Error('Node.js 20.6 or newer is required to load local environment files.')
}

const nodeEnv = process.env.NODE_ENV || 'development'
for (const file of [
  `.env.${nodeEnv}.local`,
  '.env.local',
  `.env.${nodeEnv}`,
  '.env',
]) {
  if (existsSync(file)) process.loadEnvFile(file)
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !token) {
  throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN must be configured.')
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

const videos = await client.fetch(
  `*[_type == "video" && source == "youtube-sync" && !defined(isSuccessStory)] { _id, title }`
)
const isSuccessStoryTitle = (title) => /success\s*stor/i.test(title || '')
const storyCount = videos.filter((video) => isSuccessStoryTitle(video.title)).length

console.log(`Found ${videos.length} synced videos without a story flag; ${storyCount} match the success-story title pattern.`)

if (!process.argv.includes('--apply')) {
  console.log('Dry run only. Re-run with --apply to set flags on these videos.')
  process.exit(0)
}

const mutations = videos.map((video) => ({
  patch: {
    id: video._id,
    set: { isSuccessStory: isSuccessStoryTitle(video.title) },
  },
}))

for (let index = 0; index < mutations.length; index += 100) {
  await client.transaction(mutations.slice(index, index + 100)).commit()
}

console.log(`Backfilled story flags on ${videos.length} synced videos.`)
