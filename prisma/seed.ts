import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admintester12345', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@cafeconnect.com' },
    update: {},
    create: {
      email: 'admin@cafeconnect.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN'
    }
  });

  // Create products
  await prisma.product.createMany({
    data: [
      {
        name: 'Espresso',
        description: 'Café espresso tradicional',
        price: 4.50,
        category: 'COFFEE',
        stock: 100,
      },
      {
        name: 'Cappuccino',
        description: 'Café com leite vaporizado',
        price: 6.00,
        category: 'COFFEE',
        stock: 80,
      },
      {
        name: 'Croissant',
        description: 'Croissant tradicional',
        price: 5.50,
        category: 'PASTRY',
        stock: 30,
      }
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed data criado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
