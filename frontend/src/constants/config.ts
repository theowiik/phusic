// Config-related constants
export const DEFAULT_GAME = 'chess'
export const DEFAULT_CONFIG_GAME = 'eldritch_horror'

export const getConfigPath = (game?: string): string => {
  return `/assets/${game || DEFAULT_GAME}/config.json`
}

export const getAssetPath = (assetsFolder: string, filename: string): string => {
  // If filename is already a full URL, return it as-is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename
  }
  // Otherwise, construct local path
  return `/assets/${assetsFolder}/${filename}`
}
