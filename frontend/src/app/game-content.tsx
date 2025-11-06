'use client'

import { useEffect, useRef, useState } from 'react'
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
  const [currentPhase, setCurrentPhase] = useState<Phase | null>(null)
  const [volume] = useState<number>(DEFAULT_VOLUME)
  // Load muted state from localStorage, default to false
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('phusic-muted')
      return saved === 'true'
    }
    return false
  })
  const [showHelp, setShowHelp] = useState<boolean>(false)

  // Save muted state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('phusic-muted', String(muted))
    }
  }, [muted])

  const sfxRef = useRef<HTMLAudioElement>(null)

  // Initialize current phase when config loads
  useEffect(() => {
    if (config?.phases && config.phases.length > 0 && !currentPhase) {
      setCurrentPhase(config.phases[0])
    }
  }, [config, currentPhase])

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
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="font-light text-[#e5e5e5] text-sm opacity-50">Loading...</div>
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
        {/* Phase Display - Top Center */}
        <div className="-translate-x-1/2 absolute top-12 left-1/2 transform">
          <PhaseDisplay currentPhase={currentPhase} />
        </div>

        {/* Control Bar - Bottom Right Corner */}
        <div className="absolute right-4 bottom-4">
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
