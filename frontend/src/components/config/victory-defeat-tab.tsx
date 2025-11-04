'use client'

import type { Config, Phase } from '../../types'
import { ImagePreview } from './image-preview'

interface VictoryDefeatTabProps {
  config: Config
  updateConfig: (path: string, value: unknown) => void
}

export const VictoryDefeatTab = ({ config, updateConfig }: VictoryDefeatTabProps) => {
  return (
    <div className="space-y-8">
      {(['victory', 'defeat'] as const).map((type) => {
        const phase = config[type] || ({ name: '', next: 0, images: [], music: [] } as Phase)
        return (
          <div key={type} className="rounded-lg border border-gray-200 p-6">
            <h3 className="mb-4 font-bold text-gray-900 text-xl capitalize">{type}</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor={`${type}-name`} className="mb-2 block font-medium text-gray-700">
                  Name
                </label>
                <input
                  id={`${type}-name`}
                  type="text"
                  value={phase.name || ''}
                  onChange={(e) => updateConfig(type, { ...phase, name: e.target.value })}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor={`${type}-next`} className="mb-2 block font-medium text-gray-700">
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
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor={`${type}-images`} className="mb-2 block font-medium text-gray-700">
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
                          className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = phase.images.filter(
                              (_: string, i: number) => i !== imgIdx
                            )
                            updateConfig(type, { ...phase, images: newImages })
                          }}
                          className="rounded bg-red-600 px-3 py-2 font-bold text-white transition hover:bg-red-700"
                        >
                          ×
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
                    className="rounded bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
                  >
                    + Add Image
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor={`${type}-music`} className="mb-2 block font-medium text-gray-700">
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
                        className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newMusic = phase.music.filter(
                            (_: string, i: number) => i !== musIdx
                          )
                          updateConfig(type, { ...phase, music: newMusic })
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
                      const newMusic = [...(phase.music || []), '']
                      updateConfig(type, { ...phase, music: newMusic })
                    }}
                    className="rounded bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
                  >
                    + Add Music
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
