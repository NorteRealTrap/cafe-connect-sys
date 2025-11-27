import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { updateTableSchema } from '@/lib/validations/table'
import { z } from 'zod'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const table = await prisma.table.findUnique({
      where: { id: params.id },
      include: {
        establishment: { select: { id: true, name: true } },
        orders: {
          where: { status: { notIn: ['COMPLETED', 'CANCELLED'] } },
          include: {
            items: { include: { product: true } },
            payments: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!table) {
      return NextResponse.json({ error: 'Mesa não encontrada' }, { status: 404 })
    }

    return NextResponse.json(table)
  } catch (error) {
    console.error('Error fetching table:', error)
    return NextResponse.json({ error: 'Erro ao buscar mesa' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateTableSchema.parse({ ...body, id: params.id })
    const { id, ...updateData } = validatedData

    const table = await prisma.table.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json(table)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    console.error('Error updating table:', error)
    return NextResponse.json({ error: 'Erro ao atualizar mesa' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const activeOrders = await prisma.order.count({
      where: { tableId: params.id, status: { notIn: ['COMPLETED', 'CANCELLED'] } }
    })

    if (activeOrders > 0) {
      return NextResponse.json({ error: 'Mesa tem pedidos ativos' }, { status: 400 })
    }

    await prisma.table.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Mesa deletada com sucesso' })
  } catch (error) {
    console.error('Error deleting table:', error)
    return NextResponse.json({ error: 'Erro ao deletar mesa' }, { status: 500 })
  }
}
