import { AUDIO_CONSTANTS } from '../../constants/audio'
import type { Phase } from '../../types'

interface GameBackgroundProps {
  currentImage: string
  currentPhase: Phase
  imageOpacity: number
}

export const GameBackground = ({
  currentImage,
  currentPhase,
  imageOpacity,
}: GameBackgroundProps) => {
  if (!currentImage) return null

  return (
    <img
      src={currentImage}
      alt={currentPhase.name}
      className="absolute inset-0 h-full w-full object-cover"
      style={{
        opacity: imageOpacity,
        transition: `opacity ${AUDIO_CONSTANTS.IMAGE_TRANSITION_DURATION}ms`,
      }}
    />
  )
}
