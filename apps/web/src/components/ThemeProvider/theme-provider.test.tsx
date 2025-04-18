import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ThemeProvider } from '@/components/ThemeProvider'

describe('ThemeProvider component', () => {
  it('should render children with provided theme', () => {
    const theme = 'dark'

    const { getByText } = render(
      <ThemeProvider defaultTheme={theme}>
        <div>Hello, World!</div>
      </ThemeProvider>
    )
    const element = getByText('Hello, World!')
    const html = document.querySelector('html')
    expect(element.textContent).contain('Hello, World!')
    expect(html?.style.colorScheme).equal('dark')
  })
})
