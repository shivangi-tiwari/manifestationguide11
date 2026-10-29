import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const isBuildTime = !projectId || projectId === 'dummy-project-id'

let sanityClient: ReturnType<typeof createClient> | null = null

if (!isBuildTime) {
  sanityClient = createClient({
    projectId: projectId!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
  })
}

export async function sanityFetch<T>({
  query,
  params = {},
  tags = ['sanity'],
}: { query: string; params?: Record<string, unknown>; tags?: string[] }): Promise<T> {
  if (isBuildTime || !sanityClient) {
    // Return empty data during build when Sanity credentials are not configured
    // This allows the build to complete without real Sanity credentials
    return [] as T
  }
  return sanityClient.fetch<T>(query, params, { next: { tags } })
}

export { sanityClient }