import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Café Connect - Sistema de Gerenciamento',
  description: 'Sistema completo para gerenciar sua cafeteria',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  )
}
