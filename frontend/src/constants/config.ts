// Config-related constants
export const DEFAULT_GAME = 'chess'
export const DEFAULT_CONFIG_GAME = 'eldritch_horror'

export const getConfigPath = (game?: string): string => {
  return `/assets/${game || DEFAULT_GAME}/config.json`
}

export const getAssetPath = (assetsFolder: string, filename: string): string => {
  return `/assets/${assetsFolder}/${filename}`
}
