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
  if (keybinds.victory) {
    help.push({ label: 'Jump to victory phase', keys: formatKeys(keybinds.victory) })
  }
  if (keybinds.defeat) {
    help.push({ label: 'Jump to defeat phase', keys: formatKeys(keybinds.defeat) })
  }
  if (keybinds.sfx) {
    help.push({ label: 'Play sound effects', keys: formatKeys(keybinds.sfx) })
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
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
      <div className="w-full max-w-2xl bg-zinc-900 p-8">
        <div className="mb-6 flex justify-between">
          <h2 className="text-3xl text-white">KEYBOARD SHORTCUTS</h2>
          <button
            type="button"
            onClick={() => setShowHelp(false)}
            aria-label="Close"
            className="text-2xl text-white"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          {getHelpText(config).map((item) => (
            <div
              key={`${item.keys}-${item.label}`}
              className="flex justify-between bg-white/5 px-4 py-3"
            >
              <span className="text-white">{item.label}</span>
              <div className="flex gap-2">
                {item.keys.split('/').map((key) => (
                  <kbd key={key} className="bg-white/10 px-3 py-1 font-mono text-sm text-white">
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-white/60">
            Press <kbd className="bg-white/10 px-2 py-1 font-mono text-white text-xs">ESC</kbd> to
            close
          </p>
        </div>
      </div>
    </div>
  )
}
