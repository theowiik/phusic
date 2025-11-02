import { useEffect, useRef, useState } from 'react'
import type { Config, Phase } from './types'

// Get config path from URL params or use default
const getConfigPath = (): string => {
  const params = new URLSearchParams(window.location.search)
  const game = params.get('game') || 'chess'
  return `/assets/${game}/config.json`
}

// Helper to check if key matches any keybind
const matchesKeybind = (key: string, keybindArray: string[] | undefined): boolean => {
  return keybindArray !== undefined && Array.isArray(keybindArray) && keybindArray.includes(key)
}

function App() {
  const [config, setConfig] = useState<Config | null>(null)
  const [currentPhase, setCurrentPhase] = useState<Phase | null>(null)
  const [volume] = useState<number>(1)
  const [muted, setMuted] = useState<boolean>(false)
  const [showHelp, setShowHelp] = useState<boolean>(false)
  const [currentImage, setCurrentImage] = useState<string>('')
  const [currentImageFilename, setCurrentImageFilename] = useState<string>('')
  const [imageOpacity, setImageOpacity] = useState<number>(1)

  const musicRef1 = useRef<HTMLAudioElement>(null)
  const musicRef2 = useRef<HTMLAudioElement>(null)
  const sfxRef = useRef<HTMLAudioElement>(null)
  const currentMusicRef = useRef<number>(1) // Track which music ref is active
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load config on mount
  useEffect(() => {
    const configPath = getConfigPath()
    fetch(configPath)
      .then((res) => res.json())
      .then((data) => {
        setConfig(data)
        // Start with first phase
        setCurrentPhase(data.phases[0])
        const randomImage =
          data.phases[0].images[Math.floor(Math.random() * data.phases[0].images.length)]
        setCurrentImageFilename(randomImage)

        // Use mock image if available, otherwise use actual path
        if (data.mockImage) {
          console.log('Using mock image:', data.mockImage)
          setCurrentImage(data.mockImage)
        } else {
          const imagePath = `/assets/${data.assets}/${randomImage}`
          console.log('Using local image:', imagePath)
          setCurrentImage(imagePath)
        }
      })
      .catch((err) => console.error('Failed to load config:', err))
  }, [])

  // Play music for current phase
  useEffect(() => {
    if (!config || !currentPhase) return

    const phaseMusic = currentPhase.music
    if (!phaseMusic || phaseMusic.length === 0) return

    const randomTrack = phaseMusic[Math.floor(Math.random() * phaseMusic.length)]
    const musicPath = `/assets/${config.assets}/${randomTrack}`

    // Determine which audio ref to use (crossfade setup)
    const activeRef = currentMusicRef.current === 1 ? musicRef1 : musicRef2
    const nextRef = currentMusicRef.current === 1 ? musicRef2 : musicRef1

    // Start new track in the inactive ref
    if (nextRef.current) {
      nextRef.current.src = musicPath
      nextRef.current.loop = true
      nextRef.current.volume = 0
      // Mock: try to play, but fail silently if file doesn't exist
      nextRef.current.play().catch(() => {
        // Silently handle missing audio files (mocking)
      })
    }

    // Fade out current, fade in new
    const fadeOutDuration = 1000 // 1 second
    const steps = 50
    const stepTime = fadeOutDuration / steps
    let step = 0

    // Clear any existing fade interval
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current)
    }

    const isActivePlaying = activeRef.current && !activeRef.current.paused

    fadeIntervalRef.current = setInterval(() => {
      step++
      const progress = step / steps

      if (isActivePlaying && activeRef.current) {
        activeRef.current.volume = Math.max(0, (1 - progress) * volume * (muted ? 0 : 1))
      }

      if (nextRef.current) {
        nextRef.current.volume = Math.min(
          volume * (muted ? 0 : 1),
          progress * volume * (muted ? 0 : 1)
        )
      }

      if (step >= steps) {
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

  // Update image when phase changes
  useEffect(() => {
    if (!currentPhase) return

    // Fade out current image
    setImageOpacity(0)

    setTimeout(() => {
      const randomImage =
        currentPhase.images[Math.floor(Math.random() * currentPhase.images.length)]
      setCurrentImageFilename(randomImage)

      // Use mock image if config has one, otherwise try to load actual image
      if (config?.mockImage) {
        setCurrentImage(config.mockImage)
      } else {
        setCurrentImage(`/assets/${config?.assets}/${randomImage}`)
      }

      // Fade in new image
      setImageOpacity(1)
    }, 500) // Half of transition time
  }, [currentPhase, config])

  // Keyboard controls
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

      // Victory
      if (matchesKeybind(e.key, keybinds.victory)) {
        e.preventDefault()
        if (config.victory) {
          setCurrentPhase(config.victory)
        }
        return
      }

      // Defeat
      if (matchesKeybind(e.key, keybinds.defeat)) {
        e.preventDefault()
        if (config.defeat) {
          setCurrentPhase(config.defeat)
        }
        return
      }

      // SFX (1-9)
      if (matchesKeybind(e.key, keybinds.sfx)) {
        e.preventDefault()
        const sfxIndex = Number.parseInt(e.key, 10) - 1
        const sfx = config.sfx?.[sfxIndex]
        if (sfx && sfxRef.current) {
          const sfxPath = `/assets/${config.assets}/${sfx.file}`
          sfxRef.current.src = sfxPath
          sfxRef.current.volume = volume * (muted ? 0 : 1)
          // Mock: try to play, but fail silently if file doesn't exist
          sfxRef.current.play().catch(() => {
            // Silently handle missing audio files (mocking)
          })
        }
        return
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
  }, [config, currentPhase, muted, showHelp, volume])

  // Update audio volumes when muted/volume changes
  useEffect(() => {
    const activeRef = currentMusicRef.current === 1 ? musicRef1 : musicRef2
    if (activeRef.current) {
      activeRef.current.volume = volume * (muted ? 0 : 1)
    }
  }, [volume, muted])

  // Build help text from config keybinds
  const getHelpText = (): Array<{ label: string; keys: string }> => {
    if (!config || !config.keybinds) return []

    const { keybinds } = config
    const help: Array<{ label: string; keys: string }> = []

    // Helper to format key names for display
    const formatKeys = (keys: string[]): string => {
      return keys.map((k) => (k === ' ' ? 'Space' : k.toUpperCase())).join('/')
    }

    if (keybinds.nextPhase) {
      help.push({ label: 'Advance to next phase', keys: formatKeys(keybinds.nextPhase) })
    }
    if (keybinds.victory) {
      help.push({ label: 'Jump to victory phase', keys: formatKeys(keybinds.victory) })
    }
    if (keybinds.defeat) {
      help.push({ label: 'Jump to defeat phase', keys: formatKeys(keybinds.defeat) })
    }
    if (keybinds.sfx) {
      help.push({ label: 'Play sound effects', keys: formatKeys(keybinds.sfx) })
    }
    if (keybinds.mute) {
      help.push({ label: 'Toggle mute', keys: formatKeys(keybinds.mute) })
    }
    if (keybinds.help) {
      help.push({ label: 'Toggle this help', keys: formatKeys(keybinds.help) })
    }

    return help
  }

  if (!config || !currentPhase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="space-y-6 text-center">
          <div className="animate-pulse font-black text-6xl text-white tracking-wider">LOADING</div>
          <div className="flex justify-center gap-3">
            <div className="h-3 w-3 animate-bounce rounded-full bg-white" />
            <div
              className="h-3 w-3 animate-bounce rounded-full bg-gray-400"
              style={{ animationDelay: '0.15s' }}
            />
            <div
              className="h-3 w-3 animate-bounce rounded-full bg-gray-600"
              style={{ animationDelay: '0.3s' }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Image */}
      {currentImage && (
        <img
          src={currentImage}
          alt={currentPhase.name}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
          style={{
            opacity: imageOpacity,
          }}
        />
      )}

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Content Container */}
      <div className="relative z-10 flex h-full flex-col p-6 md:p-10">
        {/* Top Info Bar */}
        <div className="flex items-start justify-end">
          {currentImageFilename && (
            <div className="rounded-xl border border-white/20 bg-black/50 px-4 py-2 backdrop-blur-lg">
              <div className="max-w-xs truncate font-mono text-[10px] text-white/60">
                {currentImageFilename}
              </div>
            </div>
          )}
        </div>

        {/* Center - Phase Name */}
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1
              className="text-7xl text-white tracking-tight md:text-9xl"
              style={{
                textShadow:
                  '4px 4px 12px rgba(0,0,0,0.9), 8px 8px 24px rgba(0,0,0,0.6), 0 0 60px rgba(0,0,0,0.5)',
                WebkitTextStroke: '2px rgba(0,0,0,0.3)',
                paintOrder: 'stroke fill',
              }}
            >
              {currentPhase.name.toUpperCase()}
            </h1>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="/config"
            className="rounded-xl border border-white/30 bg-white/10 px-8 py-4 backdrop-blur-lg transition-all duration-300 hover:border-white/50 hover:bg-white/20"
          >
            <span className="font-bold text-sm text-white uppercase tracking-wide">
              Config Builder
            </span>
          </a>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setShowHelp(true)
            }}
            title="Show keyboard shortcuts"
            className="cursor-pointer rounded-xl border border-white/30 bg-white/10 px-8 py-4 backdrop-blur-lg transition-all duration-300 hover:border-white/50 hover:bg-white/20"
          >
            <span className="font-bold text-sm text-white uppercase tracking-wide">Shortcuts</span>
          </button>

          <button
            type="button"
            onClick={() => setMuted(!muted)}
            title={muted ? 'Unmute' : 'Mute'}
            className="rounded-xl border border-white/30 bg-white/10 px-6 py-4 backdrop-blur-lg transition-all duration-300 hover:border-white/50 hover:bg-white/20"
          >
            <span className="text-white text-xl">{muted ? '🔇' : '🔊'}</span>
          </button>
        </div>
      </div>

      {/* Help Overlay */}
      {showHelp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowHelp(false)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || (e.key === 'Enter' && e.target === e.currentTarget)) {
              setShowHelp(false)
            }
          }}
        >
          <div className="mx-4 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border-2 border-white/20 bg-zinc-900 p-10 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-black text-4xl text-white tracking-tight">KEYBOARD SHORTCUTS</h2>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                aria-label="Close"
                className="flex h-12 w-12 items-center justify-center rounded-lg text-3xl text-white/50 leading-none transition-all duration-200 hover:bg-white/10 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {getHelpText().map((item) => (
                <div
                  key={`${item.keys}-${item.label}`}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-5 py-4 transition-all duration-200 hover:bg-white/10"
                >
                  <span className="font-semibold text-base text-white">{item.label}</span>
                  <div className="flex gap-2">
                    {item.keys.split('/').map((key) => (
                      <kbd
                        key={key}
                        className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-bold font-mono text-sm text-white"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-white/60">
                Press{' '}
                <kbd className="mx-1 rounded border border-white/20 bg-white/10 px-3 py-1 font-mono text-white text-xs">
                  ESC
                </kbd>{' '}
                to close
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Audio Elements */}
      <audio ref={musicRef1}>
        <track kind="captions" />
      </audio>
      <audio ref={musicRef2}>
        <track kind="captions" />
      </audio>
      <audio ref={sfxRef}>
        <track kind="captions" />
      </audio>
    </div>
  )
}

export default App
