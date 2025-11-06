'use client'

import { Plus, X, Trash2 } from 'lucide-react'
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
          className="card-clear"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-light text-[#e5e5e5] text-base opacity-80">Phase {phaseIdx + 1}</h3>
            <button
              type="button"
              onClick={() => {
                const newPhases = config.phases.filter((_, i) => i !== phaseIdx)
                updateConfig('phases', newPhases)
              }}
              className="btn-clear flex items-center gap-1 text-sm font-light"
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
                className="mb-2 block font-light text-sm text-[#e5e5e5] opacity-70"
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
                className="input-clear w-full"
              />
            </div>
            <div>
              <label
                htmlFor={`phase-${phaseIdx}-next`}
                className="mb-2 block font-light text-sm text-[#e5e5e5] opacity-70"
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
                className="input-clear w-full"
              />
            </div>
            <div>
              <label
                htmlFor={`phase-${phaseIdx}-keybind`}
                className="mb-2 block font-light text-sm text-[#e5e5e5] opacity-70"
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
                      className="input-clear flex-1"
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
                    const newKeybind = [...(phase.keybind || []), '']
                    updateArrayItem('phases', phaseIdx, { ...phase, keybind: newKeybind })
                  }}
                  className="btn-clear flex items-center gap-1 text-sm font-light"
                >
                  <Plus size={16} />
                  Add Keybind
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor={`phase-${phaseIdx}-images`}
                className="mb-2 block font-light text-sm text-[#e5e5e5] opacity-70"
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
                        className="input-clear flex-1"
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
                        className="btn-clear"
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
                  className="btn-clear flex items-center gap-1 text-sm font-light"
                >
                  <Plus size={16} />
                  Add Image
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor={`phase-${phaseIdx}-music`}
                className="mb-2 block font-light text-sm text-[#e5e5e5] opacity-70"
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
                      className="input-clear flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newMusic = phase.music.filter((_, i) => i !== musIdx)
                        updateArrayItem('phases', phaseIdx, { ...phase, music: newMusic })
                      }}
                      className="btn-clear"
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
                  className="btn-clear flex items-center gap-1 text-sm font-light"
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
        className="btn-clear flex items-center gap-1 text-sm font-light"
      >
        <Plus size={16} />
        Add Phase
      </button>
    </div>
  )
}
