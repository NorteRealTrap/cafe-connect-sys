import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateOrderStatusSchema } from '@/lib/validations/order'
import { z } from 'zod'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = updateOrderStatusSchema.parse(body)

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { table: true }
    })

    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    const validTransitions: Record<string, string[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PREPARING', 'CANCELLED'],
      PREPARING: ['READY', 'CANCELLED'],
      READY: ['COMPLETED'],
      COMPLETED: [],
      CANCELLED: []
    }

    const allowedStatuses = validTransitions[order.status]
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: `Não é possível mudar de ${order.status} para ${status}` }, { status: 400 })
    }

    const updateData: any = { status }

    if (status === 'COMPLETED' || status === 'CANCELLED') {
      if (order.tableId) {
        await prisma.table.update({
          where: { id: order.tableId },
          data: { status: 'AVAILABLE' }
        })
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        table: true,
        items: { include: { product: true } }
      }
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Status inválido', details: error.errors }, { status: 400 })
    }
    console.error('Error updating order status:', error)
    return NextResponse.json({ error: 'Erro ao atualizar status' }, { status: 500 })
  }
}
