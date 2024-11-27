import Image from 'next/image'
import { motion } from 'framer-motion'

interface HeroImageProps {
  src: string
  alt: string
}

export function HeroImage({ src, alt }: HeroImageProps) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-xl shadow-2xl max-w-[500px] max-h-[500px] w-full h-full mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="aspect-square w-full h-full">
        <Image
          src={src}
          alt={alt}
          layout="responsive"
          width={500}
          height={500}
          objectFit="cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    </motion.div>
  )
}
