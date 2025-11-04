import type { Config } from '../types'

export const loadConfig = async (configPath: string): Promise<Config> => {
  const response = await fetch(configPath)
  if (!response.ok) {
    throw new Error(`Failed to load config: ${response.statusText}`)
  }
  return response.json()
}
