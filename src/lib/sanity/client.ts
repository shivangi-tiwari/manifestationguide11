import { createClient } from 'next-sanity'

const configuredProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim()
const isProductionBuild = process.env.NEXT_PHASE === 'phase-production-build'
const projectId = configuredProjectId && configuredProjectId !== 'dummy-project-id'
  ? configuredProjectId
  : undefined
const canSkipSanityForBuild = !projectId && isProductionBuild

if (!projectId && !isProductionBuild) {
  throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID must be configured outside the production build step.')
}

let sanityClient: ReturnType<typeof createClient> | null = null

if (projectId) {
  sanityClient = createClient({
    projectId,
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
  if (canSkipSanityForBuild) {
    // Return empty data during build when Sanity credentials are not configured
    // This allows the build to complete without real Sanity credentials
    return [] as T
  }

  if (!sanityClient) {
    throw new Error('Sanity client is unavailable despite configured project credentials.')
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