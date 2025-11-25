import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados multi-estabelecimentos...')

  // Limpar dados existentes (apenas desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Limpando dados antigos...')
    await prisma.orderPrint.deleteMany()
    await prisma.stockMovement.deleteMany()
    await prisma.payment.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.webOrderItem.deleteMany()
    await prisma.webOrder.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.table.deleteMany()
    await prisma.paymentMethod.deleteMany()
    await prisma.printConfig.deleteMany()
    await prisma.establishmentUser.deleteMany()
    await prisma.establishment.deleteMany()
    await prisma.user.deleteMany()
  }

  // Criar usuários
  console.log('👥 Criando usuários...')
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@multipdv.com',
      name: 'Administrador Sistema',
      password: hashedPassword,
      role: 'ADMIN',
    }
  })

  const managerUser = await prisma.user.create({
    data: {
      email: 'gerente@multipdv.com',
      name: 'Gerente Geral',
      password: await bcrypt.hash('gerente123', 12),
      role: 'MANAGER',
    }
  })

  const cashierUser = await prisma.user.create({
    data: {
      email: 'caixa@multipdv.com',
      name: 'Operador de Caixa',
      password: await bcrypt.hash('caixa123', 12),
      role: 'CASHIER',
    }
  })

  // Criar estabelecimentos de exemplo
  console.log('🏪 Criando estabelecimentos...')
  
  const establishments = [
    {
      name: 'Padaria Pão Quente',
      tradingName: 'Padaria Pão Quente',
      type: 'BAKERY' as const,
      address: 'Rua das Flores, 123 - Centro - São Paulo/SP',
      phone: '(11) 3333-4444',
      email: 'contato@paoquente.com',
      openingTime: '06:00',
      closingTime: '20:00'
    },
    {
      name: 'Lanchonete Sabor & Arte',
      tradingName: 'Lanchonete Sabor & Arte',
      type: 'COFFEE_SHOP' as const, 
      address: 'Av. Principal, 456 - Jardins - São Paulo/SP',
      phone: '(11) 5555-6666',
      email: 'contato@saborearte.com',
      openingTime: '07:00',
      closingTime: '22:00'
    },
    {
      name: 'Bar do Zé',
      tradingName: 'Bar e Restaurante do Zé',
      type: 'BAR' as const,
      address: 'Rua da Noite, 789 - Vila Madalena - São Paulo/SP',
      phone: '(11) 7777-8888',
      email: 'contato@bardoze.com',
      openingTime: '17:00',
      closingTime: '02:00'
    },
    {
      name: 'Adega Vinhos Finos',
      tradingName: 'Adega Vinhos Finos',
      type: 'WINE_SHOP' as const,
      address: 'Alameda Santos, 101 - Cerqueira César - São Paulo/SP',
      phone: '(11) 9999-0000',
      email: 'contato@adegavinhosfinos.com',
      openingTime: '10:00',
      closingTime: '20:00'
    },
    {
      name: 'Confeitaria Doce Sabor',
      tradingName: 'Confeitaria Doce Sabor',
      type: 'CONFECTIONERY' as const,
      address: 'Rua dos Doces, 202 - Moema - São Paulo/SP',
      phone: '(11) 2222-3333',
      email: 'contato@docesabor.com',
      openingTime: '08:00',
      closingTime: '19:00'
    }
  ]

  const createdEstablishments = []
  for (const estData of establishments) {
    const establishment = await prisma.establishment.create({
      data: estData
    })
    createdEstablishments.push(establishment)
  }

  // Vincular usuários aos estabelecimentos
  console.log('🔗 Vinculando usuários aos estabelecimentos...')
  for (const establishment of createdEstablishments) {
    await prisma.establishmentUser.create({
      data: {
        userId: adminUser.id,
        establishmentId: establishment.id,
        role: 'OWNER'
      }
    })
    
    await prisma.establishmentUser.create({
      data: {
        userId: managerUser.id,
        establishmentId: establishment.id,
        role: 'MANAGER'
      }
    })

    await prisma.establishmentUser.create({
      data: {
        userId: cashierUser.id,
        establishmentId: establishment.id,
        role: 'CASHIER'
      }
    })
  }

  // Criar mesas para cada estabelecimento
  console.log('🪑 Criando mesas...')
  for (const establishment of createdEstablishments) {
    for (let i = 1; i <= 10; i++) {
      await prisma.table.create({
        data: {
          number: i.toString(),
          name: `Mesa ${i}`,
          capacity: [2, 4, 6, 8][i % 4],
          establishmentId: establishment.id
        }
      })
    }
  }

  // Criar categorias e produtos específicos por tipo de estabelecimento
  console.log('📦 Criando categorias e produtos...')
  
  const establishmentProducts = {
    'BAKERY': {
      categories: ['Pães', 'Bolos', 'Salgados', 'Tortas', 'Bebidas'],
      products: [
        { name: 'Pão Francês', price: 0.50, category: 'Pães', stock: 200 },
        { name: 'Pão de Forma', price: 8.00, category: 'Pães', stock: 50 },
        { name: 'Bolo de Chocolate', price: 25.00, category: 'Bolos', stock: 10 },
        { name: 'Coxinha', price: 4.00, category: 'Salgados', stock: 100 },
        { name: 'Torta de Frango', price: 12.00, category: 'Tortas', stock: 15 },
        { name: 'Café Expresso', price: 3.00, category: 'Bebidas', stock: 500 }
      ]
    },
    'COFFEE_SHOP': {
      categories: ['Lanches', 'Bebidas Quentes', 'Bebidas Frias', 'Sobremesas'],
      products: [
        { name: 'X-Burger', price: 15.00, category: 'Lanches', stock: 50 },
        { name: 'Misto Quente', price: 8.00, category: 'Lanches', stock: 30 },
        { name: 'Cappuccino', price: 8.00, category: 'Bebidas Quentes', stock: 100 },
        { name: 'Suco Natural', price: 7.00, category: 'Bebidas Frias', stock: 80 },
        { name: 'Brownie', price: 6.00, category: 'Sobremesas', stock: 25 }
      ]
    },
    'BAR': {
      categories: ['Cervejas', 'Drinks', 'Petiscos', 'Refrigerantes'],
      products: [
        { name: 'Heineken Long Neck', price: 8.00, category: 'Cervejas', stock: 200 },
        { name: 'Caipirinha', price: 12.00, category: 'Drinks', stock: 100 },
        { name: 'Porção de Batata', price: 25.00, category: 'Petiscos', stock: 50 },
        { name: 'Coca-Cola', price: 6.00, category: 'Refrigerantes', stock: 150 }
      ]
    },
    'WINE_SHOP': {
      categories: ['Vinhos Tinto', 'Vinhos Branco', 'Espumantes', 'Acessórios'],
      products: [
        { name: 'Vinho Tinto Seco', price: 45.00, category: 'Vinhos Tinto', stock: 60 },
        { name: 'Vinho Branco Suave', price: 38.00, category: 'Vinhos Branco', stock: 45 },
        { name: 'Espumante Nacional', price: 55.00, category: 'Espumantes', stock: 30 },
        { name: 'Taça para Vinho', price: 15.00, category: 'Acessórios', stock: 100 }
      ]
    },
    'CONFECTIONERY': {
      categories: ['Bolos', 'Docinhos', 'Tortas Doces', 'Salgados Finos'],
      products: [
        { name: 'Bolo de Aniversário', price: 80.00, category: 'Bolos', stock: 5 },
        { name: 'Brigadeiro', price: 2.50, category: 'Docinhos', stock: 200 },
        { name: 'Torta de Limão', price: 35.00, category: 'Tortas Doces', stock: 8 },
        { name: 'Salgado Fino', price: 4.00, category: 'Salgados Finos', stock: 120 }
      ]
    }
  }

  for (const establishment of createdEstablishments) {
    const establishmentType = establishment.type as keyof typeof establishmentProducts
    const productData = establishmentProducts[establishmentType]
    
    if (productData) {
      // Criar categorias
      for (const categoryName of productData.categories) {
        const category = await prisma.category.create({
          data: {
            name: categoryName,
            establishmentId: establishment.id,
            order: productData.categories.indexOf(categoryName)
          }
        })

        // Criar produtos para esta categoria
        const categoryProducts = productData.products.filter(p => p.category === categoryName)
        for (const product of categoryProducts) {
          await prisma.product.create({
            data: {
              name: product.name,
              price: product.price,
              categoryId: category.id,
              establishmentId: establishment.id,
              stock: product.stock,
              minStock: Math.floor(product.stock * 0.2)
            }
          })
        }
      }
    }
  }

  // Criar métodos de pagamento
  console.log('💳 Criando métodos de pagamento...')
  const paymentMethods = [
    { name: 'Dinheiro', type: 'CASH' as const },
    { name: 'Cartão de Crédito', type: 'CREDIT_CARD' as const },
    { name: 'Cartão de Débito', type: 'DEBIT_CARD' as const },
    { name: 'PIX', type: 'PIX' as const },
    { name: 'Vale Alimentação', type: 'MEAL_VOUCHER' as const }
  ]

  for (const establishment of createdEstablishments) {
    for (const method of paymentMethods) {
      await prisma.paymentMethod.create({
        data: {
          name: method.name,
          type: method.type,
          establishmentId: establishment.id
        }
      })
    }
  }

  // Criar configurações de impressão
  console.log('🖨️ Criando configurações de impressão...')
  const printTypes = ['KITCHEN', 'BAR', 'CASHIER'] as const
  
  for (const establishment of createdEstablishments) {
    for (const printType of printTypes) {
      await prisma.printConfig.create({
        data: {
          type: printType,
          establishmentId: establishment.id,
          printerName: `Impressora ${printType.toLowerCase()}`,
          copies: 1,
          header: `${establishment.name} - ${printType}`,
          footer: 'Obrigado pela preferência!'
        }
      })
    }
  }

  console.log('✅ Seed concluído com sucesso!')
  console.log('')
  console.log('📊 RESUMO DOS DADOS CRIADOS:')
  console.log(`   👥 Usuários: 3`)
  console.log(`   🏪 Estabelecimentos: ${createdEstablishments.length}`)
  console.log(`   🪑 Mesas: 50 (10 por estabelecimento)`)
  console.log(`   📦 Produtos: ~20 por estabelecimento`)
  console.log(`   💳 Métodos de pagamento: 5 por estabelecimento`)
  console.log(`   🖨️ Configurações de impressão: 3 por estabelecimento`)
  console.log('')
  console.log('🔑 CREDENCIAIS DE TESTE:')
  console.log('   Admin: admin@multipdv.com / admin123')
  console.log('   Gerente: gerente@multipdv.com / gerente123')
  console.log('   Caixa: caixa@multipdv.com / caixa123')
  console.log('')
  console.log('🏪 ESTABELECIMENTOS CRIADOS:')
  createdEstablishments.forEach(est => {
    console.log(`   • ${est.name} (${est.type}) - ${est.email}`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })