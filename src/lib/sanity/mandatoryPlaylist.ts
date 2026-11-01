import { sanityWriteClient } from '@/lib/sanity/writeClient'

export async function getMandatoryPlaylistUrl(): Promise<string | undefined> {
  const playlistId = await sanityWriteClient.fetch<string | null>(
    `*[_type == "siteSettings"][0].mandatoryPlaylistId`
  )
  const normalizedId = playlistId?.trim()

  if (!normalizedId) return undefined

  const url = new URL('https://www.youtube.com/playlist')
  url.searchParams.set('list', normalizedId)
  return url.toString()
}
