'use client'

import { Suspense, use } from 'react'
import { GameContent } from '../../game-content'

export default function GamePage({ params }: { params: Promise<{ game: string }> }) {
  const { game } = use(params)

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
          <div className="font-light text-[#e5e5e5] text-sm opacity-50">Loading...</div>
        </div>
      }
    >
      <GameContent gameName={game} />
    </Suspense>
  )
}
