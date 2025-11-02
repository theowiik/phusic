import { useState, useEffect } from 'react'

// Get config path from URL params or use default
const getConfigPath = () => {
  const params = new URLSearchParams(window.location.search)
  const game = params.get('game') || 'eldritch_horror'
  return `/assets/${game}/config.json`
}

const getSavePath = () => {
  const params = new URLSearchParams(window.location.search)
  const game = params.get('game') || 'eldritch_horror'
  return `/assets/${game}/config.json`
}

function ConfigBuilder() {
  const [config, setConfig] = useState({
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [activeTab, setActiveTab] = useState('general')

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

  const updateConfig = (path, value) => {
    setConfig((prev) => {
      const newConfig = { ...prev }
      const keys = path.split('.')
      let current = newConfig
      for (let i = 0; i < keys.length - 1; i++) {
        if (Array.isArray(current[keys[i]])) {
          current[keys[i]] = [...current[keys[i]]]
        } else {
          current[keys[i]] = { ...current[keys[i]] }
        }
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      return newConfig
    })
  }

  const updateArrayItem = (path, index, value) => {
    setConfig((prev) => {
      const newConfig = { ...prev }
      const keys = path.split('.')
      let current = newConfig
      for (let i = 0; i < keys.length - 1; i++) {
        if (Array.isArray(current[keys[i]])) {
          current[keys[i]] = [...current[keys[i]]]
        } else {
          current[keys[i]] = { ...current[keys[i]] }
        }
        current = current[keys[i]]
      }
      const arr = [...current[keys[keys.length - 1]]]
      arr[index] = value
      current[keys[keys.length - 1]] = arr
      return newConfig
    })
  }

  const addArrayItem = (path, defaultValue) => {
    setConfig((prev) => {
      const newConfig = { ...prev }
      const keys = path.split('.')
      let current = newConfig
      for (let i = 0; i < keys.length - 1; i++) {
        if (Array.isArray(current[keys[i]])) {
          current[keys[i]] = [...current[keys[i]]]
        } else {
          current[keys[i]] = { ...current[keys[i]] }
        }
        current = current[keys[i]]
      }
      const arr = [...current[keys[keys.length - 1]]]
      arr.push(defaultValue)
      current[keys[keys.length - 1]] = arr
      return newConfig
    })
  }

  const removeArrayItem = (path, index) => {
    setConfig((prev) => {
      const newConfig = { ...prev }
      const keys = path.split('.')
      let current = newConfig
      for (let i = 0; i < keys.length - 1; i++) {
        if (Array.isArray(current[keys[i]])) {
          current[keys[i]] = [...current[keys[i]]]
        } else {
          current[keys[i]] = { ...current[keys[i]] }
        }
        current = current[keys[i]]
      }
      const arr = [...current[keys[keys.length - 1]]]
      arr.splice(index, 1)
      current[keys[keys.length - 1]] = arr
      return newConfig
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveMessage('')
    try {
      const savePath = getSavePath()
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
      setSaveMessage('Error saving config: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    setSaveMessage('JSON copied to clipboard!')
    setTimeout(() => setSaveMessage(''), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading config...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Config Builder</h1>
              <p className="text-gray-600 mt-1">Edit your game configuration</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCopyJSON}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
              >
                Copy JSON
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
              >
                {saving ? 'Saving...' : 'Download Config'}
              </button>
              <a
                href="/"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center"
              >
                Back to Game
              </a>
            </div>
          </div>
          {saveMessage && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">{saveMessage}</div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'general', label: 'General' },
                { id: 'keybinds', label: 'Keybinds' },
                { id: 'phases', label: 'Phases' },
                { id: 'victory', label: 'Victory/Defeat' },
                { id: 'sfx', label: 'Sound Effects' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assets Folder
                  </label>
                  <input
                    type="text"
                    value={config.assets || ''}
                    onChange={(e) => updateConfig('assets', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mock Image URL (optional)
                  </label>
                  <input
                    type="text"
                    value={config.mockImage || ''}
                    onChange={(e) => updateConfig('mockImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Used as fallback when actual images are not found
                  </p>
                </div>
              </div>
            )}

            {/* Keybinds Tab */}
            {activeTab === 'keybinds' && (
              <div className="space-y-6">
                {Object.entries(config.keybinds || {}).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {value.map((kb, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={kb}
                            onChange={(e) => {
                              const newKb = [...value]
                              newKb[idx] = e.target.value
                              updateConfig(`keybinds.${key}`, newKb)
                            }}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="key"
                          />
                          <button
                            onClick={() => removeArrayItem(`keybinds.${key}`, idx)}
                            className="px-2 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayItem(`keybinds.${key}`, '')}
                        className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Phases Tab */}
            {activeTab === 'phases' && (
              <div className="space-y-6">
                {config.phases?.map((phase, phaseIdx) => (
                  <div key={phaseIdx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold">Phase {phaseIdx + 1}</h3>
                      <button
                        onClick={() => {
                          const newPhases = config.phases.filter((_, i) => i !== phaseIdx)
                          updateConfig('phases', newPhases)
                        }}
                        className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          value={phase.name || ''}
                          onChange={(e) =>
                            updateArrayItem('phases', phaseIdx, { ...phase, name: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Next Phase Index
                        </label>
                        <input
                          type="number"
                          value={phase.next ?? ''}
                          onChange={(e) =>
                            updateArrayItem('phases', phaseIdx, {
                              ...phase,
                              next: Number.parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                        <div className="space-y-2">
                          {phase.images?.map((img, imgIdx) => (
                            <div key={imgIdx} className="flex gap-2">
                              <input
                                type="text"
                                value={img}
                                onChange={(e) => {
                                  const newImages = [...phase.images]
                                  newImages[imgIdx] = e.target.value
                                  updateArrayItem('phases', phaseIdx, { ...phase, images: newImages })
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="image.jpg"
                              />
                              <button
                                onClick={() => {
                                  const newImages = phase.images.filter((_, i) => i !== imgIdx)
                                  updateArrayItem('phases', phaseIdx, { ...phase, images: newImages })
                                }}
                                className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const newImages = [...(phase.images || []), '']
                              updateArrayItem('phases', phaseIdx, { ...phase, images: newImages })
                            }}
                            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                          >
                            + Add Image
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Music</label>
                        <div className="space-y-2">
                          {phase.music?.map((mus, musIdx) => (
                            <div key={musIdx} className="flex gap-2">
                              <input
                                type="text"
                                value={mus}
                                onChange={(e) => {
                                  const newMusic = [...phase.music]
                                  newMusic[musIdx] = e.target.value
                                  updateArrayItem('phases', phaseIdx, { ...phase, music: newMusic })
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="music.mp3"
                              />
                              <button
                                onClick={() => {
                                  const newMusic = phase.music.filter((_, i) => i !== musIdx)
                                  updateArrayItem('phases', phaseIdx, { ...phase, music: newMusic })
                                }}
                                className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const newMusic = [...(phase.music || []), '']
                              updateArrayItem('phases', phaseIdx, { ...phase, music: newMusic })
                            }}
                            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                          >
                            + Add Music
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() =>
                    addArrayItem('phases', {
                      name: 'New Phase',
                      next: 0,
                      images: [],
                      music: [],
                    })
                  }
                  className="w-full px-4 py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors font-medium"
                >
                  + Add Phase
                </button>
              </div>
            )}

            {/* Victory/Defeat Tab */}
            {activeTab === 'victory' && (
              <div className="space-y-6">
                {['victory', 'defeat'].map((type) => {
                  const phase = config[type] || {}
                  return (
                    <div key={type} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4 capitalize">{type}</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                          <input
                            type="text"
                            value={phase.name || ''}
                            onChange={(e) => updateConfig(type, { ...phase, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Next Phase Index
                          </label>
                          <input
                            type="number"
                            value={phase.next ?? ''}
                            onChange={(e) =>
                              updateConfig(type, {
                                ...phase,
                                next: Number.parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                          <div className="space-y-2">
                            {phase.images?.map((img, imgIdx) => (
                              <div key={imgIdx} className="flex gap-2">
                                <input
                                  type="text"
                                  value={img}
                                  onChange={(e) => {
                                    const newImages = [...phase.images]
                                    newImages[imgIdx] = e.target.value
                                    updateConfig(type, { ...phase, images: newImages })
                                  }}
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="image.jpg"
                                />
                                <button
                                  onClick={() => {
                                    const newImages = phase.images.filter((_, i) => i !== imgIdx)
                                    updateConfig(type, { ...phase, images: newImages })
                                  }}
                                  className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const newImages = [...(phase.images || []), '']
                                updateConfig(type, { ...phase, images: newImages })
                              }}
                              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                            >
                              + Add Image
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Music</label>
                          <div className="space-y-2">
                            {phase.music?.map((mus, musIdx) => (
                              <div key={musIdx} className="flex gap-2">
                                <input
                                  type="text"
                                  value={mus}
                                  onChange={(e) => {
                                    const newMusic = [...phase.music]
                                    newMusic[musIdx] = e.target.value
                                    updateConfig(type, { ...phase, music: newMusic })
                                  }}
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="music.mp3"
                                />
                                <button
                                  onClick={() => {
                                    const newMusic = phase.music.filter((_, i) => i !== musIdx)
                                    updateConfig(type, { ...phase, music: newMusic })
                                  }}
                                  className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const newMusic = [...(phase.music || []), '']
                                updateConfig(type, { ...phase, music: newMusic })
                              }}
                              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
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
                  <div key={idx} className="flex gap-2">
                    <label className="w-12 text-sm font-medium text-gray-700 flex items-center">
                      SFX {idx + 1}
                    </label>
                    <input
                      type="text"
                      value={sfx.file || ''}
                      onChange={(e) =>
                        updateArrayItem('sfx', idx, { ...sfx, file: e.target.value })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="sfx.mp3"
                    />
                    <button
                      onClick={() => removeArrayItem('sfx', idx)}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('sfx', { file: '' })}
                  className="w-full px-4 py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors font-medium"
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

