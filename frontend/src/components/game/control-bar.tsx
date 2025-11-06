'use client'

import Link from 'next/link'
import { Volume2, VolumeX, HelpCircle, Settings } from 'lucide-react'

interface ControlBarProps {
  muted: boolean
  setMuted: (muted: boolean) => void
  setShowHelp: (show: boolean) => void
}

export const ControlBar = ({ muted, setMuted, setShowHelp }: ControlBarProps) => {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setMuted(!muted)}
        title={muted ? 'Unmute' : 'Mute'}
        className="btn-clear"
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setShowHelp(true)
        }}
        title="Show keyboard shortcuts"
        className="btn-clear"
      >
        <HelpCircle size={18} />
      </button>

      <Link
        href="/config"
        title="Configuration"
        className="btn-clear"
      >
        <Settings size={18} />
      </Link>
    </div>
  )
}
