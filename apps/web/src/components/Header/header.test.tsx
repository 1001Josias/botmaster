import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { Header } from './index'

describe('Header Component', () => {
  test('should render without crashing', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  test('Should render header with title', () => {
    render(<Header />)
    const titleElement = screen.getByText('Organização 1')
    expect(titleElement).toBeInTheDocument()
  })

  test('should render children', () => {
    render(<Header />)
    const childElement = screen.getByRole('button', { name: /toggle theme/i })
    expect(childElement).toBeInTheDocument()
  })
})
