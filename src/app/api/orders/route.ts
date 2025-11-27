import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createOrderSchema } from '@/lib/validations/order'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const establishmentId = searchParams.get('establishmentId')
    const status = searchParams.get('status')

    const orders = await prisma.order.findMany({
      where: {
        ...(establishmentId && { establishmentId }),
        ...(status && status !== 'ALL' && { status })
      },
      include: {
        table: true,
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        },
        establishment: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createOrderSchema.parse(body)

    // Buscar produtos para calcular preços
    const productIds = validatedData.items.map(item => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        establishmentId: validatedData.establishmentId,
        active: true
      }
    })

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: 'Um ou mais produtos não encontrados' }, { status: 400 })
    }

    // Calcular subtotal e total
    let subtotal = 0
    const orderItems = validatedData.items.map(item => {
      const product = products.find(p => p.id === item.productId)!
      const itemSubtotal = product.price.toNumber() * item.quantity
      subtotal += itemSubtotal

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal: itemSubtotal,
        notes: item.notes
      }
    })

    const discount = validatedData.discount || 0
    const total = subtotal * (1 - discount / 100)

    const order = await prisma.order.create({
      data: {
        establishmentId: validatedData.establishmentId,
        tableId: validatedData.tableId,
        status: 'PENDING',
        subtotal,
        discount,
        total,
        customerName: validatedData.customerName,
        customerPhone: validatedData.customerPhone,
        notes: validatedData.notes,
        items: {
          create: orderItems
        }
      },
      include: {
        table: true,
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    })

    if (validatedData.tableId) {
      await prisma.table.update({
        where: { id: validatedData.tableId },
        data: { status: 'OCCUPIED' }
      })
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
