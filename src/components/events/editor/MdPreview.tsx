'use client'

import { useMemo } from 'react'

interface MdPreviewProps {
  content: string
  darkMode?: boolean
}

export function MdPreview({ content, darkMode = false }: MdPreviewProps) {
  const contentEl = useMemo(() => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className={`
          prose-video:w-full 
          prose-video:aspect-video 
          prose-img:max-w-full 
          prose-img:h-auto 
          [&_iframe]:w-full 
          [&_iframe]:aspect-video
          ${
            darkMode
              ? `
                prose-headings:text-white
                prose-p:text-gray-200
                prose-strong:text-white
                prose-em:text-gray-200
                prose-li:text-gray-200
                prose-code:text-gray-200
                prose-blockquote:text-gray-200
                prose-a:text-blue-400
                hover:prose-a:text-blue-300
                prose-pre:bg-gray-800
              `
              : `
                prose-headings:text-gray-900
                prose-p:text-gray-700
                prose-strong:text-gray-900
                prose-em:text-gray-700
                prose-li:text-gray-700
                prose-code:text-gray-700
                prose-blockquote:text-gray-700
                prose-a:text-blue-600
                hover:prose-a:text-blue-700
              `
          }
        `}
      />
    )
  }, [content, darkMode])

  return contentEl
}
