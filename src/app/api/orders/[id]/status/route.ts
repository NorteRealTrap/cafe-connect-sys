import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateOrderStatusSchema } from '@/lib/validations/order'
import { z } from 'zod'

export const runtime = 'nodejs'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = updateOrderStatusSchema.parse(body)

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: {
        table: true,
        items: { include: { product: true } }
      }
    })

    if (status === 'COMPLETED' || status === 'CANCELLED') {
      if (order.tableId) {
        await prisma.table.update({
          where: { id: order.tableId },
          data: { status: 'AVAILABLE' }
        })
      }
    }

    return NextResponse.json(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Status inválido', details: error.errors }, { status: 400 })
    }
    console.error('Error updating order status:', error)
    return NextResponse.json({ error: 'Erro ao atualizar status' }, { status: 500 })
  }
}
