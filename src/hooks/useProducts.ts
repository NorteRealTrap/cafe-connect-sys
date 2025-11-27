import { useState, useEffect } from 'react'
import { useEstablishment } from '@/contexts/EstablishmentContext'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  active: boolean
  categoryId: string
  category: {
    id: string
    name: string
  }
}

export function useProducts() {
  const { currentEstablishment } = useEstablishment()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async (categoryId?: string, search?: string) => {
    if (!currentEstablishment) return

    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        establishmentId: currentEstablishment.id,
        ...(categoryId && { categoryId }),
        ...(search && { search })
      })

      const response = await fetch(`/api/products?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const createProduct = async (productData: any) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create product')
      }

      const newProduct = await response.json()
      setProducts(prev => [...prev, newProduct])
      return newProduct
    } catch (err) {
      throw err
    }
  }

  const updateProduct = async (id: string, productData: any) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      const updatedProduct = await response.json()
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p))
      return updatedProduct
    } catch (err) {
      throw err
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchProducts()

    const handleEstablishmentChange = () => {
      fetchProducts()
    }

    window.addEventListener('establishmentChanged', handleEstablishmentChange)
    return () => {
      window.removeEventListener('establishmentChanged', handleEstablishmentChange)
    }
  }, [currentEstablishment])

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  }
}
