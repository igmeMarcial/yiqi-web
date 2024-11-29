'use client'

export function MdPreview({ content }: { content: string }) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: content }}
      className="prose-video:w-full prose-video:aspect-video prose-img:max-w-full prose-img:h-auto [&_iframe]:w-full [&_iframe]:aspect-video"
    />
  )
}
