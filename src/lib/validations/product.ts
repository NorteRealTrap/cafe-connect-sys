import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  price: z.number().positive('Preço deve ser positivo'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  establishmentId: z.string().min(1, 'Estabelecimento é obrigatório'),
  image: z.string().url('URL de imagem inválida').optional().or(z.literal('')),
  active: z.boolean().default(true),
  stock: z.number().int().min(0, 'Estoque não pode ser negativo').optional()
})

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string()
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
