'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getConfigPath } from '../constants/config'
import { loadConfig } from '../services/config-service'
import type { Config } from '../types'

export const useConfig = () => {
  const searchParams = useSearchParams()
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!searchParams) return

    const game = searchParams.get('game')
    const configPath = getConfigPath(game || undefined)

    loadConfig(configPath)
      .then((data) => {
        setConfig(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load config:', err)
        setError(err)
        setLoading(false)
      })
  }, [searchParams])

  return { config, loading, error }
}
