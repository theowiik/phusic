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
  const playbackAttemptedRef = useRef<Set<HTMLAudioElement>>(new Set())

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
    // Note: refs should be available since AudioElements renders in the same component tree
    if (!nextRef.current) {
      // Refs not ready yet, skip this render
      return
    }
    
    let handleCanPlay: (() => void) | null = null
    nextRef.current.src = musicPath
    nextRef.current.loop = true
    nextRef.current.volume = 0
    
    // Wait for audio to be ready before trying to play
    handleCanPlay = () => {
      if (nextRef.current && !muted) {
        playbackAttemptedRef.current.add(nextRef.current)
        tryPlayAudio(nextRef.current)
        nextRef.current.removeEventListener('canplay', handleCanPlay!)
      }
    }
    
    // If already loaded, try playing immediately, otherwise wait for canplay
    if (nextRef.current.readyState >= 2) {
      // HAVE_CURRENT_DATA or higher - try playing immediately if not muted
      if (!muted) {
        playbackAttemptedRef.current.add(nextRef.current)
        tryPlayAudio(nextRef.current)
      }
    } else {
      nextRef.current.addEventListener('canplay', handleCanPlay)
      // Also try loading the audio explicitly
      nextRef.current.load()
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
        // Ensure audio is playing if it should be (handles autoplay block)
        if (!muted && nextRef.current.paused && nextRef.current.src && nextRef.current.readyState >= 2) {
          playbackAttemptedRef.current.add(nextRef.current)
          tryPlayAudio(nextRef.current)
        }
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
      // Clean up event listeners
      if (nextRef.current && handleCanPlay) {
        nextRef.current.removeEventListener('canplay', handleCanPlay)
      }
    }
  }, [currentPhase, config, volume, muted])

  // Update audio volumes when muted/volume changes
  useEffect(() => {
    const activeRef = currentMusicRef.current === 1 ? musicRef1 : musicRef2
    const nextRef = currentMusicRef.current === 1 ? musicRef2 : musicRef1
    
    // Update volume for active ref
    if (activeRef.current) {
      activeRef.current.volume = volume * (muted ? 0 : 1)
      // If unmuting and audio should be playing but is paused, try to play it
      // This handles the case where autoplay was blocked on initial load
      if (!muted && activeRef.current.paused && activeRef.current.src) {
        // Wait a bit for readyState to be ready if needed
        const tryStart = () => {
          if (activeRef.current && activeRef.current.readyState >= 2 && activeRef.current.paused) {
            playbackAttemptedRef.current.add(activeRef.current)
            tryPlayAudio(activeRef.current)
          }
        }
        if (activeRef.current.readyState >= 2) {
          tryStart()
        } else {
          activeRef.current.addEventListener('canplay', tryStart, { once: true })
        }
      }
    }
    
    // Also check nextRef in case it has audio that should be playing
    if (nextRef.current) {
      nextRef.current.volume = volume * (muted ? 0 : 1)
      // If unmuting and nextRef has audio that should be playing but is paused, try to play it
      if (!muted && nextRef.current.paused && nextRef.current.src) {
        const tryStart = () => {
          if (nextRef.current && nextRef.current.readyState >= 2 && nextRef.current.paused) {
            playbackAttemptedRef.current.add(nextRef.current)
            tryPlayAudio(nextRef.current)
          }
        }
        if (nextRef.current.readyState >= 2) {
          tryStart()
        } else {
          nextRef.current.addEventListener('canplay', tryStart, { once: true })
        }
      }
    }
  }, [volume, muted])

  return { musicRef1, musicRef2 }
}
