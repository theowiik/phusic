import { render } from '@testing-library/react'
import { describe, it } from 'vitest'
import GamePage from '../app/page'

describe('GamePage', () => {
  it('renders loading state initially', () => {
    render(<GamePage />)
  })
})
