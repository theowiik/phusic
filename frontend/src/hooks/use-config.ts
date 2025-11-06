'use client'

import { useEffect, useState } from 'react'
import { getConfigPath } from '../constants/config'
import { loadConfig } from '../services/config-service'
import type { Config } from '../types'

export const useConfig = (gameName?: string) => {
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!gameName) {
      setLoading(false)
      return
    }

    const configPath = getConfigPath(gameName)

    loadConfig(configPath)
      .then((data) => {
        // Merge defaults only for mute and help if they're missing
        const mergedConfig: Config = {
          ...data,
          keybinds: {
            ...data.keybinds,
            // Only apply defaults if missing
            mute: data.keybinds?.mute || ['m', 'M'],
            help: data.keybinds?.help || ['h', 'H'],
            // nextPhase should only come from config, no default
            nextPhase: data.keybinds?.nextPhase,
          },
        }
        setConfig(mergedConfig)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load config:', err)
        setError(err)
        setLoading(false)
      })
  }, [gameName])

  return { config, loading, error }
}
