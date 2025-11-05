'use client'

import { useRef, useState } from 'react'
import { AudioElements } from '../components/game/audio-elements'
import { ControlBar } from '../components/game/control-bar'
import { GameBackground } from '../components/game/game-background'
import { HelpModal } from '../components/game/help-modal'
import { PhaseDisplay } from '../components/game/phase-display'
import { DEFAULT_VOLUME } from '../constants/audio'
import { useConfig } from '../hooks/use-config'
import { useImageTransition } from '../hooks/use-image-transition'
import { useKeyboardControls } from '../hooks/use-keyboard-controls'
import { useMusicPlayer } from '../hooks/use-music-player'
import type { Phase } from '../types'

interface GameContentProps {
  gameName?: string
}

export function GameContent({ gameName }: GameContentProps = {}) {
  const { config, loading } = useConfig(gameName)
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

  const { currentImage, imageOpacity } = useImageTransition(currentPhase, config)

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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-4xl text-white">LOADING</div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Layer */}
      <GameBackground
        currentImage={currentImage}
        currentPhase={currentPhase}
        imageOpacity={imageOpacity}
      />

      {/* Content Layer */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Phase Display - Centered */}
        <div className="flex flex-1 items-center justify-center">
          <PhaseDisplay currentPhase={currentPhase} />
        </div>

        {/* Control Bar - Bottom */}
        <div className="p-6">
          <ControlBar muted={muted} setMuted={setMuted} setShowHelp={setShowHelp} />
        </div>
      </div>

      {/* Modals */}
      <HelpModal showHelp={showHelp} config={config} setShowHelp={setShowHelp} />

      {/* Audio */}
      <AudioElements musicRef1={musicRef1} musicRef2={musicRef2} sfxRef={sfxRef} />
    </div>
  )
}
