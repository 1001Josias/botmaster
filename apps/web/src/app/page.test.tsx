import { expect, describe, it, vi } from 'vitest'
import { redirect } from 'next/navigation'

import Home from './page'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('Home Page', () => {
  it('should redirect to /dashboard', () => {
    Home()
    expect(redirect).toHaveBeenCalledWith('/dashboard')
  })
})
