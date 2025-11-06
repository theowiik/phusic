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
            <label htmlFor={`keybinds-${key}`} className="mb-2 block font-light text-sm text-[#e5e5e5] opacity-70">
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
                    className="input-clear flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(`keybinds.${key}`, idx)}
                    className="btn-clear"
                    title="Remove"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(`keybinds.${key}`, '')}
                className="btn-clear flex items-center gap-1 text-sm font-light"
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
            className="btn-clear flex items-center gap-1 text-sm font-light"
          >
            <Plus size={16} />
            Add Next Phase Keybind
          </button>
        </div>
      )}
    </div>
  )
}
