import { PortableText as PortableTextRenderer, PortableTextComponents, PortableTextBlock } from '@portabletext/react'
import { clsx } from 'clsx'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{children}</p>,
    h1: ({ children }) => <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 mt-8">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 mt-8">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2 mt-6">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 mt-6">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4 ml-4">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4 ml-4">{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value.href}
        target={value.blank ? '_blank' : undefined}
        rel={value.blank ? 'noopener noreferrer' : undefined}
        className="text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <u className="underline">{children}</u>,
    'inline-code': ({ children }) => (
      <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-purple-600 dark:text-purple-400">
        {children}
      </code>
    ),
  },
}

interface PortableTextProps {
  value: PortableTextBlock[]
  className?: string
}

export function PortableText({ value, className }: PortableTextProps) {
  if (!value || value.length === 0) return null

  return (
    <div className={clsx('prose dark:prose-invert max-w-none', className)}>
      <PortableTextRenderer
        value={value}
        components={components}
      />
    </div>
  )
}

// Re-export for internal use
export { components as portableTextComponents }