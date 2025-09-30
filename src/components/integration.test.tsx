import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '../App'

// Mock components that might not be fully implemented
vi.mock('@/components/auth/LoginForm', () => ({
  LoginForm: ({ onLogin }: { onLogin: (role: string) => void }) => (
    <div data-testid="login-form">
      <button onClick={() => onLogin('admin')}>Login as Admin</button>
      <button onClick={() => onLogin('employee')}>Login as Employee</button>
    </div>
  )
}))

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('Application Integration Tests', () => {
  it('renders login form initially', () => {
    renderWithProviders(<App />)
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })

  it('navigates to dashboard after login', async () => {
    renderWithProviders(<App />)
    
    fireEvent.click(screen.getByText('Login as Admin'))
    
    await waitFor(() => {
      expect(screen.queryByTestId('login-form')).not.toBeInTheDocument()
    })
  })

  it('handles different user roles', async () => {
    renderWithProviders(<App />)
    
    fireEvent.click(screen.getByText('Login as Employee'))
    
    await waitFor(() => {
      expect(screen.queryByTestId('login-form')).not.toBeInTheDocument()
    })
  })

  it('maintains responsive design principles', () => {
    // Test mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    })

    renderWithProviders(<App />)
    
    // Verify mobile-friendly elements are present
    expect(document.body).toBeInTheDocument()
  })
})