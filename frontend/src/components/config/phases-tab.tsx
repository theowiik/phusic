'use client'

import { Plus, Trash2, X } from 'lucide-react'
import type { Config } from '../../types'
import { ImagePreview } from './image-preview'

interface PhasesTabProps {
  config: Config
  updateArrayItem: (path: string, index: number, value: unknown) => void
  addArrayItem: (path: string, defaultValue: unknown) => void
  updateConfig: (path: string, value: unknown) => void
}

export const PhasesTab = ({
  config,
  updateArrayItem,
  addArrayItem,
  updateConfig,
}: PhasesTabProps) => {
  return (
    <div className="space-y-4">
      {config.phases?.map((phase, phaseIdx) => (
        <div
          key={`phase-${phaseIdx}-${phase.name}`}
          className="rounded-xl border border-white/8 bg-[rgba(20,20,20,0.3)] p-4 backdrop-blur-sm transition-all hover:border-white/12 hover:bg-[rgba(20,20,20,0.4)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-light text-[#e5e5e5] text-base opacity-80">Phase {phaseIdx + 1}</h3>
            <button
              type="button"
              onClick={() => {
                const newPhases = config.phases.filter((_, i) => i !== phaseIdx)
                updateConfig('phases', newPhases)
              }}
              className="flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-light text-sm text-white/60 transition-all hover:text-white/90"
              title="Remove phase"
            >
              <Trash2 size={16} />
              Remove
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label
                htmlFor={`phase-${phaseIdx}-name`}
                className="mb-2 block font-light text-[#e5e5e5] text-sm opacity-70"
              >
                Name
              </label>
              <input
                id={`phase-${phaseIdx}-name`}
                type="text"
                value={phase.name || ''}
                onChange={(e) =>
                  updateArrayItem('phases', phaseIdx, { ...phase, name: e.target.value })
                }
                className="w-full rounded-lg border border-white/10 bg-[rgba(20,20,20,0.4)] px-3 py-2 text-[#e5e5e5] text-sm transition-all placeholder:text-white/30 focus:scale-[1.02] focus:border-white/25 focus:bg-[rgba(20,20,20,0.6)] focus:outline-none focus:ring-2 focus:ring-white/5"
              />
            </div>
            <div>
              <label
                htmlFor={`phase-${phaseIdx}-next`}
                className="mb-2 block font-light text-[#e5e5e5] text-sm opacity-70"
              >
                Next Phase Index
              </label>
              <input
                id={`phase-${phaseIdx}-next`}
                type="number"
                value={phase.next ?? ''}
                onChange={(e) =>
                  updateArrayItem('phases', phaseIdx, {
                    ...phase,
                    next: Number.parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full rounded-lg border border-white/10 bg-[rgba(20,20,20,0.4)] px-3 py-2 text-[#e5e5e5] text-sm transition-all placeholder:text-white/30 focus:scale-[1.02] focus:border-white/25 focus:bg-[rgba(20,20,20,0.6)] focus:outline-none focus:ring-2 focus:ring-white/5"
              />
            </div>
            <div>
              <label
                htmlFor={`phase-${phaseIdx}-keybind`}
                className="mb-2 block font-light text-[#e5e5e5] text-sm opacity-70"
              >
                Keybind (optional)
              </label>
              <div className="space-y-2">
                {(phase.keybind || []).map((kb, kbIdx) => (
                  <div key={`phase-${phaseIdx}-kb-${kbIdx}-${kb}`} className="flex gap-2">
                    <input
                      type="text"
                      value={kb}
                      onChange={(e) => {
                        const newKeybind = [...(phase.keybind || [])]
                        newKeybind[kbIdx] = e.target.value
                        updateArrayItem('phases', phaseIdx, {
                          ...phase,
                          keybind: newKeybind,
                        })
                      }}
                      placeholder="key"
                      className="flex-1 rounded-lg border border-white/10 bg-[rgba(20,20,20,0.4)] px-3 py-2 text-[#e5e5e5] text-sm transition-all placeholder:text-white/30 focus:scale-[1.02] focus:border-white/25 focus:bg-[rgba(20,20,20,0.6)] focus:outline-none focus:ring-2 focus:ring-white/5"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newKeybind = (phase.keybind || []).filter((_, i) => i !== kbIdx)
                        updateArrayItem('phases', phaseIdx, {
                          ...phase,
                          keybind: newKeybind.length > 0 ? newKeybind : undefined,
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
                    const newKeybind = [...(phase.keybind || []), '']
                    updateArrayItem('phases', phaseIdx, { ...phase, keybind: newKeybind })
                  }}
                  className="flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-light text-sm text-white/60 transition-all hover:text-white/90"
                >
                  <Plus size={16} />
                  Add Keybind
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor={`phase-${phaseIdx}-images`}
                className="mb-2 block font-light text-[#e5e5e5] text-sm opacity-70"
              >
                Images
              </label>
              <div className="space-y-3">
                {phase.images?.map((img, imgIdx) => (
                  <div key={`phase-${phaseIdx}-img-${imgIdx}-${img}`}>
                    <div className="mb-2 flex gap-2">
                      <input
                        type="text"
                        value={img}
                        onChange={(e) => {
                          const newImages = [...phase.images]
                          newImages[imgIdx] = e.target.value
                          updateArrayItem('phases', phaseIdx, {
                            ...phase,
                            images: newImages,
                          })
                        }}
                        placeholder="image.jpg"
                        className="flex-1 rounded-lg border border-white/10 bg-[rgba(20,20,20,0.4)] px-3 py-2 text-[#e5e5e5] text-sm transition-all placeholder:text-white/30 focus:scale-[1.02] focus:border-white/25 focus:bg-[rgba(20,20,20,0.6)] focus:outline-none focus:ring-2 focus:ring-white/5"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = phase.images.filter((_, i) => i !== imgIdx)
                          updateArrayItem('phases', phaseIdx, {
                            ...phase,
                            images: newImages,
                          })
                        }}
                        className="cursor-pointer border-0 bg-transparent p-0 text-white/60 transition-all hover:text-white/90"
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <ImagePreview imageName={img} assetsFolder={config.assets} />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newImages = [...(phase.images || []), '']
                    updateArrayItem('phases', phaseIdx, { ...phase, images: newImages })
                  }}
                  className="flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-light text-sm text-white/60 transition-all hover:text-white/90"
                >
                  <Plus size={16} />
                  Add Image
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor={`phase-${phaseIdx}-music`}
                className="mb-2 block font-light text-[#e5e5e5] text-sm opacity-70"
              >
                Music
              </label>
              <div className="space-y-2">
                {phase.music?.map((mus, musIdx) => (
                  <div key={`phase-${phaseIdx}-music-${musIdx}-${mus}`} className="flex gap-2">
                    <input
                      type="text"
                      value={mus}
                      onChange={(e) => {
                        const newMusic = [...phase.music]
                        newMusic[musIdx] = e.target.value
                        updateArrayItem('phases', phaseIdx, { ...phase, music: newMusic })
                      }}
                      placeholder="music.mp3"
                      className="flex-1 rounded-lg border border-white/10 bg-[rgba(20,20,20,0.4)] px-3 py-2 text-[#e5e5e5] text-sm transition-all placeholder:text-white/30 focus:scale-[1.02] focus:border-white/25 focus:bg-[rgba(20,20,20,0.6)] focus:outline-none focus:ring-2 focus:ring-white/5"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newMusic = phase.music.filter((_, i) => i !== musIdx)
                        updateArrayItem('phases', phaseIdx, { ...phase, music: newMusic })
                      }}
                      className="cursor-pointer border-0 bg-transparent p-0 text-white/60 transition-all hover:text-white/90"
                      title="Remove music"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newMusic = [...(phase.music || []), '']
                    updateArrayItem('phases', phaseIdx, { ...phase, music: newMusic })
                  }}
                  className="flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-light text-sm text-white/60 transition-all hover:text-white/90"
                >
                  <Plus size={16} />
                  Add Music
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          addArrayItem('phases', {
            name: 'New Phase',
            next: 0,
            images: [],
            music: [],
          })
        }
        className="flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-light text-sm text-white/60 transition-all hover:text-white/90"
      >
        <Plus size={16} />
        Add Phase
      </button>
    </div>
  )
}
