import { render, screen, fireEvent } from '@testing-library/react'
import { Dashboard } from './Dashboard'
import { UserRole } from '@/components/auth/LoginForm'

// Mock the components
vi.mock('@/components/PDVLayout', () => ({
  PDVLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="pdv-layout">{children}</div>
}))

vi.mock('@/components/dashboard/DashboardHeader', () => ({
  DashboardHeader: ({ userRole, onLogout }: { userRole: UserRole; onLogout: () => void }) => (
    <div data-testid="dashboard-header">
      <span>Role: {userRole}</span>
      <button onClick={onLogout}>Logout</button>
    </div>
  )
}))

vi.mock('@/components/dashboard/DashboardGrid', () => ({
  DashboardGrid: ({ userRole, onModuleClick }: { userRole: UserRole; onModuleClick: (id: string) => void }) => (
    <div data-testid="dashboard-grid">
      <button onClick={() => onModuleClick('pedidos')}>Pedidos</button>
      <button onClick={() => onModuleClick('cardapio')}>Cardápio</button>
    </div>
  )
}))

vi.mock('@/components/orders/OrdersPanel', () => ({
  OrdersPanel: ({ onBack }: { onBack: () => void }) => (
    <div data-testid="orders-panel">
      <button onClick={onBack}>Back</button>
    </div>
  )
}))

vi.mock('@/components/menu/MenuPanel', () => ({
  MenuPanel: ({ onBack }: { onBack: () => void }) => (
    <div data-testid="menu-panel">
      <button onClick={onBack}>Back</button>
    </div>
  )
}))

describe('Dashboard', () => {
  const mockOnLogout = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Ensure tests start from dashboard (no persisted module state)
    localStorage.removeItem('ccpservices-active-module')
  })

  it('renders dashboard with correct user role', () => {
    render(<Dashboard userRole="admin" onLogout={mockOnLogout} />)
    
    expect(screen.getByTestId('pdv-layout')).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument()
    expect(screen.getByText('Role: admin')).toBeInTheDocument()
  })

  it('shows dashboard grid by default', () => {
    render(<Dashboard userRole="admin" onLogout={mockOnLogout} />)
    
    expect(screen.getByTestId('dashboard-grid')).toBeInTheDocument()
    expect(screen.queryByTestId('orders-panel')).not.toBeInTheDocument()
    expect(screen.queryByTestId('menu-panel')).not.toBeInTheDocument()
  })

  it('navigates to orders panel when pedidos is clicked', () => {
    render(<Dashboard userRole="admin" onLogout={mockOnLogout} />)
    
    fireEvent.click(screen.getByText('Pedidos'))
    
    expect(screen.getByTestId('orders-panel')).toBeInTheDocument()
    expect(screen.queryByTestId('dashboard-grid')).not.toBeInTheDocument()
  })

  it('navigates to menu panel when cardapio is clicked', () => {
    render(<Dashboard userRole="admin" onLogout={mockOnLogout} />)
    
    fireEvent.click(screen.getByText('Cardápio'))
    
    expect(screen.getByTestId('menu-panel')).toBeInTheDocument()
    expect(screen.queryByTestId('dashboard-grid')).not.toBeInTheDocument()
  })

  it('returns to dashboard when back button is clicked', () => {
    render(<Dashboard userRole="admin" onLogout={mockOnLogout} />)
    
    // Navigate to orders
    fireEvent.click(screen.getByText('Pedidos'))
    expect(screen.getByTestId('orders-panel')).toBeInTheDocument()
    
    // Click back
    fireEvent.click(screen.getByText('Back'))
    expect(screen.getByTestId('dashboard-grid')).toBeInTheDocument()
  })

  it('calls onLogout when logout button is clicked', () => {
    render(<Dashboard userRole="admin" onLogout={mockOnLogout} />)
    
    fireEvent.click(screen.getByText('Logout'))
    
    expect(mockOnLogout).toHaveBeenCalledTimes(1)
  })

  it('works with different user roles', () => {
    const { rerender } = render(<Dashboard userRole="manager" onLogout={mockOnLogout} />)
    expect(screen.getByText('Role: manager')).toBeInTheDocument()
    
    rerender(<Dashboard userRole="employee" onLogout={mockOnLogout} />)
    expect(screen.getByText('Role: employee')).toBeInTheDocument()
  })
})