import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@cafeconnect.com' },
    update: {},
    create: {
      email: 'admin@cafeconnect.com',
      password: adminPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });

  const products = [
    { name: 'Espresso', description: 'Café espresso tradicional', price: 4.50, category: 'COFFEE', stock: 100 },
    { name: 'Cappuccino', description: 'Café com leite vaporizado', price: 6.00, category: 'COFFEE', stock: 80 },
    { name: 'Latte', description: 'Café com leite cremoso', price: 5.50, category: 'COFFEE', stock: 90 },
    { name: 'Croissant', description: 'Croissant francês', price: 5.50, category: 'PASTRY', stock: 30 },
    { name: 'Pão de Queijo', description: 'Pão de queijo mineiro', price: 3.50, category: 'PASTRY', stock: 50 },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('✅ Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });