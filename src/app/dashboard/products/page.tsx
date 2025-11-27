'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProducts } from '@/hooks/useProducts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react'
import Image from 'next/image'

export default function ProductsPage() {
  const router = useRouter()
  const { products, isLoading, deleteProduct } = useProducts()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.categoryId === categoryFilter
    return matchesSearch && matchesCategory
  })

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct(id)
      } catch (error) {
        alert('Erro ao excluir produto')
      }
    }
  }

  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">Gerencie os produtos do estabelecimento</p>
        </div>
        <Button onClick={() => router.push('/dashboard/products/new')}>
          <Plus className="w-4 h-4 mr-2" />Novo Produto
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Buscar produtos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Todas categorias" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            {categories.map(category => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4"><div className="h-4 bg-gray-200 rounded mb-2"></div><div className="h-3 bg-gray-200 rounded w-2/3"></div></CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id}>
              <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                {product.image ? <Image src={product.image} alt={product.name} fill className="object-cover" /> : (
                  <div className="flex items-center justify-center h-full"><Package className="w-16 h-16 text-gray-300" /></div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div><h3 className="font-semibold text-lg">{product.name}</h3><p className="text-sm text-muted-foreground">{product.category.name}</p></div>
                  </div>
                  {product.description && <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-2xl font-bold text-orange-600">{formatCurrency(product.price)}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(product.id)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground mb-4">Comece adicionando produtos ao seu estabelecimento</p>
            <Button onClick={() => router.push('/dashboard/products/new')}><Plus className="w-4 h-4 mr-2" />Adicionar Produto</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
