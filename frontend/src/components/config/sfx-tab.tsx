'use client'

import { Plus, X, Trash2 } from 'lucide-react'
import type { Config } from '../../types'

interface SFXTabProps {
  config: Config
  updateArrayItem: (path: string, index: number, value: unknown) => void
  addArrayItem: (path: string, defaultValue: unknown) => void
  removeArrayItem: (path: string, index: number) => void
}

export const SFXTab = ({ config, updateArrayItem, addArrayItem, removeArrayItem }: SFXTabProps) => {
  return (
    <div className="space-y-4">
      {config.sfx?.map((sfx, idx) => (
        <div key={`sfx-${idx}-${sfx.file}`} className="card-clear">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-light text-[#e5e5e5] text-base opacity-80">SFX {idx + 1}</h3>
            <button
              type="button"
              onClick={() => removeArrayItem('sfx', idx)}
              className="btn-clear flex items-center gap-1 text-sm font-light"
              title="Remove SFX"
            >
              <Trash2 size={16} />
              Remove
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label htmlFor={`sfx-${idx}-file`} className="mb-2 block font-light text-sm text-[#e5e5e5] opacity-70">
                File
              </label>
              <input
                id={`sfx-${idx}-file`}
                type="text"
                value={sfx.file || ''}
                onChange={(e) => updateArrayItem('sfx', idx, { ...sfx, file: e.target.value })}
                placeholder="sfx.mp3"
                className="input-clear w-full"
              />
            </div>
            <div>
              <label
                htmlFor={`sfx-${idx}-keybind`}
                className="mb-2 block font-light text-sm text-[#e5e5e5] opacity-70"
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
                      className="input-clear flex-1"
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
                      className="btn-clear"
                      title="Remove keybind"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newKeybind = [...(sfx.keybind || []), '']
                    updateArrayItem('sfx', idx, { ...sfx, keybind: newKeybind })
                  }}
                  className="btn-clear flex items-center gap-1 text-sm font-light"
                >
                  <Plus size={16} />
                  Add Keybind
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem('sfx', { file: '', keybind: [] })}
        className="btn-clear flex items-center gap-1 text-sm font-light"
      >
        <Plus size={16} />
        Add Sound Effect
      </button>
    </div>
  )
}
