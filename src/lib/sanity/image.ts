import urlBuilder from '@sanity/image-url'
import { sanityClient } from './client'
import type { SanityImageBlock } from '@/types'

const builder = sanityClient ? urlBuilder(sanityClient) : null

export function urlFor(source: SanityImageBlock) {
  return builder?.image(source) ?? null
}

export function getSanityImageDimensions(source: SanityImageBlock): { width: number; height: number } | null {
  const dimensions = source.asset._ref.match(/^image-.+-(\d+)x(\d+)-[a-z0-9]+$/i)
  if (!dimensions) return null

  const width = Number(dimensions[1])
  const height = Number(dimensions[2])
  return width > 0 && height > 0 ? { width, height } : null
}