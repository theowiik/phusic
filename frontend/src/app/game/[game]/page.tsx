'use client'

import { Suspense, use } from 'react'
import { GameContent } from '../../game-content'

export default function GamePage({ params }: { params: Promise<{ game: string }> }) {
  const { game } = use(params)

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
          <div className="font-medium text-2xl text-white/80">Loading...</div>
        </div>
      }
    >
      <GameContent gameName={game} />
    </Suspense>
  )
}
