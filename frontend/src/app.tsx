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
        <div className="text-white text-4xl">LOADING</div>
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
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: imageOpacity,
            transition: 'opacity 1s',
          }}
        />
      )}

      {/* Content Container */}
      <div className="relative z-10 flex h-full flex-col p-6">
        {/* Top Info Bar */}
        <div className="flex justify-end">
          {currentImageFilename && (
            <div className="bg-black/50 px-3 py-2">
              <div className="font-mono text-xs text-white/60">{currentImageFilename}</div>
            </div>
          )}
        </div>

        {/* Center - Phase Name */}
        <div className="flex flex-1 items-center justify-center">
          <h1 className="text-6xl text-white" style={{ textShadow: '2px 2px 4px black' }}>
            {currentPhase.name.toUpperCase()}
          </h1>
        </div>

        {/* Bottom Controls */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMuted(!muted)}
            title={muted ? 'Unmute' : 'Mute'}
            className="flex-1 bg-white text-black py-3 hover:bg-white/90 text-xl"
          >
            {muted ? '🔇' : '🔊'}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setShowHelp(true)
            }}
            title="Show keyboard shortcuts"
            className="flex-1 bg-white text-black py-3 hover:bg-white/90 text-sm font-medium"
          >
            Shortcuts
          </button>

          <a href="/config" className="flex-1 bg-white text-black py-3 hover:bg-white/90 text-sm font-medium text-center">
            Config
          </a>
        </div>
      </div>

      {/* Help Overlay */}
      {showHelp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
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
          <div className="max-w-2xl w-full bg-zinc-900 p-8">
            <div className="mb-6 flex justify-between">
              <h2 className="text-white text-3xl">KEYBOARD SHORTCUTS</h2>
              <button type="button" onClick={() => setShowHelp(false)} aria-label="Close" className="text-white text-2xl">
                ×
              </button>
            </div>

            <div className="space-y-2">
              {getHelpText().map((item) => (
                <div key={`${item.keys}-${item.label}`} className="flex justify-between bg-white/5 px-4 py-3">
                  <span className="text-white">{item.label}</span>
                  <div className="flex gap-2">
                    {item.keys.split('/').map((key) => (
                      <kbd key={key} className="bg-white/10 px-3 py-1 font-mono text-white text-sm">
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                Press <kbd className="bg-white/10 px-2 py-1 font-mono text-white text-xs">ESC</kbd> to close
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
