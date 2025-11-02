import { useState, useEffect, useRef } from 'react'

// Get config path from URL params or use default
const getConfigPath = () => {
  const params = new URLSearchParams(window.location.search)
  const game = params.get('game') || 'eldritch_horror'
  return `/assets/${game}/config.json`
}

// Helper to check if key matches any keybind
const matchesKeybind = (key, keybindArray) => {
  return keybindArray && Array.isArray(keybindArray) && keybindArray.includes(key)
}

function App() {
  const [config, setConfig] = useState(null)
  const [currentPhase, setCurrentPhase] = useState(null)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [currentImage, setCurrentImage] = useState('')
  const [currentImageFilename, setCurrentImageFilename] = useState('')
  const [imageOpacity, setImageOpacity] = useState(1)

  const musicRef1 = useRef(null)
  const musicRef2 = useRef(null)
  const sfxRef = useRef(null)
  const currentMusicRef = useRef(1) // Track which music ref is active
  const fadeIntervalRef = useRef(null)

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
          setCurrentImage(data.mockImage)
        } else {
          setCurrentImage(`/assets/${data.assets}/${randomImage}`)
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
    const fadeInDuration = 1000 // 1 second
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
        clearInterval(fadeIntervalRef.current)
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

    const handleKeyDown = (e) => {
      // Ignore if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

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
        const sfxIndex = Number.parseInt(e.key) - 1
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
  const getHelpText = () => {
    if (!config || !config.keybinds) return []

    const { keybinds } = config
    const help = []

    // Helper to format key names for display
    const formatKeys = (keys) => {
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
    return <div>Loading...</div>
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${currentImage})`,
          opacity: imageOpacity,
        }}
      />

      {/* Phase Name Overlay */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl text-white text-center z-10 pointer-events-none"
        style={{
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.8)',
        }}
      >
        {currentPhase.name}
      </div>

      {/* Image Filename Display */}
      {currentImageFilename && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-base text-white bg-black/50 px-4 py-2 rounded z-10 pointer-events-none"
          style={{
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          }}
        >
          {currentImageFilename}
        </div>
      )}

      {/* Help Overlay */}
      {showHelp && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 text-white flex items-center justify-center z-[100]">
          <div className="text-2xl leading-8">
            {getHelpText().map((item) => (
              <div key={`${item.keys}-${item.label}`}>
                <strong>{item.keys}:</strong> {item.label}
              </div>
            ))}
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
