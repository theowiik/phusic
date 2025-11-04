// Helper to check if key matches any keybind
export const matchesKeybind = (key: string, keybindArray: string[] | undefined): boolean => {
  return keybindArray !== undefined && Array.isArray(keybindArray) && keybindArray.includes(key)
}

// Helper to format key names for display
export const formatKeys = (keys: string[]): string => {
  return keys.map((k) => (k === ' ' ? 'Space' : k.toUpperCase())).join('/')
}
