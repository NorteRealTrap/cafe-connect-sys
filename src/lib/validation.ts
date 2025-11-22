import { z } from 'zod';

/**
 * Schemas de validação para prevenir SQL injection e XSS
 */

export const OrderSchema = z.object({
  id: z.string().max(100),
  customerName: z.string().min(1).max(200),
  customerPhone: z.string().max(20).optional(),
  customerAddress: z.string().max(500).optional(),
  items: z.array(z.object({
    productId: z.string().max(100),
    productName: z.string().max(200),
    quantity: z.number().int().positive().max(1000),
    price: z.number().positive().max(999999),
    total: z.number().positive().max(999999),
  })).min(1).max(100),
  total: z.number().positive().max(999999),
  status: z.enum(['pendente', 'aceito', 'preparando', 'pronto', 'entregue', 'cancelado']),
  type: z.enum(['local', 'delivery', 'retirada']),
});

export const ProductSchema = z.object({
  id: z.string().max(100).optional(),
  name: z.string().min(1).max(200),
  description: z.string().max(1000),
  price: z.number().positive().max(999999),
  category: z.string().max(100),
  available: z.boolean(),
});

export const UserSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(6).max(100),
});

export const StatusUpdateSchema = z.object({
  orderId: z.string().max(100),
  status: z.string().max(50),
  timestamp: z.string().datetime(),
});

/**
 * Sanitiza string removendo caracteres perigosos
 */
export function sanitizeString(str: string, maxLength: number = 200): string {
  return str
    .replace(/[<>\"']/g, '') // Remove caracteres HTML perigosos
    .substring(0, maxLength)
    .trim();
}

/**
 * Valida e sanitiza dados de entrada
 */
export function validateAndSanitize<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}
