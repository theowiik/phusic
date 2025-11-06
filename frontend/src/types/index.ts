export interface Phase {
  name: string
  next: number
  images: string[]
  music: string[]
  keybind?: string[]
}

export interface Keybinds {
  nextPhase?: string[]
  mute: string[]
  help: string[]
}

export interface SFX {
  file: string
  keybind: string[]
}

export interface Config {
  assets: string
  mockImage?: string
  keybinds: Keybinds
  phases: Phase[]
  sfx?: SFX[]
  victory?: Phase
  defeat?: Phase
}

export interface HelpItem {
  label: string
  keys: string
}
