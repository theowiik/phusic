export interface Phase {
  name: string
  next: number
  images: string[]
  music: string[]
}

export interface Keybinds {
  nextPhase: string[]
  victory: string[]
  defeat: string[]
  sfx: string[]
  mute: string[]
  help: string[]
}

export interface SFX {
  file: string
}

export interface Config {
  assets: string
  mockImage?: string
  keybinds: Keybinds
  phases: Phase[]
  victory: Phase
  defeat: Phase
  sfx?: SFX[]
}

export interface HelpItem {
  label: string
  keys: string
}
