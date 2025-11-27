import { EstablishmentProvider } from '@/contexts/EstablishmentContext'
import { CartProvider } from '@/contexts/CartContext'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <EstablishmentProvider>
      <CartProvider>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </CartProvider>
    </EstablishmentProvider>
  )
}
