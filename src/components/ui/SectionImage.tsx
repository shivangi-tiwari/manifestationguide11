'use client'

import Image from 'next/image'
import { SanityImageBlock } from '@/types'
import { Doodle } from '@/components/ui/Doodle'
import { clsx } from 'clsx'
import { getSanityImageDimensions, urlFor } from '@/lib/sanity/image'

interface SectionImageProps {
  sanityImage?: SanityImageBlock
  doodleName: 'hero' | 'about' | 'videos' | 'stories' | 'contact'
  alt?: string
  className?: string
  priority?: boolean
}

export function SectionImage({ sanityImage, doodleName, alt = '', className, priority = false }: SectionImageProps) {
  const assetRef = sanityImage?.asset?._ref
  const dimensions = sanityImage ? getSanityImageDimensions(sanityImage) : null
  const imageBuilder = assetRef && sanityImage ? urlFor(sanityImage) : null
  const extension = assetRef?.match(/-([a-z0-9]+)$/i)?.[1].toLowerCase()
  const imageUrl = imageBuilder
    ? imageBuilder.width(dimensions?.width ?? 800).url()
    : ''
  const containerClassName = clsx(
    'relative mx-auto w-full aspect-[4/5] overflow-hidden rounded-t-full border-2 border-olive bg-sage shadow-[0.5rem_0.5rem_0_#5C6B4B]',
    className || 'max-w-[260px] lg:max-w-md'
  )
  const imageAlt = alt || `Section illustration for ${doodleName}`

  if (imageUrl) {
    const imageProps = {
      src: imageUrl,
      sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 320px',
      priority,
      className: 'max-w-full object-contain p-6',
    }

    if (dimensions) {
      return (
        <div className={clsx(containerClassName, 'flex items-end justify-center')}>
          <Image
            {...imageProps}
            alt={imageAlt}
            width={dimensions.width}
            height={dimensions.height}
            unoptimized={extension === 'gif' || extension === 'svg'}
            style={{ width: '100%', height: 'auto', maxHeight: '100%' }}
          />
        </div>
      )
    }

    return (
      <div className={containerClassName}>
        <Image
          {...imageProps}
          alt={imageAlt}
          fill
        />
      </div>
    )
  }

  return (
    <div className={containerClassName}>
      <Doodle name={doodleName} />
    </div>
  )
}