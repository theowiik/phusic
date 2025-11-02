import { render } from '@testing-library/react'
import { describe, it } from 'vitest'
import App from './app'

describe('App', () => {
  it('renders hello message', () => {
    render(<App />)
  })
})
