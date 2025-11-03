import type { Phase } from '../../types'

interface PhaseDisplayProps {
  currentPhase: Phase
}

export const PhaseDisplay = ({ currentPhase }: PhaseDisplayProps) => {
  return (
    <h1
      className="text-6xl text-white"
      style={{ textShadow: '0 0 10px black, 2px 2px 8px black, -2px -2px 8px black' }}
    >
      {currentPhase.name.toUpperCase()}
    </h1>
  )
}
