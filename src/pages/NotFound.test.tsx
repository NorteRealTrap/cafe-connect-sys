import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { NotFound } from './NotFound'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('NotFound', () => {
  it('renders 404 error message', () => {
    renderWithRouter(<NotFound />)
    
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('renders page not found message', () => {
    renderWithRouter(<NotFound />)
    
    expect(screen.getByText(/página não encontrada/i)).toBeInTheDocument()
  })

  it('renders back to home link', () => {
    renderWithRouter(<NotFound />)
    
    const homeLink = screen.getByRole('link', { name: /voltar ao início/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('has proper styling classes', () => {
    renderWithRouter(<NotFound />)
    
    const container = screen.getByText('404').closest('div')
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center')
  })
})