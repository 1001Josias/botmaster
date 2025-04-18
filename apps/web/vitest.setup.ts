import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

beforeEach(() => {
  const mockMatchMedia = vi.fn().mockImplementation((query: string) => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
  })
  window.matchMedia = mockMatchMedia
})

afterEach(() => {
  cleanup()
})
