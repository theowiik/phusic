'use client'

import { HelpCircle, Settings, Volume2, VolumeX } from 'lucide-react'
import Link from 'next/link'

interface ControlBarProps {
  muted: boolean
  setMuted: (muted: boolean) => void
  setShowHelp: (show: boolean) => void
}

export const ControlBar = ({ muted, setMuted, setShowHelp }: ControlBarProps) => {
  const buttonClasses =
    'text-white/60 hover:text-white/90 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer bg-transparent border-0 p-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] hover:drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => setMuted(!muted)}
        title={muted ? 'Unmute' : 'Mute'}
        className={buttonClasses}
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
        className={buttonClasses}
      >
        <HelpCircle size={18} />
      </button>

      <Link href="/config" title="Configuration" className={buttonClasses}>
        <Settings size={18} />
      </Link>
    </div>
  )
}
