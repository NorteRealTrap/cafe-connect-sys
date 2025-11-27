import { z } from 'zod'

export const createTableSchema = z.object({
  number: z.number().int().positive(),
  capacity: z.number().int().positive(),
  establishmentId: z.string().min(1),
  location: z.string().max(100).optional()
})

export const updateTableSchema = createTableSchema.partial().extend({
  id: z.string()
})

export const updateTableStatusSchema = z.object({
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING'])
})

export const transferOrderSchema = z.object({
  targetTableId: z.string().min(1)
})

export type CreateTableInput = z.infer<typeof createTableSchema>
export type UpdateTableInput = z.infer<typeof updateTableSchema>
export type UpdateTableStatusInput = z.infer<typeof updateTableStatusSchema>
