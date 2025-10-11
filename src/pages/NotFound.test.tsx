import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import NotFound from './NotFound'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('NotFound', () => {
  it('renders page title', () => {
    renderWithRouter(<NotFound />)
    expect(screen.getByText(/página não encontrada/i)).toBeInTheDocument()
  })

  it('renders description message', () => {
    renderWithRouter(<NotFound />)
    expect(screen.getByText(/a página que você está procurando não existe/i)).toBeInTheDocument()
  })

  it('renders back to home link', () => {
    renderWithRouter(<NotFound />)
    
    const homeLink = screen.getByRole('link', { name: /voltar ao início/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('has proper styling classes', () => {
    renderWithRouter(<NotFound />)
    const root = document.querySelector('div.min-h-screen')
    expect(root).toBeTruthy()
  })
})