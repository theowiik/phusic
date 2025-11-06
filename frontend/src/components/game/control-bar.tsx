'use client'

import Link from 'next/link'

interface ControlBarProps {
  muted: boolean
  setMuted: (muted: boolean) => void
  setShowHelp: (show: boolean) => void
}

export const ControlBar = ({ muted, setMuted, setShowHelp }: ControlBarProps) => {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => setMuted(!muted)}
        title={muted ? 'Unmute' : 'Mute'}
        className="flex items-center justify-center gap-2 rounded-xl bg-white/95 px-6 py-3 font-medium text-gray-900 text-lg shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl active:scale-95"
      >
        <span className="text-2xl leading-none">{muted ? '🔇' : '🔊'}</span>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setShowHelp(true)
        }}
        title="Show keyboard shortcuts"
        className="flex-1 rounded-xl bg-white/95 px-6 py-3 font-medium text-gray-900 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl active:scale-[0.98]"
      >
        Shortcuts
      </button>

      <Link
        href="/config"
        className="flex-1 rounded-xl bg-white/95 px-6 py-3 text-center font-medium text-gray-900 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl active:scale-[0.98]"
      >
        Config
      </Link>
    </div>
  )
}
