import { createClient } from 'next-sanity'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

export async function sanityFetch<T>({ query, params = {}, tags = ['sanity'] }: { query: string; params?: Record<string, unknown>; tags?: string[] }) {
  return sanityClient.fetch<T>(query, params, { next: { tags } })
}