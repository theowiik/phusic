import Image from 'next/image'
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
    <div className="absolute inset-0 h-full w-full">
      <Image
        key={currentImage}
        src={currentImage}
        alt={currentPhase.name}
        fill
        className="object-cover"
        style={{
          opacity: imageOpacity,
          transition: `opacity ${AUDIO_CONSTANTS.IMAGE_TRANSITION_DURATION}ms`,
        }}
      />
    </div>
  )
}
