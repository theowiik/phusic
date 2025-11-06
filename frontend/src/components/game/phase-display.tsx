import type { Phase } from '../../types'

interface PhaseDisplayProps {
  currentPhase: Phase
}

export const PhaseDisplay = ({ currentPhase }: PhaseDisplayProps) => {
  return (
    <div className="text-center">
      <h1
        className="font-bold text-7xl text-white tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
        style={{
          textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        {currentPhase.name.toUpperCase()}
      </h1>
    </div>
  )
}
