export interface YouTubeSuccessStoryVideo {
  videoId: string
  title: string
  publishedAt: string
}

function decodeXml(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}

function getTagValue(entry: string, tag: string) {
  const match = entry.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))
  return match ? decodeXml(match[1].trim()) : ''
}

export async function fetchRecentSuccessStoryVideos(channelId: string): Promise<YouTubeSuccessStoryVideo[]> {
  const feedUrl = new URL('https://www.youtube.com/feeds/videos.xml')
  feedUrl.searchParams.set('channel_id', channelId)

  const response = await fetch(feedUrl, {
    next: { revalidate: 3600, tags: ['home', 'youtube-success-stories'] },
  })

  if (!response.ok) {
    throw new Error(`YouTube channel feed returned HTTP ${response.status}`)
  }

  const xml = await response.text()
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || []

  return entries
    .map((entry) => ({
      videoId: getTagValue(entry, 'yt:videoId'),
      title: getTagValue(entry, 'title'),
      publishedAt: getTagValue(entry, 'published'),
    }))
    .filter((video) =>
      /^[\w-]+$/.test(video.videoId) &&
      video.title.toLowerCase().includes('success story') &&
      !Number.isNaN(Date.parse(video.publishedAt))
    )
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
}
