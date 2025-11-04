import { Suspense } from 'react'
import { GameContent } from './game-content'

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-4xl text-white">LOADING</div>
        </div>
      }
    >
      <GameContent />
    </Suspense>
  )
}
