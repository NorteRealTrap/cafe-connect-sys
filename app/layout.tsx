import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cafe Connect System',
  description: 'Sistema de gerenciamento para cafeteria',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  )
}
