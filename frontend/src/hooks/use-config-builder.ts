'use client'

import { useCallback, useState } from 'react'
import type { Config } from '../types'
import { downloadJSON, updateNestedValue } from '../utils/config'

export const useConfigBuilder = (initialConfig: Config) => {
  const [config, setConfig] = useState<Config>(initialConfig)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const updateConfig = useCallback((path: string, value: unknown): void => {
    setConfig((prev) => updateNestedValue(prev, path, value))
  }, [])

  const updateArrayItem = useCallback((path: string, index: number, value: unknown): void => {
    setConfig((prev) => {
      const newConfig = { ...prev }
      const keys = path.split('.')
      let current: Record<string, unknown> = newConfig

      for (let i = 0; i < keys.length - 1; i++) {
        if (Array.isArray(current[keys[i]])) {
          current[keys[i]] = [...(current[keys[i]] as unknown[])]
        } else {
          current[keys[i]] = {
            ...(current[keys[i]] as Record<string, unknown>),
          }
        }
        current = current[keys[i]] as Record<string, unknown>
      }

      const arr = [...(current[keys[keys.length - 1]] as unknown[])]
      arr[index] = value
      current[keys[keys.length - 1]] = arr
      return newConfig
    })
  }, [])

  const addArrayItem = useCallback((path: string, defaultValue: unknown): void => {
    setConfig((prev) => {
      const newConfig = { ...prev }
      const keys = path.split('.')
      let current: Record<string, unknown> = newConfig

      for (let i = 0; i < keys.length - 1; i++) {
        if (Array.isArray(current[keys[i]])) {
          current[keys[i]] = [...(current[keys[i]] as unknown[])]
        } else {
          current[keys[i]] = {
            ...(current[keys[i]] as Record<string, unknown>),
          }
        }
        current = current[keys[i]] as Record<string, unknown>
      }

      const arr = [...(current[keys[keys.length - 1]] as unknown[])]
      arr.push(defaultValue)
      current[keys[keys.length - 1]] = arr
      return newConfig
    })
  }, [])

  const removeArrayItem = useCallback((path: string, index: number): void => {
    setConfig((prev) => {
      const newConfig = { ...prev }
      const keys = path.split('.')
      let current: Record<string, unknown> = newConfig

      for (let i = 0; i < keys.length - 1; i++) {
        if (Array.isArray(current[keys[i]])) {
          current[keys[i]] = [...(current[keys[i]] as unknown[])]
        } else {
          current[keys[i]] = { ...(current[keys[i]] as Record<string, unknown>) }
        }
        current = current[keys[i]] as Record<string, unknown>
      }

      const arr = [...(current[keys[keys.length - 1]] as unknown[])]
      arr.splice(index, 1)
      current[keys[keys.length - 1]] = arr
      return newConfig
    })
  }, [])

  const handleSave = useCallback(async (): Promise<void> => {
    setSaving(true)
    setSaveMessage('')
    try {
      downloadJSON(config, 'config.json')
      setSaveMessage('Config downloaded successfully! Copy it to the correct location.')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage(
        `Error saving config: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      setSaving(false)
    }
  }, [config])

  const handleCopyJSON = useCallback((): void => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    setSaveMessage('JSON copied to clipboard!')
    setTimeout(() => setSaveMessage(''), 2000)
  }, [config])

  return {
    config,
    setConfig,
    saving,
    saveMessage,
    updateConfig,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
    handleSave,
    handleCopyJSON,
  }
}
