import type { Phase } from '../../types'

interface PhaseDisplayProps {
  currentPhase: Phase
  currentImageFilename: string
}

export const PhaseDisplay = ({ currentPhase, currentImageFilename }: PhaseDisplayProps) => {
  return (
    <>
      {/* Top Info Bar */}
      <div className="flex justify-end">
        {currentImageFilename && (
          <div className="bg-black/50 px-3 py-2">
            <div className="font-mono text-white/60 text-xs">{currentImageFilename}</div>
          </div>
        )}
      </div>

      {/* Center - Phase Name */}
      <div className="flex flex-1 items-center justify-center">
        <h1 className="text-6xl text-white" style={{ textShadow: '2px 2px 4px black' }}>
          {currentPhase.name.toUpperCase()}
        </h1>
      </div>
    </>
  )
}
