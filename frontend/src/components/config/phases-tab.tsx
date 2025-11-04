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
    <div className="space-y-6">
      {config.phases?.map((phase, phaseIdx) => (
        <div
          key={`phase-${phaseIdx}-${phase.name}`}
          className="rounded-lg border border-gray-200 p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-xl">Phase {phaseIdx + 1}</h3>
            <button
              type="button"
              onClick={() => {
                const newPhases = config.phases.filter((_, i) => i !== phaseIdx)
                updateConfig('phases', newPhases)
              }}
              className="rounded bg-red-600 px-3 py-1 font-medium text-white transition hover:bg-red-700"
            >
              Remove
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label
                htmlFor={`phase-${phaseIdx}-name`}
                className="mb-2 block font-medium text-gray-700"
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
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor={`phase-${phaseIdx}-next`}
                className="mb-2 block font-medium text-gray-700"
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
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor={`phase-${phaseIdx}-keybind`}
                className="mb-2 block font-medium text-gray-700"
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
                      className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
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
                      className="rounded bg-red-600 px-3 py-2 font-bold text-white transition hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newKeybind = [...(phase.keybind || []), '']
                    updateArrayItem('phases', phaseIdx, { ...phase, keybind: newKeybind })
                  }}
                  className="rounded bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
                >
                  + Add Keybind
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor={`phase-${phaseIdx}-images`}
                className="mb-2 block font-medium text-gray-700"
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
                        className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
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
                    updateArrayItem('phases', phaseIdx, { ...phase, images: newImages })
                  }}
                  className="rounded bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
                >
                  + Add Image
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor={`phase-${phaseIdx}-music`}
                className="mb-2 block font-medium text-gray-700"
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
                      className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newMusic = phase.music.filter((_, i) => i !== musIdx)
                        updateArrayItem('phases', phaseIdx, { ...phase, music: newMusic })
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
                    updateArrayItem('phases', phaseIdx, { ...phase, music: newMusic })
                  }}
                  className="rounded bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
                >
                  + Add Music
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
        className="rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
      >
        + Add Phase
      </button>
    </div>
  )
}
