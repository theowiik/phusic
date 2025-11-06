'use client'

import Link from 'next/link'

const AVAILABLE_GAMES = [
  { name: 'chess', displayName: 'Chess' },
  { name: 'eldritch_horror', displayName: 'Eldritch Horror' },
]

export function GamePicker() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="text-center">
        <h1 className="mb-16 font-bold text-6xl text-white tracking-tight drop-shadow-lg">
          Select a Game
        </h1>
        <div className="flex flex-col gap-4">
          {AVAILABLE_GAMES.map((game) => (
            <Link
              key={game.name}
              href={`/game/${game.name}`}
              className="rounded-xl bg-white px-12 py-5 font-semibold text-2xl text-gray-900 shadow-lg transition-all hover:scale-105 hover:bg-gray-50 hover:shadow-xl active:scale-100"
            >
              {game.displayName}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
