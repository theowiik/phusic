'use client'

import Link from 'next/link'

const AVAILABLE_GAMES = [
  { name: 'chess', displayName: 'Chess' },
  { name: 'eldritch_horror', displayName: 'Eldritch Horror' },
]

export function GamePicker() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="mb-12 text-6xl font-bold text-white">Select a Game</h1>
        <div className="flex flex-col gap-4">
          {AVAILABLE_GAMES.map((game) => (
            <Link
              key={game.name}
              href={`/game/${game.name}`}
              className="rounded-lg bg-white px-8 py-4 text-2xl font-semibold text-black transition hover:bg-gray-200"
            >
              {game.displayName}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

