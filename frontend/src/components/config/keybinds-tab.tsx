'use client'

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
  return (
    <div className="space-y-6">
      {Object.entries(config.keybinds || {}).map(([key, value]) => {
        const keybindValue = value as string[]
        return (
          <div key={key}>
            <label htmlFor={`keybinds-${key}`} className="mb-2 block font-medium text-gray-700">
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
                    className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(`keybinds.${key}`, idx)}
                    className="rounded bg-red-600 px-3 py-2 font-bold text-white transition hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(`keybinds.${key}`, '')}
                className="rounded bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
              >
                + Add
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
