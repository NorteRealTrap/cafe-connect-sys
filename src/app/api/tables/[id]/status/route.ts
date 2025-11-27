import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateTableStatusSchema } from '@/lib/validations/table'
import { z } from 'zod'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = updateTableStatusSchema.parse(body)

    const table = await prisma.table.update({
      where: { id: params.id },
      data: { status }
    })

    return NextResponse.json(table)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Status inválido', details: error.errors }, { status: 400 })
    }
    console.error('Error updating table status:', error)
    return NextResponse.json({ error: 'Erro ao atualizar status' }, { status: 500 })
  }
}
