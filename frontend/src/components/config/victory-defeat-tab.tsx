'use client'

import { Plus, X } from 'lucide-react'
import type { Config, Phase } from '../../types'
import { ImagePreview } from './image-preview'

interface VictoryDefeatTabProps {
  config: Config
  updateConfig: (path: string, value: unknown) => void
}

export const VictoryDefeatTab = ({ config, updateConfig }: VictoryDefeatTabProps) => {
  return (
    <div className="space-y-6">
      {(['victory', 'defeat'] as const).map((type) => {
        const phase = config[type] || ({ name: '', next: 0, images: [], music: [] } as Phase)
        return (
          <div key={type} className="card-clear">
            <h3 className="mb-3 font-light text-[#e5e5e5] text-base capitalize opacity-80">
              {type}
            </h3>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor={`${type}-name`}
                  className="mb-2 block font-light text-[#e5e5e5] text-sm opacity-70"
                >
                  Name
                </label>
                <input
                  id={`${type}-name`}
                  type="text"
                  value={phase.name || ''}
                  onChange={(e) => updateConfig(type, { ...phase, name: e.target.value })}
                  className="input-clear w-full"
                />
              </div>
              <div>
                <label
                  htmlFor={`${type}-next`}
                  className="mb-2 block font-light text-[#e5e5e5] text-sm opacity-70"
                >
                  Next Phase Index
                </label>
                <input
                  id={`${type}-next`}
                  type="number"
                  value={phase.next ?? ''}
                  onChange={(e) =>
                    updateConfig(type, {
                      ...phase,
                      next: Number.parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="input-clear w-full"
                />
              </div>
              <div>
                <label
                  htmlFor={`${type}-images`}
                  className="mb-2 block font-light text-[#e5e5e5] text-sm opacity-70"
                >
                  Images
                </label>
                <div className="space-y-3">
                  {phase.images?.map((img: string, imgIdx: number) => (
                    <div key={`${type}-img-${imgIdx}-${img}`}>
                      <div className="mb-2 flex gap-2">
                        <input
                          type="text"
                          value={img}
                          onChange={(e) => {
                            const newImages = [...phase.images]
                            newImages[imgIdx] = e.target.value
                            updateConfig(type, { ...phase, images: newImages })
                          }}
                          placeholder="image.jpg"
                          className="input-clear flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = phase.images.filter(
                              (_: string, i: number) => i !== imgIdx
                            )
                            updateConfig(type, { ...phase, images: newImages })
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
                      updateConfig(type, { ...phase, images: newImages })
                    }}
                    className="btn-clear flex items-center gap-1 font-light text-sm"
                  >
                    <Plus size={16} />
                    Add Image
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor={`${type}-music`}
                  className="mb-2 block font-light text-[#e5e5e5] text-sm opacity-70"
                >
                  Music
                </label>
                <div className="space-y-2">
                  {phase.music?.map((mus: string, musIdx: number) => (
                    <div key={`${type}-music-${musIdx}-${mus}`} className="flex gap-2">
                      <input
                        type="text"
                        value={mus}
                        onChange={(e) => {
                          const newMusic = [...phase.music]
                          newMusic[musIdx] = e.target.value
                          updateConfig(type, { ...phase, music: newMusic })
                        }}
                        placeholder="music.mp3"
                        className="input-clear flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newMusic = phase.music.filter(
                            (_: string, i: number) => i !== musIdx
                          )
                          updateConfig(type, { ...phase, music: newMusic })
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
                      updateConfig(type, { ...phase, music: newMusic })
                    }}
                    className="btn-clear flex items-center gap-1 font-light text-sm"
                  >
                    <Plus size={16} />
                    Add Music
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
