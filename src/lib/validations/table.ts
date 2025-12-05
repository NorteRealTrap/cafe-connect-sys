import { z } from 'zod'

export const createTableSchema = z.object({
  number: z.string().min(1),
  capacity: z.number().int().positive(),
  establishmentId: z.string().min(1),
  name: z.string().max(100).optional()
})

export const updateTableSchema = z.object({
  id: z.string(),
  number: z.string().min(1).optional(),
  capacity: z.number().int().positive().optional(),
  name: z.string().max(100).optional()
})

export const updateTableStatusSchema = z.object({
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE'])
})

export const transferOrderSchema = z.object({
  targetTableId: z.string().min(1)
})

export type CreateTableInput = z.infer<typeof createTableSchema>
export type UpdateTableInput = z.infer<typeof updateTableSchema>
export type UpdateTableStatusInput = z.infer<typeof updateTableStatusSchema>
