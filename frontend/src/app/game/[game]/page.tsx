'use client'

import { use } from 'react'
import { Suspense } from 'react'
import { GameContent } from '../../game-content'

export default function GamePage({ params }: { params: Promise<{ game: string }> }) {
  const { game } = use(params)

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-4xl text-white">LOADING</div>
        </div>
      }
    >
      <GameContent gameName={game} />
    </Suspense>
  )
}

