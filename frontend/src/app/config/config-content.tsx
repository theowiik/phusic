'use client'

import { ArrowLeft, Copy, Download } from 'lucide-react'
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
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="font-light text-[#e5e5e5] text-sm opacity-50">Loading config...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl p-6">
        {/* Header */}
        <div className="mb-4 rounded-xl border border-white/8 bg-[rgba(20,20,20,0.3)] p-6 backdrop-blur-sm transition-all hover:border-white/12 hover:bg-[rgba(20,20,20,0.4)]">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="mb-1 font-light text-[#e5e5e5] text-lg opacity-90">Config Builder</h1>
              <p className="font-light text-[#e5e5e5] text-sm opacity-60">
                Edit your game configuration
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyJSON}
                className="flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-light text-sm text-white/60 transition-all hover:text-white/90"
              >
                <Copy size={16} />
                Copy JSON
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-light text-sm text-white/60 transition-all hover:text-white/90 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Download size={16} />
                {saving ? 'Saving...' : 'Download'}
              </button>
              <Link
                href="/"
                className="flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-light text-sm text-white/60 transition-all hover:text-white/90"
              >
                <ArrowLeft size={16} />
                Back
              </Link>
            </div>
          </div>
          {saveMessage && (
            <div className="rounded-xl border border-white/8 bg-[rgba(20,20,20,0.3)] px-4 py-3 font-light text-[#e5e5e5] text-sm opacity-70 backdrop-blur-sm transition-all hover:border-white/12 hover:bg-[rgba(20,20,20,0.4)]">
              {saveMessage}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="rounded-xl border border-white/8 bg-[rgba(20,20,20,0.3)] backdrop-blur-sm transition-all hover:border-white/12 hover:bg-[rgba(20,20,20,0.4)]">
          <div className="border-[rgba(255,255,255,0.1)] border-b">
            <nav className="flex gap-2 p-3">
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
                  className={`rounded px-4 py-2 font-light text-sm transition-opacity ${
                    activeTab === tab.id
                      ? 'text-[#e5e5e5] opacity-90'
                      : 'text-[#e5e5e5] opacity-50 hover:opacity-70'
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
