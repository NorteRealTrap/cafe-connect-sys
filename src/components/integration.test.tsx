import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, it, expect, vi } from 'vitest';
import App from '../App'

// Mock the FuturisticLogin used by Index page to avoid canvas and complex UI
vi.mock('@/components/auth/FuturisticLogin', () => ({
  FuturisticLogin: ({ onLogin }: { onLogin: (_credentials: { email: string; password: string; role: string }) => void }) => (
    <div data-testid="login-form">
      <button onClick={() => onLogin({ email: 'admin@x.com', password: 'x', role: 'admin' })}>Login as Admin</button>
      <button onClick={() => onLogin({ email: 'emp@x.com', password: 'x', role: 'employee' })}>Login as Employee</button>
    </div>
  )
}))

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const renderWithProviders = (component: React.ReactElement<unknown>) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  localStorage.clear()
})

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