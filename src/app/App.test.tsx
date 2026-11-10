import { render, screen } from '@testing-library/react'
import { App } from './App'

test('App dựng được khung có vùng nội dung chính', () => {
  render(<App />)
  expect(screen.getByRole('main')).toBeInTheDocument()
})
