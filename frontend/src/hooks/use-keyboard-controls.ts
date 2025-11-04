'use client'

import { useEffect } from 'react'
import { getAssetPath } from '../constants/config'
import type { Config, Phase } from '../types'
import { tryPlayAudio } from '../utils/audio'
import { matchesKeybind } from '../utils/keybinds'

interface UseKeyboardControlsProps {
  config: Config | null
  currentPhase: Phase | null
  muted: boolean
  volume: number
  showHelp: boolean
  sfxRef: React.RefObject<HTMLAudioElement | null>
  setCurrentPhase: (phase: Phase) => void
  setMuted: (muted: boolean) => void
  setShowHelp: (show: boolean) => void
}

export const useKeyboardControls = ({
  config,
  currentPhase,
  muted,
  volume,
  showHelp,
  sfxRef,
  setCurrentPhase,
  setMuted,
  setShowHelp,
}: UseKeyboardControlsProps) => {
  useEffect(() => {
    if (!config || !config.keybinds) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        (e.target as HTMLElement).tagName === 'INPUT' ||
        (e.target as HTMLElement).tagName === 'TEXTAREA'
      )
        return

      const { keybinds } = config

      // Next phase
      if (matchesKeybind(e.key, keybinds.nextPhase)) {
        e.preventDefault()
        if (!currentPhase) return
        if (currentPhase.next !== undefined && config.phases[currentPhase.next]) {
          setCurrentPhase(config.phases[currentPhase.next])
        }
        return
      }

      // Phase keybinds - check all phases for keybinds
      for (const phase of config.phases) {
        if (phase.keybind && matchesKeybind(e.key, phase.keybind)) {
          e.preventDefault()
          setCurrentPhase(phase)
          return
        }
      }

      // SFX keybinds - check all SFX items for their keybinds
      if (config.sfx) {
        for (const sfx of config.sfx) {
          if (sfx.keybind && matchesKeybind(e.key, sfx.keybind)) {
            e.preventDefault()
            if (sfxRef.current) {
              const sfxPath = getAssetPath(config.assets, sfx.file)
              sfxRef.current.src = sfxPath
              sfxRef.current.volume = volume * (muted ? 0 : 1)
              tryPlayAudio(sfxRef.current)
            }
            return
          }
        }
      }

      // Mute
      if (matchesKeybind(e.key, keybinds.mute)) {
        e.preventDefault()
        setMuted(!muted)
        return
      }

      // Help
      if (matchesKeybind(e.key, keybinds.help)) {
        e.preventDefault()
        setShowHelp(!showHelp)
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    config,
    currentPhase,
    muted,
    showHelp,
    volume,
    sfxRef,
    setCurrentPhase,
    setMuted,
    setShowHelp,
  ])
}
