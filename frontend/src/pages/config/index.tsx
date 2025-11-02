import { useEffect, useState } from 'react'
import { GeneralTab } from '../../components/config/general-tab'
import { KeybindsTab } from '../../components/config/keybinds-tab'
import { PhasesTab } from '../../components/config/phases-tab'
import { SFXTab } from '../../components/config/sfx-tab'
import { VictoryDefeatTab } from '../../components/config/victory-defeat-tab'
import { DEFAULT_CONFIG_GAME, getConfigPath } from '../../constants/config'
import { useConfigBuilder } from '../../hooks/use-config-builder'
import { loadConfig } from '../../services/config-service'
import type { Config } from '../../types'

const DEFAULT_CONFIG: Config = {
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
}

function ConfigBuilderPage() {
  const [initialConfig, setInitialConfig] = useState<Config>(DEFAULT_CONFIG)
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<string>('general')

  const {
    config,
    setConfig,
    saving,
    saveMessage,
    updateConfig,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
    handleSave,
    handleCopyJSON,
  } = useConfigBuilder(initialConfig)

  // Load config on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const game = params.get('game')
    const configPath = getConfigPath(game || DEFAULT_CONFIG_GAME)

    loadConfig(configPath)
      .then((data) => {
        setInitialConfig(data)
        setConfig(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load config:', err)
        setLoading(false)
      })
  }, [setConfig])

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
            {activeTab === 'general' && <GeneralTab config={config} updateConfig={updateConfig} />}
            {activeTab === 'keybinds' && (
              <KeybindsTab
                config={config}
                updateConfig={updateConfig}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
              />
            )}
            {activeTab === 'phases' && (
              <PhasesTab
                config={config}
                updateArrayItem={updateArrayItem}
                addArrayItem={addArrayItem}
                updateConfig={updateConfig}
              />
            )}
            {activeTab === 'victory' && (
              <VictoryDefeatTab config={config} updateConfig={updateConfig} />
            )}
            {activeTab === 'sfx' && (
              <SFXTab
                config={config}
                updateArrayItem={updateArrayItem}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfigBuilderPage
