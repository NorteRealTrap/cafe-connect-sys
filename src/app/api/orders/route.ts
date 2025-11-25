import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const establishmentId = searchParams.get('establishmentId')

    const orders = await prisma.order.findMany({
      where: establishmentId ? { establishmentId } : {},
      include: {
        items: {
          include: {
            product: true
          }
        },
        table: true,
        createdBy: {
          select: { name: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { 
      establishmentId,
      customerName, 
      tableId, 
      items, 
      type = 'LOCAL',
      notes 
    } = body

    // Calcular totais
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + (item.unitPrice * item.quantity)
    }, 0)
    
    const tax = subtotal * 0.1 // 10% de taxa
    const total = subtotal + tax

    // Gerar número do pedido
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        type,
        customerName,
        tableId,
        subtotal,
        tax,
        total,
        notes,
        createdById: session.user.id,
        establishmentId,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
            notes: item.notes
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        table: true
      }
    })

    // Atualizar estoque
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })

      if (product) {
        const newStock = product.stock - item.quantity
        
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: newStock }
        })

        await prisma.stockMovement.create({
          data: {
            productId: item.productId,
            type: 'OUT',
            quantity: item.quantity,
            previousStock: product.stock,
            newStock,
            reason: `Pedido ${orderNumber}`
          }
        })
      }
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error creating order:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}