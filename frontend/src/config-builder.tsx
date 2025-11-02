import { useState, useEffect } from 'react'
import type { Config } from './types'

// Get config path from URL params or use default
const getConfigPath = (): string => {
  const params = new URLSearchParams(window.location.search)
  const game = params.get('game') || 'eldritch_horror'
  return `/assets/${game}/config.json`
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
      <div>
        <div>Loading config...</div>
      </div>
    )
  }

  return (
    <div>
      <div>
        {/* Header */}
        <div>
          <div>
            <div>
              <h1>Config Builder</h1>
              <p>Edit your game configuration</p>
            </div>
            <div>
              <button type="button" onClick={handleCopyJSON}>
                Copy JSON
              </button>
              <button type="button" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Download Config'}
              </button>
              <a href="/">Back to Game</a>
            </div>
          </div>
          {saveMessage && <div>{saveMessage}</div>}
        </div>

        {/* Tabs */}
        <div>
          <div>
            <nav>
              {[
                { id: 'general', label: 'General' },
                { id: 'keybinds', label: 'Keybinds' },
                { id: 'phases', label: 'Phases' },
                { id: 'victory', label: 'Victory/Defeat' },
                { id: 'sfx', label: 'Sound Effects' },
              ].map((tab) => (
                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div>
            {/* General Tab */}
            {activeTab === 'general' && (
              <div>
                <div>
                  <label htmlFor="assets-folder">Assets Folder</label>
                  <input
                    id="assets-folder"
                    type="text"
                    value={config.assets || ''}
                    onChange={(e) => updateConfig('assets', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="mock-image-url">Mock Image URL (optional)</label>
                  <input
                    id="mock-image-url"
                    type="text"
                    value={config.mockImage || ''}
                    onChange={(e) => updateConfig('mockImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p>Used as fallback when actual images are not found</p>
                </div>
              </div>
            )}

            {/* Keybinds Tab */}
            {activeTab === 'keybinds' && (
              <div>
                {Object.entries(config.keybinds || {}).map(([key, value]) => {
                  const keybindValue = value as string[]
                  return (
                    <div key={key}>
                      <label htmlFor={`keybinds-${key}`}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <div>
                        {keybindValue.map((kb, idx) => (
                          <div key={`${key}-${idx}-${kb}`}>
                            <input
                              type="text"
                              value={kb}
                              onChange={(e) => {
                                const newKb = [...keybindValue]
                                newKb[idx] = e.target.value
                                updateConfig(`keybinds.${key}`, newKb)
                              }}
                              placeholder="key"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem(`keybinds.${key}`, idx)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem(`keybinds.${key}`, '')}>
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
              <div>
                {config.phases?.map((phase, phaseIdx) => (
                  <div key={`phase-${phaseIdx}-${phase.name}`}>
                    <div>
                      <h3>Phase {phaseIdx + 1}</h3>
                      <button
                        type="button"
                        onClick={() => {
                          const newPhases = config.phases.filter((_, i) => i !== phaseIdx)
                          updateConfig('phases', newPhases)
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <div>
                      <div>
                        <label htmlFor={`phase-${phaseIdx}-name`}>Name</label>
                        <input
                          id={`phase-${phaseIdx}-name`}
                          type="text"
                          value={phase.name || ''}
                          onChange={(e) =>
                            updateArrayItem('phases', phaseIdx, { ...phase, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor={`phase-${phaseIdx}-next`}>Next Phase Index</label>
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
                        />
                      </div>
                      <div>
                        <label htmlFor={`phase-${phaseIdx}-images`}>Images</label>
                        <div>
                          {phase.images?.map((img, imgIdx) => (
                            <div key={`phase-${phaseIdx}-img-${imgIdx}-${img}`}>
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
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = [...(phase.images || []), '']
                              updateArrayItem('phases', phaseIdx, { ...phase, images: newImages })
                            }}
                          >
                            + Add Image
                          </button>
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`phase-${phaseIdx}-music`}>Music</label>
                        <div>
                          {phase.music?.map((mus, musIdx) => (
                            <div key={`phase-${phaseIdx}-music-${musIdx}-${mus}`}>
                              <input
                                type="text"
                                value={mus}
                                onChange={(e) => {
                                  const newMusic = [...phase.music]
                                  newMusic[musIdx] = e.target.value
                                  updateArrayItem('phases', phaseIdx, { ...phase, music: newMusic })
                                }}
                                placeholder="music.mp3"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newMusic = phase.music.filter((_, i) => i !== musIdx)
                                  updateArrayItem('phases', phaseIdx, { ...phase, music: newMusic })
                                }}
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
                >
                  + Add Phase
                </button>
              </div>
            )}

            {/* Victory/Defeat Tab */}
            {activeTab === 'victory' && (
              <div>
                {(['victory', 'defeat'] as const).map((type) => {
                  const phase = config[type] || { name: '', next: 0, images: [], music: [] }
                  return (
                    <div key={type}>
                      <h3>{type}</h3>
                      <div>
                        <div>
                          <label htmlFor={`${type}-name`}>Name</label>
                          <input
                            id={`${type}-name`}
                            type="text"
                            value={phase.name || ''}
                            onChange={(e) => updateConfig(type, { ...phase, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label htmlFor={`${type}-next`}>Next Phase Index</label>
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
                          />
                        </div>
                        <div>
                          <label htmlFor={`${type}-images`}>Images</label>
                          <div>
                            {phase.images?.map((img: string, imgIdx: number) => (
                              <div key={`${type}-img-${imgIdx}-${img}`}>
                                <input
                                  type="text"
                                  value={img}
                                  onChange={(e) => {
                                    const newImages = [...phase.images]
                                    newImages[imgIdx] = e.target.value
                                    updateConfig(type, { ...phase, images: newImages })
                                  }}
                                  placeholder="image.jpg"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newImages = phase.images.filter(
                                      (_: string, i: number) => i !== imgIdx
                                    )
                                    updateConfig(type, { ...phase, images: newImages })
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = [...(phase.images || []), '']
                                updateConfig(type, { ...phase, images: newImages })
                              }}
                            >
                              + Add Image
                            </button>
                          </div>
                        </div>
                        <div>
                          <label htmlFor={`${type}-music`}>Music</label>
                          <div>
                            {phase.music?.map((mus: string, musIdx: number) => (
                              <div key={`${type}-music-${musIdx}-${mus}`}>
                                <input
                                  type="text"
                                  value={mus}
                                  onChange={(e) => {
                                    const newMusic = [...phase.music]
                                    newMusic[musIdx] = e.target.value
                                    updateConfig(type, { ...phase, music: newMusic })
                                  }}
                                  placeholder="music.mp3"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newMusic = phase.music.filter(
                                      (_: string, i: number) => i !== musIdx
                                    )
                                    updateConfig(type, { ...phase, music: newMusic })
                                  }}
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
              <div>
                {config.sfx?.map((sfx, idx) => (
                  <div key={`sfx-${idx}-${sfx.file}`}>
                    <label htmlFor={`sfx-${idx}`}>SFX {idx + 1}</label>
                    <input
                      id={`sfx-${idx}`}
                      type="text"
                      value={sfx.file || ''}
                      onChange={(e) =>
                        updateArrayItem('sfx', idx, { ...sfx, file: e.target.value })
                      }
                      placeholder="sfx.mp3"
                    />
                    <button type="button" onClick={() => removeArrayItem('sfx', idx)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('sfx', { file: '' })}>
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
