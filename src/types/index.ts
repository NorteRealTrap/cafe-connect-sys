import { UserRole, OrderStatus } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
  isActive: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName?: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

export type { UserRole, OrderStatus }