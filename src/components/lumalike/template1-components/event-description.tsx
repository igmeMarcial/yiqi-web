import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { translations } from '@/lib/translations/translations'
import { MdPreview } from '@/components/events/editor/MdPreview'

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
          <div className="prose prose-sm max-w-none overflow-x-auto">
            <MdPreview content={description} darkMode={true} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
