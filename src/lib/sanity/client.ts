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

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await sanityClient.fetch<T>(query, params, { next: { tags, revalidate: 60 } })
    } catch (error) {
      const isNetworkFailure = error instanceof TypeError && error.message === 'fetch failed'
      if (!isNetworkFailure || attempt === 3) {
        console.error(`Sanity query failed${isNetworkFailure ? ' after 3 network attempts' : ''}.`, error)
        throw error
      }

      await new Promise((resolve) => setTimeout(resolve, attempt * 500))
    }
  }

  throw new Error('Sanity query retry loop exited unexpectedly.')
}

export { sanityClient }