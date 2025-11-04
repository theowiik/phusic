'use client'

import { useEffect, useRef } from 'react'
import { AUDIO_CONSTANTS } from '../constants/audio'
import { getAssetPath } from '../constants/config'
import type { Config, Phase } from '../types'
import { calculateStepTime, tryPlayAudio } from '../utils/audio'

export const useMusicPlayer = (
  currentPhase: Phase | null,
  config: Config | null,
  volume: number,
  muted: boolean
) => {
  const musicRef1 = useRef<HTMLAudioElement>(null)
  const musicRef2 = useRef<HTMLAudioElement>(null)
  const currentMusicRef = useRef<number>(1)
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Play music for current phase with crossfade
  useEffect(() => {
    if (!config || !currentPhase) return

    const phaseMusic = currentPhase.music
    if (!phaseMusic || phaseMusic.length === 0) return

    const randomTrack = phaseMusic[Math.floor(Math.random() * phaseMusic.length)]
    const musicPath = getAssetPath(config.assets, randomTrack)

    // Determine which audio ref to use (crossfade setup)
    const activeRef = currentMusicRef.current === 1 ? musicRef1 : musicRef2
    const nextRef = currentMusicRef.current === 1 ? musicRef2 : musicRef1

    // Start new track in the inactive ref
    if (nextRef.current) {
      nextRef.current.src = musicPath
      nextRef.current.loop = true
      nextRef.current.volume = 0
      tryPlayAudio(nextRef.current)
    }

    // Fade out current, fade in new
    const stepTime = calculateStepTime(AUDIO_CONSTANTS.FADE_DURATION, AUDIO_CONSTANTS.FADE_STEPS)
    let step = 0

    // Clear any existing fade interval
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current)
    }

    const isActivePlaying = activeRef.current && !activeRef.current.paused

    fadeIntervalRef.current = setInterval(() => {
      step++
      const progress = step / AUDIO_CONSTANTS.FADE_STEPS

      if (isActivePlaying && activeRef.current) {
        activeRef.current.volume = Math.max(0, (1 - progress) * volume * (muted ? 0 : 1))
      }

      if (nextRef.current) {
        nextRef.current.volume = Math.min(
          volume * (muted ? 0 : 1),
          progress * volume * (muted ? 0 : 1)
        )
      }

      if (step >= AUDIO_CONSTANTS.FADE_STEPS) {
        // Switch active ref
        if (isActivePlaying && activeRef.current) {
          activeRef.current.pause()
          activeRef.current.currentTime = 0
        }
        currentMusicRef.current = currentMusicRef.current === 1 ? 2 : 1
        if (fadeIntervalRef.current !== null) {
          clearInterval(fadeIntervalRef.current)
        }
      }
    }, stepTime)

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current)
      }
    }
  }, [currentPhase, config, volume, muted])

  // Update audio volumes when muted/volume changes
  useEffect(() => {
    const activeRef = currentMusicRef.current === 1 ? musicRef1 : musicRef2
    if (activeRef.current) {
      activeRef.current.volume = volume * (muted ? 0 : 1)
    }
  }, [volume, muted])

  return { musicRef1, musicRef2 }
}
