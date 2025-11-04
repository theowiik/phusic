'use client'

import type { Config } from '../../types'

interface SFXTabProps {
  config: Config
  updateArrayItem: (path: string, index: number, value: unknown) => void
  addArrayItem: (path: string, defaultValue: unknown) => void
  removeArrayItem: (path: string, index: number) => void
}

export const SFXTab = ({ config, updateArrayItem, addArrayItem, removeArrayItem }: SFXTabProps) => {
  return (
    <div className="space-y-6">
      {config.sfx?.map((sfx, idx) => (
        <div key={`sfx-${idx}-${sfx.file}`} className="rounded-lg border border-gray-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg">SFX {idx + 1}</h3>
            <button
              type="button"
              onClick={() => removeArrayItem('sfx', idx)}
              className="rounded bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
            >
              Remove
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor={`sfx-${idx}-file`} className="mb-2 block font-medium text-gray-700">
                File
              </label>
              <input
                id={`sfx-${idx}-file`}
                type="text"
                value={sfx.file || ''}
                onChange={(e) => updateArrayItem('sfx', idx, { ...sfx, file: e.target.value })}
                placeholder="sfx.mp3"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor={`sfx-${idx}-keybind`}
                className="mb-2 block font-medium text-gray-700"
              >
                Keybind
              </label>
              <div className="space-y-2">
                {(sfx.keybind || []).map((kb, kbIdx) => (
                  <div key={`sfx-${idx}-kb-${kbIdx}-${kb}`} className="flex gap-2">
                    <input
                      type="text"
                      value={kb}
                      onChange={(e) => {
                        const newKeybind = [...(sfx.keybind || [])]
                        newKeybind[kbIdx] = e.target.value
                        updateArrayItem('sfx', idx, {
                          ...sfx,
                          keybind: newKeybind,
                        })
                      }}
                      placeholder="key"
                      className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newKeybind = (sfx.keybind || []).filter((_, i) => i !== kbIdx)
                        updateArrayItem('sfx', idx, {
                          ...sfx,
                          keybind: newKeybind,
                        })
                      }}
                      className="rounded bg-red-600 px-3 py-2 font-bold text-white transition hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newKeybind = [...(sfx.keybind || []), '']
                    updateArrayItem('sfx', idx, { ...sfx, keybind: newKeybind })
                  }}
                  className="rounded bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
                >
                  + Add Keybind
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem('sfx', { file: '', keybind: [] })}
        className="rounded bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
      >
        + Add Sound Effect
      </button>
    </div>
  )
}
