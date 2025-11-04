'use client'

import Link from 'next/link'

interface ControlBarProps {
  muted: boolean
  setMuted: (muted: boolean) => void
  setShowHelp: (show: boolean) => void
}

export const ControlBar = ({ muted, setMuted, setShowHelp }: ControlBarProps) => {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => setMuted(!muted)}
        title={muted ? 'Unmute' : 'Mute'}
        className="flex-1 bg-white py-3 text-black text-xl hover:bg-white/90"
      >
        {muted ? '🔇' : '🔊'}
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setShowHelp(true)
        }}
        title="Show keyboard shortcuts"
        className="flex-1 bg-white py-3 font-medium text-black text-sm hover:bg-white/90"
      >
        Shortcuts
      </button>

      <Link
        href="/config"
        className="flex-1 bg-white py-3 text-center font-medium text-black text-sm hover:bg-white/90"
      >
        Config
      </Link>
    </div>
  )
}
