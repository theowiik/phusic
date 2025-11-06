'use client'

import { useEffect, useState } from 'react'
import type { Phase } from '../../types'

interface PhaseDisplayProps {
  currentPhase: Phase
}

export const PhaseDisplay = ({ currentPhase }: PhaseDisplayProps) => {
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}`)
    }

    updateTime()
    // Update every second to catch minute changes immediately
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex animate-fade-in flex-col items-center">
      <h1
        className="font-playful text-4xl text-white tracking-wide transition-all duration-300 hover:scale-105"
        style={{
          textShadow:
            '-1px -1px 0 rgba(0, 0, 0, 0.95), 1px -1px 0 rgba(0, 0, 0, 0.95), -1px 1px 0 rgba(0, 0, 0, 0.95), 1px 1px 0 rgba(0, 0, 0, 0.95), 0 0 8px rgba(0, 0, 0, 0.8), 0 0 12px rgba(0, 0, 0, 0.6), 0 0 4px rgba(255, 255, 255, 0.4), 0 0 8px rgba(200, 220, 255, 0.15)',
        }}
      >
        {currentPhase.name}
      </h1>
      <div
        className="mt-1.5 font-playful text-base text-white opacity-50 transition-opacity duration-300"
        style={{
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.8), 0 0 4px rgba(0, 0, 0, 0.6)',
        }}
      >
        {currentTime}
      </div>
    </div>
  )
}
