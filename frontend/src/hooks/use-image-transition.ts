'use client'

import { useEffect, useRef, useState } from 'react'
import { AUDIO_CONSTANTS } from '../constants/audio'
import { getAssetPath } from '../constants/config'
import type { Config, Phase } from '../types'

export const useImageTransition = (currentPhase: Phase | null, config: Config | null) => {
  const [currentImage, setCurrentImage] = useState<string>('')
  const [currentImageFilename, setCurrentImageFilename] = useState<string>('')
  const [imageOpacity, setImageOpacity] = useState<number>(1)
  const initializedRef = useRef(false)
  const previousPhaseNameRef = useRef<string | null>(null)

  // Update image when phase changes
  useEffect(() => {
    if (!currentPhase || !config) return

    // Check if phase actually changed by comparing phase name
    const phaseChanged = previousPhaseNameRef.current !== currentPhase.name
    previousPhaseNameRef.current = currentPhase.name

    // If phase didn't change, don't update the image
    if (!phaseChanged && initializedRef.current) return

    const shouldFade = initializedRef.current

    if (shouldFade) {
      // Fade out current image
      setImageOpacity(0)
    }

    const delay = shouldFade ? AUDIO_CONSTANTS.IMAGE_HALF_TRANSITION : 0

    const timeoutId = setTimeout(() => {
      // Ensure we have images for this phase
      if (!currentPhase.images || currentPhase.images.length === 0) {
        setCurrentImage('')
        setCurrentImageFilename('')
        setImageOpacity(1)
        initializedRef.current = true
        return
      }

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
      initializedRef.current = true
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [currentPhase, config])

  return { currentImage, currentImageFilename, imageOpacity }
}
