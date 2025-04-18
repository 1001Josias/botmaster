import { vi, expect, test, suite } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import Button from '@/components/Button'

suite('Button Component Tests', () => {
  test('renders button with default variant', () => {
    render(<Button>Button 1</Button>)
    const buttonElement = screen.getByRole('button')
    expect(buttonElement.className).contain('bg-primary')
  })

  test('must be clicked once', () => {
    const text = 'Click me'
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>{text}</Button>)
    const buttonElement = screen.getByText(text)
    fireEvent.click(buttonElement)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('should be rendered Slot when a Child is true', () => {
    render(<Button asChild>Nextjs</Button>)
    const element = document.querySelector('button')
    expect(element).toBeNull()
  })

  test('should be rendered the button when asChild is false', () => {
    const { container } = render(<Button>Shadcn</Button>)
    const buttonElement = container.querySelector('button')
    expect(buttonElement).toBeDefined()
  })

  test('should be rendered the button with the text "Boilerplate"', () => {
    const text = 'Boilerplate'
    const { container } = render(<Button>{text}</Button>)
    const buttonElement = container.querySelector('button')
    expect(buttonElement?.innerHTML).toBe(text)
  })
})
