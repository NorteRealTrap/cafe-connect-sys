'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProducts } from '@/hooks/useProducts'
import { useEstablishment } from '@/contexts/EstablishmentContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.string().min(1, 'Preço é obrigatório'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  image: z.string().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

export default function NewProductPage() {
  const router = useRouter()
  const { currentEstablishment } = useEstablishment()
  const { createProduct } = useProducts()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<any[]>([])

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProductFormData>({ resolver: zodResolver(productSchema) })

  useEffect(() => {
    if (currentEstablishment) {
      fetch(`/api/categories?establishmentId=${currentEstablishment.id}`)
        .then(res => res.json())
        .then(data => setCategories(data))
        .catch(err => console.error('Error loading categories:', err))
    }
  }, [currentEstablishment])

  const onSubmit = async (data: ProductFormData) => {
    if (!currentEstablishment) return
    setIsSubmitting(true)
    try {
      await createProduct({ ...data, price: parseFloat(data.price), establishmentId: currentEstablishment.id, active: true })
      toast.success('Produto criado com sucesso!')
      router.push('/dashboard/products')
    } catch (error) {
      toast.error('Erro ao criar produto')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
        <div><h1 className="text-3xl font-bold">Novo Produto</h1><p className="text-muted-foreground">Adicione um novo produto ao seu estabelecimento</p></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader><CardTitle>Informações do Produto</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input id="name" placeholder="Ex: Café Expresso" {...register('name')} disabled={isSubmitting} />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" placeholder="Descreva o produto..." rows={4} {...register('description')} disabled={isSubmitting} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço *</Label>
                <Input id="price" type="number" step="0.01" placeholder="0.00" {...register('price')} disabled={isSubmitting} />
                {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Categoria *</Label>
                <Select onValueChange={(value) => setValue('categoryId', value)} disabled={isSubmitting}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {categories.map(category => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-sm text-red-600">{errors.categoryId.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL da Imagem</Label>
              <Input id="image" type="url" placeholder="https://exemplo.com/imagem.jpg" {...register('image')} disabled={isSubmitting} />
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</> : 'Salvar Produto'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
