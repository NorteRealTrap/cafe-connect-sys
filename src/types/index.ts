import { UserRole, OrderStatus, ProductCategory } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: ProductCategory;
  image: string | null;
  stock: number;
  isActive: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  total: number;
  status: OrderStatus;
  notes: string | null;
  createdAt: Date;
  items: OrderItem[];
  customer?: User;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}
