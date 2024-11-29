/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { translations } from '@/lib/translations/translations'

interface EventDescriptionProps {
  description: string
}

export function EventDescription({ description }: EventDescriptionProps) {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <h2 className="text-2xl font-semibold text-primary-foreground">
        {translations.es.eventAbout}
      </h2>
      <hr className="my-6 border-t border-solid border-white-opacity-40 w-[100%] ml-0 mx-auto ml-0" />
      <Card className="bg-black backdrop-blur-sm text-white w-[100%] ml-0 sm:max-w-[400px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] border-0">
        <CardContent className="p-6">
          <div className="prose prose-sm dark:prose-invert text-primary-foreground max-w-none overflow-x-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus as any}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {description}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
