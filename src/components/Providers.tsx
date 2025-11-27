'use client'

import { SessionProvider } from 'next-auth/react'
import { EstablishmentProvider } from '@/contexts/EstablishmentContext'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <EstablishmentProvider>
        {children}
        <Toaster position="top-right" richColors />
      </EstablishmentProvider>
    </SessionProvider>
  )
}
