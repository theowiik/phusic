'use client'

import { Plus, X } from 'lucide-react'
import type { Config } from '../../types'

interface KeybindsTabProps {
  config: Config
  updateConfig: (path: string, value: unknown) => void
  addArrayItem: (path: string, defaultValue: unknown) => void
  removeArrayItem: (path: string, index: number) => void
}

export const KeybindsTab = ({
  config,
  updateConfig,
  addArrayItem,
  removeArrayItem,
}: KeybindsTabProps) => {
  const hasNextPhase = config.keybinds?.nextPhase !== undefined

  return (
    <div className="space-y-4">
      {Object.entries(config.keybinds || {}).map(([key, value]) => {
        const keybindValue = value as string[]
        return (
          <div key={key}>
            <label
              htmlFor={`keybinds-${key}`}
              className="mb-2 block font-light text-[#e5e5e5] text-sm opacity-70"
            >
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <div className="space-y-2">
              {keybindValue.map((kb, idx) => (
                <div key={`${key}-${idx}-${kb}`} className="flex gap-2">
                  <input
                    type="text"
                    value={kb}
                    onChange={(e) => {
                      const newKb = [...keybindValue]
                      newKb[idx] = e.target.value
                      updateConfig(`keybinds.${key}`, newKb)
                    }}
                    placeholder="key"
                    className="flex-1 rounded-lg border border-white/10 bg-[rgba(20,20,20,0.4)] px-3 py-2 text-[#e5e5e5] text-sm transition-all placeholder:text-white/30 focus:scale-[1.02] focus:border-white/25 focus:bg-[rgba(20,20,20,0.6)] focus:outline-none focus:ring-2 focus:ring-white/5"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(`keybinds.${key}`, idx)}
                    className="cursor-pointer border-0 bg-transparent p-0 text-white/60 transition-all hover:text-white/90"
                    title="Remove"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(`keybinds.${key}`, '')}
                className="flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-light text-sm text-white/60 transition-all hover:text-white/90"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>
        )
      })}
      {!hasNextPhase && (
        <div>
          <button
            type="button"
            onClick={() => updateConfig('keybinds.nextPhase', [''])}
            className="flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-light text-sm text-white/60 transition-all hover:text-white/90"
          >
            <Plus size={16} />
            Add Next Phase Keybind
          </button>
        </div>
      )}
    </div>
  )
}
