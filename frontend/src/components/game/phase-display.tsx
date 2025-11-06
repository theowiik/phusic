import type { Phase } from '../../types'

interface PhaseDisplayProps {
  currentPhase: Phase
}

export const PhaseDisplay = ({ currentPhase }: PhaseDisplayProps) => {
  return (
    <div>
      <h1 className="font-light text-4xl tracking-wide text-white phase-text-contrast">
        {currentPhase.name}
      </h1>
    </div>
  )
}
