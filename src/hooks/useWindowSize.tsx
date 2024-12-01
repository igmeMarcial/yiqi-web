'use client'

import { useState, useEffect } from 'react'

interface WindowSize {
  width: number
  height: number
}

const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window ? window.innerWidth : 0,
    height: window ? window.innerHeight : 0
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    if (window) {
      window.addEventListener('resize', handleResize)
    }

    return () => {
      if (window) {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  return windowSize
}

export default useWindowSize
