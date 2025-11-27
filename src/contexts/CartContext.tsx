'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  notes?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: any, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateNotes: (productId: string, notes: string) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (product: any, quantity: number = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.productId === product.id)
      if (existingItem) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item)
      }
      return [...prev, { id: `${product.id}-${Date.now()}`, productId: product.id, name: product.name, price: product.price, quantity, notes: '' }]
    })
  }

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item))
  }

  const updateNotes = (productId: string, notes: string) => {
    setItems(prev => prev.map(item => item.productId === productId ? { ...item, notes } : item))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, updateNotes, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
