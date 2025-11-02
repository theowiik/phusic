import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it } from 'vitest'
import GamePage from '../pages/game'

describe('GamePage', () => {
  it('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <GamePage />
      </BrowserRouter>
    )
  })
})
