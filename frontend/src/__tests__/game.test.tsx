import { render } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
import GamePage from '../app/page'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: () => {
    const get = (key: string) => {
      if (key === 'game') return null
      return null
    }
    return { get }
  },
}))

describe('GamePage', () => {
  it('renders loading state initially', () => {
    render(<GamePage />)
  })
})
