import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const establishmentId = searchParams.get('establishmentId')
    const period = searchParams.get('period') || 'today'

    if (!establishmentId) {
      return NextResponse.json({ error: 'establishmentId é obrigatório' }, { status: 400 })
    }

    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        startDate.setHours(0, 0, 0, 0)
        break
      case 'month':
        startDate.setDate(now.getDate() - 30)
        startDate.setHours(0, 0, 0, 0)
        break
    }

    const [totalOrders, totalRevenue, topProducts, recentOrders, tableOccupation, ordersByStatus] = await Promise.all([
      prisma.order.count({ where: { establishmentId, createdAt: { gte: startDate } } }),
      prisma.order.aggregate({
        where: { establishmentId, createdAt: { gte: startDate }, status: { in: ['COMPLETED'] } },
        _sum: { total: true }
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: {
            establishmentId,
            createdAt: { gte: startDate },
            status: { in: ['COMPLETED', 'PREPARING', 'READY'] }
          }
        },
        _sum: { quantity: true, subtotal: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
      }),
      prisma.order.findMany({
        where: { establishmentId, createdAt: { gte: startDate } },
        include: {
          table: { select: { number: true } },
          items: { select: { quantity: true, product: { select: { name: true } } } }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.table.groupBy({
        by: ['status'],
        where: { establishmentId },
        _count: true
      }),
      prisma.order.groupBy({
        by: ['status'],
        where: { establishmentId, createdAt: { gte: startDate } },
        _count: true
      })
    ])

    const productIds = topProducts.map(p => p.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, image: true, price: true }
    })

    const topProductsWithDetails = topProducts.map(item => {
      const product = products.find(p => p.id === item.productId)
      return { ...product, quantitySold: item._sum.quantity, revenue: item._sum.subtotal }
    })

    const averageTicket = totalOrders > 0 ? (totalRevenue._sum.total?.toNumber() || 0) / totalOrders : 0

    return NextResponse.json({
      period,
      summary: { totalOrders, totalRevenue: totalRevenue._sum.total?.toNumber() || 0, averageTicket },
      topProducts: topProductsWithDetails,
      recentOrders,
      tableOccupation,
      ordersByStatus
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Erro ao buscar dados do dashboard' }, { status: 500 })
  }
}
