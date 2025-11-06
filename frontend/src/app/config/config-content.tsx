'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GeneralTab } from '../../components/config/general-tab'
import { KeybindsTab } from '../../components/config/keybinds-tab'
import { PhasesTab } from '../../components/config/phases-tab'
import { SFXTab } from '../../components/config/sfx-tab'
import { DEFAULT_CONFIG_GAME, getConfigPath } from '../../constants/config'
import { useConfigBuilder } from '../../hooks/use-config-builder'
import { loadConfig } from '../../services/config-service'
import type { Config } from '../../types'

const DEFAULT_CONFIG: Config = {
  assets: 'eldritch_horror',
  mockImage: '',
  keybinds: {
    mute: ['m', 'M'],
    help: ['h', 'H'],
  },
  phases: [],
  sfx: [],
}

export function ConfigContent() {
  const searchParams = useSearchParams()
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
    const game = searchParams.get('game')
    const configPath = getConfigPath(game || DEFAULT_CONFIG_GAME)

    loadConfig(configPath)
      .then((data) => {
        // Merge defaults only for mute and help if they're missing
        const mergedConfig: Config = {
          ...data,
          keybinds: {
            ...data.keybinds,
            // Only apply defaults if missing
            mute: data.keybinds?.mute || ['m', 'M'],
            help: data.keybinds?.help || ['h', 'H'],
            // nextPhase should only come from config, no default
            nextPhase: data.keybinds?.nextPhase,
          },
        }
        setInitialConfig(mergedConfig)
        setConfig(mergedConfig)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load config:', err)
        setLoading(false)
      })
  }, [searchParams, setConfig])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="font-medium text-gray-600 text-lg">Loading config...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-6xl p-8">
        {/* Header */}
        <div className="mb-6 rounded-2xl bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="mb-2 font-bold text-3xl text-gray-900">Config Builder</h1>
              <p className="text-gray-600">Edit your game configuration</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCopyJSON}
                className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow active:scale-95"
              >
                Copy JSON
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Download Config'}
              </button>
              <Link
                href="/"
                className="rounded-xl bg-gray-600 px-5 py-2.5 font-medium text-white shadow-lg transition-all hover:bg-gray-700 hover:shadow-xl active:scale-95"
              >
                Back to Game
              </Link>
            </div>
          </div>
          {saveMessage && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800 shadow-sm">
              {saveMessage}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="rounded-2xl bg-white shadow-lg">
          <div className="border-gray-200 border-b">
            <nav className="flex gap-2 p-4">
              {[
                { id: 'general', label: 'General' },
                { id: 'keybinds', label: 'Keybinds' },
                { id: 'phases', label: 'Phases' },
                { id: 'sfx', label: 'Sound Effects' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl px-5 py-2.5 font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
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
