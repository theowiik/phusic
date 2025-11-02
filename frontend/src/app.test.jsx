import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './app'

describe('App', () => {
  it('renders hello message', () => {
    render(<App />)
    expect(screen.getByText(/Hello Vite \+ React!/)).toBeInTheDocument()
  })
})
