// Validações com Zod para formulários
import { z } from 'zod';
import { sanitizeString } from './security';

/**
 * Schema de validação para login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .transform((val) => sanitizeString(val.toLowerCase().trim())),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(4, 'Senha deve ter pelo menos 4 caracteres'),
  role: z.enum(['admin', 'caixa', 'atendente'], {
    errorMap: () => ({ message: 'Tipo de usuário inválido' })
  })
});

/**
 * Schema de validação para criação de pedido
 */
export const orderSchema = z.object({
  cliente: z
    .string()
    .min(1, 'Nome do cliente é obrigatório')
    .max(200, 'Nome muito longo')
    .transform((val) => sanitizeString(val)),
  telefone: z
    .string()
    .optional()
    .transform((val) => val ? sanitizeString(val) : ''),
  tipo: z.enum(['local', 'delivery', 'retirada']),
  mesa: z
    .string()
    .optional()
    .transform((val) => val ? sanitizeString(val) : ''),
  endereco: z
    .string()
    .optional()
    .transform((val) => val ? sanitizeString(val) : ''),
  observacoes: z
    .string()
    .optional()
    .max(500, 'Observações muito longas')
    .transform((val) => val ? sanitizeString(val) : '')
}).refine((data) => {
  if (data.tipo === 'local' && !data.mesa) {
    return false;
  }
  return true;
}, {
  message: 'Mesa é obrigatória para pedidos locais',
  path: ['mesa']
}).refine((data) => {
  if (data.tipo === 'delivery' && !data.endereco) {
    return false;
  }
  return true;
}, {
  message: 'Endereço é obrigatório para delivery',
  path: ['endereco']
});

/**
 * Schema de validação para web order
 */
export const webOrderSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(200, 'Nome muito longo')
    .transform((val) => sanitizeString(val)),
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .max(20, 'Telefone inválido')
    .transform((val) => sanitizeString(val)),
  address: z
    .string()
    .optional()
    .transform((val) => val ? sanitizeString(val) : ''),
  notes: z
    .string()
    .optional()
    .max(500, 'Observações muito longas')
    .transform((val) => val ? sanitizeString(val) : '')
});

/**
 * Schema de validação para status de pedido
 */
export const orderStatusSchema = z.object({
  orderId: z
    .string()
    .min(1, 'ID do pedido é obrigatório')
    .max(100, 'ID inválido')
    .transform((val) => sanitizeString(val)),
  status: z.enum(['pendente', 'preparando', 'pronto', 'entregue', 'cancelado']),
  orderNumber: z
    .string()
    .max(50)
    .optional()
    .transform((val) => val ? sanitizeString(val) : ''),
  customerPhone: z
    .string()
    .max(20)
    .optional()
    .transform((val) => val ? sanitizeString(val) : ''),
  customerName: z
    .string()
    .max(200)
    .optional()
    .transform((val) => val ? sanitizeString(val) : '')
});

/**
 * Validar dados com schema
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
} {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}




