import { useEffect, useState } from 'react'
import type { Config } from './types'

// Get config path from URL params or use default
const getConfigPath = (): string => {
  const params = new URLSearchParams(window.location.search)
  const game = params.get('game') || 'eldritch_horror'
  return `/assets/${game}/config.json`
}

// Helper component to display image preview
const ImagePreview = ({ imageName, assetsFolder }: { imageName: string; assetsFolder: string }) => {
  if (!imageName) return null
  const imagePath = `/assets/${assetsFolder}/${imageName}`
  return (
    <img
      src={imagePath}
      alt={imageName}
      className="h-32 w-32 rounded border border-gray-300 object-cover"
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}

function ConfigBuilder() {
  const [config, setConfig] = useState<Config>({
    assets: 'eldritch_horror',
    mockImage: '',
    keybinds: {
      nextPhase: [' ', 'Enter'],
      victory: ['v', 'V'],
      defeat: ['d', 'D'],
      sfx: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      mute: ['m', 'M'],
      help: ['h', 'H'],
    },
    phases: [],
    victory: { name: 'Victory', next: 0, images: [], music: [] },
    defeat: { name: 'Defeat', next: 0, images: [], music: [] },
    sfx: [],
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [saveMessage, setSaveMessage] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('general')

  // Load config on mount
  useEffect(() => {
    const configPath = getConfigPath()
    fetch(configPath)
      .then((res) => res.json())
      .then((data) => {
        setConfig(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load config:', err)
        setLoading(false)
      })
  }, [])

  const updateConfig = (path: string, value: unknown): void => {
    setConfig((prev) => {
      const newConfig = { ...prev }
      const keys = path.split('.')
      let current: Record<string, unknown> = newConfig
      for (let i = 0; i < keys.length - 1; i++) {
        if (Array.isArray(current[keys[i]])) {
          current[keys[i]] = [...(current[keys[i]] as unknown[])]
        } else {
          current[keys[i]] = { ...(current[keys[i]] as Record<string, unknown>) }
        }
        current = current[keys[i]] as Record<string, unknown>
      }
      current[keys[keys.length - 1]] = value
      return newConfig
    })
  }

  const updateArrayItem = (path: string, index: number, value: unknown): void => {
    setConfig((prev) => {
      const newConfig = { ...prev }
      const keys = path.split('.')
      let current: Record<string, unknown> = newConfig
      for (let i = 0; i < keys.length - 1; i++) {
        if (Array.isArray(current[keys[i]])) {
          current[keys[i]] = [...(current[keys[i]] as unknown[])]
        } else {
          current[keys[i]] = { ...(current[keys[i]] as Record<string, unknown>) }
        }
        current = current[keys[i]] as Record<string, unknown>
      }
      const arr = [...(current[keys[keys.length - 1]] as unknown[])]
      arr[index] = value
      current[keys[keys.length - 1]] = arr
      return newConfig
    })
  }

  const addArrayItem = (path: string, defaultValue: unknown): void => {
    setConfig((prev) => {
      const newConfig = { ...prev }
      const keys = path.split('.')
      let current: Record<string, unknown> = newConfig
      for (let i = 0; i < keys.length - 1; i++) {
        if (Array.isArray(current[keys[i]])) {
          current[keys[i]] = [...(current[keys[i]] as unknown[])]
        } else {
          current[keys[i]] = { ...(current[keys[i]] as Record<string, unknown>) }
        }
        current = current[keys[i]] as Record<string, unknown>
      }
      const arr = [...(current[keys[keys.length - 1]] as unknown[])]
      arr.push(defaultValue)
      current[keys[keys.length - 1]] = arr
      return newConfig
    })
  }

  const removeArrayItem = (path: string, index: number): void => {
    setConfig((prev) => {
      const newConfig = { ...prev }
      const keys = path.split('.')
      let current: Record<string, unknown> = newConfig
      for (let i = 0; i < keys.length - 1; i++) {
        if (Array.isArray(current[keys[i]])) {
          current[keys[i]] = [...(current[keys[i]] as unknown[])]
        } else {
          current[keys[i]] = { ...(current[keys[i]] as Record<string, unknown>) }
        }
        current = current[keys[i]] as Record<string, unknown>
      }
      const arr = [...(current[keys[keys.length - 1]] as unknown[])]
      arr.splice(index, 1)
      current[keys[keys.length - 1]] = arr
      return newConfig
    })
  }

  const handleSave = async (): Promise<void> => {
    setSaving(true)
    setSaveMessage('')
    try {
      // In a real app, you'd send this to a backend API
      // For now, we'll download it as a file
      const blob = new Blob([JSON.stringify(config, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'config.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setSaveMessage('Config downloaded successfully! Copy it to the correct location.')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage(
        `Error saving config: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      setSaving(false)
    }
  }

  const handleCopyJSON = (): void => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    setSaveMessage('JSON copied to clipboard!')
    setTimeout(() => setSaveMessage(''), 2000)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600 text-xl">Loading config...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl p-8">
        {/* Header */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="mb-2 font-bold text-3xl text-gray-900">Config Builder</h1>
              <p className="text-gray-600">Edit your game configuration</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyJSON}
                className="rounded border border-gray-300 bg-gray-100 px-4 py-2 font-medium transition hover:bg-gray-200"
              >
                Copy JSON
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Download Config'}
              </button>
              <a
                href="/"
                className="rounded bg-gray-600 px-4 py-2 font-medium text-white transition hover:bg-gray-700"
              >
                Back to Game
              </a>
            </div>
          </div>
          {saveMessage && (
            <div className="rounded border border-green-300 bg-green-100 p-3 text-green-800">
              {saveMessage}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-gray-200 border-b">
            <nav className="flex gap-2 p-4">
              {[
                { id: 'general', label: 'General' },
                { id: 'keybinds', label: 'Keybinds' },
                { id: 'phases', label: 'Phases' },
                { id: 'victory', label: 'Victory/Defeat' },
                { id: 'sfx', label: 'Sound Effects' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded px-4 py-2 font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="assets-folder" className="mb-2 block font-medium text-gray-700">
                    Assets Folder
                  </label>
                  <input
                    id="assets-folder"
                    type="text"
                    value={config.assets || ''}
                    onChange={(e) => updateConfig('assets', e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="mock-image-url" className="mb-2 block font-medium text-gray-700">
                    Mock Image URL (optional)
                  </label>
                  <input
                    id="mock-image-url"
                    type="text"
                    value={config.mockImage || ''}
                    onChange={(e) => updateConfig('mockImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-gray-500 text-sm">
                    Used as fallback when actual images are not found
                  </p>
                </div>
              </div>
            )}

            {/* Keybinds Tab */}
            {activeTab === 'keybinds' && (
              <div className="space-y-6">
                {Object.entries(config.keybinds || {}).map(([key, value]) => {
                  const keybindValue = value as string[]
                  return (
                    <div key={key}>
                      <label
                        htmlFor={`keybinds-${key}`}
                        className="mb-2 block font-medium text-gray-700"
                      >
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
            )}

            {/* Phases Tab */}
            {activeTab === 'phases' && (
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
                            <div
                              key={`phase-${phaseIdx}-music-${musIdx}-${mus}`}
                              className="flex gap-2"
                            >
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
            )}

            {/* Victory/Defeat Tab */}
            {activeTab === 'victory' && (
              <div className="space-y-8">
                {(['victory', 'defeat'] as const).map((type) => {
                  const phase = config[type] || { name: '', next: 0, images: [], music: [] }
                  return (
                    <div key={type} className="rounded-lg border border-gray-200 p-6">
                      <h3 className="mb-4 font-bold text-gray-900 text-xl capitalize">{type}</h3>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor={`${type}-name`}
                            className="mb-2 block font-medium text-gray-700"
                          >
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
                          <label
                            htmlFor={`${type}-next`}
                            className="mb-2 block font-medium text-gray-700"
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
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`${type}-images`}
                            className="mb-2 block font-medium text-gray-700"
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
                          <label
                            htmlFor={`${type}-music`}
                            className="mb-2 block font-medium text-gray-700"
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
            )}

            {/* SFX Tab */}
            {activeTab === 'sfx' && (
              <div className="space-y-4">
                {config.sfx?.map((sfx, idx) => (
                  <div key={`sfx-${idx}-${sfx.file}`} className="flex items-center gap-2">
                    <label htmlFor={`sfx-${idx}`} className="w-20 font-medium text-gray-700">
                      SFX {idx + 1}
                    </label>
                    <input
                      id={`sfx-${idx}`}
                      type="text"
                      value={sfx.file || ''}
                      onChange={(e) =>
                        updateArrayItem('sfx', idx, { ...sfx, file: e.target.value })
                      }
                      placeholder="sfx.mp3"
                      className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('sfx', idx)}
                      className="rounded bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('sfx', { file: '' })}
                  className="rounded bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
                >
                  + Add Sound Effect
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfigBuilder
