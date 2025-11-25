import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  console.log('👤 Criando usuário admin...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cafeconnect.com' },
    update: {},
    create: {
      email: 'admin@cafeconnect.com',
      password: adminPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin criado:', admin.email);

  console.log('☕ Criando produtos...');
  const productsData = [
    {
      name: 'Espresso',
      description: 'Café espresso tradicional italiano, intenso e aromático',
      price: 4.50,
      category: 'COFFEE' as const,
      stock: 100,
    },
    {
      name: 'Cappuccino',
      description: 'Café com leite vaporizado e espuma cremosa',
      price: 6.00,
      category: 'COFFEE' as const,
      stock: 80,
    },
    {
      name: 'Latte',
      description: 'Café com leite cremoso e suave',
      price: 5.50,
      category: 'COFFEE' as const,
      stock: 90,
    },
    {
      name: 'Americano',
      description: 'Espresso diluído em água quente',
      price: 4.00,
      category: 'COFFEE' as const,
      stock: 100,
    },
    {
      name: 'Mocha',
      description: 'Café com chocolate e leite vaporizado',
      price: 7.00,
      category: 'COFFEE' as const,
      stock: 70,
    },
    {
      name: 'Croissant',
      description: 'Croissant francês tradicional, crocante e amanteigado',
      price: 5.50,
      category: 'PASTRY' as const,
      stock: 30,
    },
    {
      name: 'Pão de Queijo',
      description: 'Autêntico pão de queijo mineiro',
      price: 3.50,
      category: 'PASTRY' as const,
      stock: 50,
    },
    {
      name: 'Bolo de Cenoura',
      description: 'Bolo caseiro com cobertura de chocolate',
      price: 6.50,
      category: 'DESSERT' as const,
      stock: 20,
    },
    {
      name: 'Sanduíche Natural',
      description: 'Sanduíche de pão integral com vegetais frescos',
      price: 8.00,
      category: 'SANDWICH' as const,
      stock: 25,
    },
    {
      name: 'Chá Verde',
      description: 'Chá verde premium importado',
      price: 4.00,
      category: 'TEA' as const,
      stock: 60,
    },
  ];

  for (const productData of productsData) {
    const product = await prisma.product.upsert({
      where: { 
        id: `seed-${productData.name.toLowerCase().replace(/\s+/g, '-')}` 
      },
      update: {},
      create: productData,
    });
    console.log(`✅ Produto criado: ${product.name}`);
  }

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
