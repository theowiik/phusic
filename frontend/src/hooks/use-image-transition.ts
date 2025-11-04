'use client'

import { useEffect, useState } from 'react'
import { AUDIO_CONSTANTS } from '../constants/audio'
import { getAssetPath } from '../constants/config'
import type { Config, Phase } from '../types'

export const useImageTransition = (currentPhase: Phase | null, config: Config | null) => {
  const [currentImage, setCurrentImage] = useState<string>('')
  const [currentImageFilename, setCurrentImageFilename] = useState<string>('')
  const [imageOpacity, setImageOpacity] = useState<number>(1)
  const [initialized, setInitialized] = useState(false)

  // Update image when phase changes
  useEffect(() => {
    if (!currentPhase || !config) return

    const shouldFade = initialized

    if (shouldFade) {
      // Fade out current image
      setImageOpacity(0)
    }

    const delay = shouldFade ? AUDIO_CONSTANTS.IMAGE_HALF_TRANSITION : 0

    const timeoutId = setTimeout(() => {
      const randomImage =
        currentPhase.images[Math.floor(Math.random() * currentPhase.images.length)]
      setCurrentImageFilename(randomImage)

      if (config.mockImage) {
        setCurrentImage(config.mockImage)
      } else {
        setCurrentImage(getAssetPath(config.assets, randomImage))
      }

      // Fade in new image
      setImageOpacity(1)
      setInitialized(true)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [currentPhase, config, initialized])

  return { currentImage, currentImageFilename, imageOpacity }
}
