'use client'

import Link from 'next/link'

const AVAILABLE_GAMES = [
  { name: 'chess', displayName: 'Chess' },
  { name: 'eldritch_horror', displayName: 'Eldritch Horror' },
]

export function GamePicker() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <div className="space-y-8 text-center">
        <div className="space-y-6">
          {AVAILABLE_GAMES.map((game) => (
            <Link
              key={game.name}
              href={`/game/${game.name}`}
              className="block text-[#e5e5e5] text-sm opacity-40 transition-opacity duration-200 hover:opacity-60"
            >
              {game.displayName}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
