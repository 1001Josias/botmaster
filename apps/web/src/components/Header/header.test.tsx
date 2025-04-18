import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import Header from './index'
import { config } from './header.config'

describe('Header Component', () => {
  test('should render without crashing', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  test('Should render header with title', () => {
    render(<Header />)
    const titleElement = screen.getByText(config.title)
    expect(titleElement).toBeInTheDocument()
  })

  test('should render children', () => {
    render(
      <Header>
        <div data-testid="nav-bar">Child Element</div>
      </Header>
    )
    const childElement = screen.getByTestId('nav-bar')
    expect(childElement).toBeInTheDocument()
  })
})
