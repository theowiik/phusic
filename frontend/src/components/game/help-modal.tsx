'use client'

import type { Config, HelpItem } from '../../types'
import { formatKeys } from '../../utils/keybinds'

interface HelpModalProps {
  showHelp: boolean
  config: Config
  setShowHelp: (show: boolean) => void
}

const getHelpText = (config: Config): HelpItem[] => {
  if (!config || !config.keybinds) return []

  const { keybinds } = config
  const help: HelpItem[] = []

  if (keybinds.nextPhase) {
    help.push({ label: 'Advance to next phase', keys: formatKeys(keybinds.nextPhase) })
  }

  // Phases with keybinds
  if (config.phases) {
    config.phases.forEach((phase) => {
      if (phase.keybind && phase.keybind.length > 0) {
        help.push({ label: `Jump to ${phase.name}`, keys: formatKeys(phase.keybind) })
      }
    })
  }

  // SFX with keybinds
  if (config.sfx) {
    config.sfx.forEach((sfx, index) => {
      if (sfx.keybind && sfx.keybind.length > 0) {
        help.push({ label: `SFX ${index + 1}`, keys: formatKeys(sfx.keybind) })
      }
    })
  }

  if (keybinds.mute) {
    help.push({ label: 'Toggle mute', keys: formatKeys(keybinds.mute) })
  }
  if (keybinds.help) {
    help.push({ label: 'Toggle this help', keys: formatKeys(keybinds.help) })
  }

  return help
}

export const HelpModal = ({ showHelp, config, setShowHelp }: HelpModalProps) => {
  if (!showHelp) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowHelp(false)
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || (e.key === 'Enter' && e.target === e.currentTarget)) {
          setShowHelp(false)
        }
      }}
    >
      <div className="w-full max-w-2xl rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8 flex items-center justify-between">
          <h2 id="help-modal-title" className="font-bold text-3xl text-gray-900">
            Keyboard Shortcuts
          </h2>
          <button
            type="button"
            onClick={() => setShowHelp(false)}
            aria-label="Close"
            className="rounded-lg p-2 text-2xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          {getHelpText(config).map((item) => (
            <div
              key={`${item.keys}-${item.label}`}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-5 py-3 transition-colors hover:bg-gray-100"
            >
              <span className="font-medium text-gray-900">{item.label}</span>
              <div className="flex gap-2">
                {item.keys.split('/').map((key) => (
                  <kbd
                    key={key}
                    className="rounded-md bg-gray-200 px-3 py-1.5 font-mono font-semibold text-gray-800 text-sm shadow-sm"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Press{' '}
            <kbd className="rounded bg-gray-200 px-2 py-1 font-mono font-semibold text-gray-800 text-xs">
              ESC
            </kbd>{' '}
            to close
          </p>
        </div>
      </div>
    </div>
  )
}
