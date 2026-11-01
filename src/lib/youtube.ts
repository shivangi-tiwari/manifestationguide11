export interface YouTubePlaylist {
  playlistId: string
  title: string
}

interface YouTubePlaylistResponse {
  items?: Array<{
    id?: string
    snippet?: {
      title?: string
    }
  }>
  nextPageToken?: string
}

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3'

export async function fetchChannelPlaylists(
  channelId: string,
  apiKey: string
): Promise<YouTubePlaylist[]> {
  if (!channelId || !apiKey) {
    throw new Error('A YouTube channel ID and API key are required to load playlists.')
  }

  const playlists: YouTubePlaylist[] = []
  let nextPageToken: string | undefined

  do {
    const url = new URL(`${YOUTUBE_API_URL}/playlists`)
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('channelId', channelId)
    url.searchParams.set('maxResults', '50')
    url.searchParams.set('key', apiKey)
    if (nextPageToken) url.searchParams.set('pageToken', nextPageToken)

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600, tags: ['home', 'youtube-playlists'] },
    })

    if (!response.ok) {
      throw new Error(`YouTube playlist API returned HTTP ${response.status}.`)
    }

    const data = (await response.json()) as YouTubePlaylistResponse
    for (const item of data.items ?? []) {
      const playlistId = item.id
      const title = item.snippet?.title?.trim()

      if (playlistId && title && !/success\s*stor/i.test(title)) {
        playlists.push({ playlistId, title })
      }
    }

    nextPageToken = data.nextPageToken
  } while (nextPageToken)

  return playlists.sort((a, b) => a.title.localeCompare(b.title))
}
