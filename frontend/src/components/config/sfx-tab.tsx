'use client'

import { Plus, Trash2, X } from 'lucide-react'
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
        <div
          key={`sfx-${idx}-${sfx.file}`}
          className="rounded-xl border border-white/8 bg-[rgba(20,20,20,0.3)] p-4 backdrop-blur-sm transition-all hover:border-white/12 hover:bg-[rgba(20,20,20,0.4)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-light text-[#e5e5e5] text-base opacity-80">SFX {idx + 1}</h3>
            <button
              type="button"
              onClick={() => removeArrayItem('sfx', idx)}
              className="flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-light text-sm text-white/60 transition-all hover:text-white/90"
              title="Remove SFX"
            >
              <Trash2 size={16} />
              Remove
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label
                htmlFor={`sfx-${idx}-file`}
                className="mb-2 block font-light text-[#e5e5e5] text-sm opacity-70"
              >
                File
              </label>
              <input
                id={`sfx-${idx}-file`}
                type="text"
                value={sfx.file || ''}
                onChange={(e) => updateArrayItem('sfx', idx, { ...sfx, file: e.target.value })}
                placeholder="sfx.mp3"
                className="w-full rounded-lg border border-white/10 bg-[rgba(20,20,20,0.4)] px-3 py-2 text-[#e5e5e5] text-sm transition-all placeholder:text-white/30 focus:scale-[1.02] focus:border-white/25 focus:bg-[rgba(20,20,20,0.6)] focus:outline-none focus:ring-2 focus:ring-white/5"
              />
            </div>
            <div>
              <label
                htmlFor={`sfx-${idx}-keybind`}
                className="mb-2 block font-light text-[#e5e5e5] text-sm opacity-70"
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
                      className="flex-1 rounded-lg border border-white/10 bg-[rgba(20,20,20,0.4)] px-3 py-2 text-[#e5e5e5] text-sm transition-all placeholder:text-white/30 focus:scale-[1.02] focus:border-white/25 focus:bg-[rgba(20,20,20,0.6)] focus:outline-none focus:ring-2 focus:ring-white/5"
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
                      className="cursor-pointer border-0 bg-transparent p-0 text-white/60 transition-all hover:text-white/90"
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
                  className="flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-light text-sm text-white/60 transition-all hover:text-white/90"
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
        className="flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-light text-sm text-white/60 transition-all hover:text-white/90"
      >
        <Plus size={16} />
        Add Sound Effect
      </button>
    </div>
  )
}
