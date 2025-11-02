import { useRef, useState } from 'react'
import { AudioElements } from '../../components/game/audio-elements'
import { ControlBar } from '../../components/game/control-bar'
import { GameBackground } from '../../components/game/game-background'
import { HelpModal } from '../../components/game/help-modal'
import { PhaseDisplay } from '../../components/game/phase-display'
import { DEFAULT_VOLUME } from '../../constants/audio'
import { useConfig } from '../../hooks/use-config'
import { useImageTransition } from '../../hooks/use-image-transition'
import { useKeyboardControls } from '../../hooks/use-keyboard-controls'
import { useMusicPlayer } from '../../hooks/use-music-player'
import type { Phase } from '../../types'

function GamePage() {
  const { config, loading } = useConfig()
  const [currentPhase, setCurrentPhase] = useState<Phase | null>(config?.phases[0] || null)
  const [volume] = useState<number>(DEFAULT_VOLUME)
  const [muted, setMuted] = useState<boolean>(false)
  const [showHelp, setShowHelp] = useState<boolean>(false)

  const sfxRef = useRef<HTMLAudioElement>(null)

  // Initialize current phase when config loads
  if (config && !currentPhase) {
    setCurrentPhase(config.phases[0])
  }

  const { musicRef1, musicRef2 } = useMusicPlayer(currentPhase, config, volume, muted)

  const { currentImage, currentImageFilename, imageOpacity } = useImageTransition(
    currentPhase,
    config
  )

  useKeyboardControls({
    config,
    currentPhase,
    muted,
    volume,
    showHelp,
    sfxRef,
    setCurrentPhase,
    setMuted,
    setShowHelp,
  })

  if (loading || !config || !currentPhase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-4xl text-white">LOADING</div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <GameBackground
        currentImage={currentImage}
        currentPhase={currentPhase}
        imageOpacity={imageOpacity}
      />

      <div className="relative z-10 flex h-full flex-col p-6">
        <PhaseDisplay currentPhase={currentPhase} currentImageFilename={currentImageFilename} />

        <ControlBar muted={muted} setMuted={setMuted} setShowHelp={setShowHelp} />
      </div>

      <HelpModal showHelp={showHelp} config={config} setShowHelp={setShowHelp} />

      <AudioElements musicRef1={musicRef1} musicRef2={musicRef2} sfxRef={sfxRef} />
    </div>
  )
}

export default GamePage
