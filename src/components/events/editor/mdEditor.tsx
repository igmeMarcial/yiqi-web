'use client'

import { RichTextEditor, Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const defaultValue = `
<h1>Welcome to the Rich Text Editor</h1>
<p>
  This editor supports <strong>bold</strong>, <em>italic</em>, and many other formatting options.
  You can also embed images and YouTube videos!
</p>
`

export function MarkdownEditor({
  initialValue,
  onChange
}: {
  initialValue?: string
  onChange: (value: string) => void
}) {
  const [content, setContent] = useState(initialValue || defaultValue)
  const [stagingContent, setStagingContent] = useState(
    initialValue || defaultValue
  )

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Highlight,
      Image,
      Youtube.configure({
        controls: true,
        width: 640,
        height: 480
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      })
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML()
      setStagingContent(newContent)
    }
  })

  useEffect(() => {
    if (editor && initialValue && !content) {
      editor.commands.setContent(initialValue)
    }
  }, [content, editor, initialValue])

  const preview = useMemo(() => {
    return <div dangerouslySetInnerHTML={{ __html: content }} />
  }, [content])

  if (!editor) {
    return null
  }

  return (
    <Card className="mx-auto max-w-[580px]">
      <CardContent className="p-6">
        <Dialog>
          <DialogTrigger asChild>
            <div className="prose prose-sm max-w-none mb-4 cursor-pointer dark:prose-invert">
              {preview}
            </div>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto"
            closeIcon={
              <Button
                onClick={() => {
                  onChange(stagingContent)
                  setContent(stagingContent)
                }}
              >
                <Check className="h-8 w-8" />
              </Button>
            }
          >
            <DialogHeader>
              <DialogTitle>Edit Content</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <RichTextEditor editor={editor}>
                <RichTextEditor.Toolbar sticky stickyOffset={0}>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                    <RichTextEditor.Code />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignJustify />
                    <RichTextEditor.AlignRight />
                  </RichTextEditor.ControlsGroup>

                  {/* Custom controls for Image and YouTube */}
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Control
                      onClick={() => {
                        const url = window.prompt('Enter image URL:')
                        if (url) {
                          editor.chain().focus().setImage({ src: url }).run()
                        }
                      }}
                      aria-label="Insert image"
                      title="Insert image"
                    >
                      🖼️
                    </RichTextEditor.Control>

                    <RichTextEditor.Control
                      onClick={() => {
                        const url = window.prompt('Enter YouTube URL:')
                        if (url) {
                          editor.commands.setYoutubeVideo({
                            src: url
                          })
                        }
                      }}
                      aria-label="Insert YouTube video"
                      title="Insert YouTube video"
                    >
                      📺
                    </RichTextEditor.Control>
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content />
              </RichTextEditor>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
