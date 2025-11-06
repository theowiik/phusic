'use client'

import Link from 'next/link'
import { Gamepad2 } from 'lucide-react'

const AVAILABLE_GAMES = [
  { name: 'chess', displayName: 'Chess' },
  { name: 'eldritch_horror', displayName: 'Eldritch Horror' },
]

export function GamePicker() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <div className="text-center">
        <div className="mb-12 flex items-center justify-center gap-3">
          <Gamepad2 size={32} className="text-[#e5e5e5] opacity-60" />
          <h1 className="font-light text-3xl tracking-wide text-[#e5e5e5] opacity-80">
            Select a Game
          </h1>
        </div>
        <div className="flex flex-col gap-3">
          {AVAILABLE_GAMES.map((game) => (
            <Link
              key={game.name}
              href={`/game/${game.name}`}
              className="text-[#e5e5e5] opacity-50 hover:opacity-80 transition-opacity text-lg font-light py-2"
            >
              {game.displayName}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
