import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createTableSchema } from '@/lib/validations/table'
import { z } from 'zod'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const establishmentId = searchParams.get('establishmentId')

    const tables = await prisma.table.findMany({
      where: {
        ...(establishmentId && { establishmentId })
      },
      include: {
        establishment: { select: { id: true, name: true } },
        orders: {
          where: { status: { notIn: ['COMPLETED', 'CANCELLED'] } },
          include: { items: true }
        }
      },
      orderBy: { number: 'asc' }
    })

    return NextResponse.json(tables)
  } catch (error) {
    console.error('Error fetching tables:', error)
    return NextResponse.json({ error: 'Erro ao buscar mesas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createTableSchema.parse(body)

    const table = await prisma.table.create({
      data: validatedData
    })

    return NextResponse.json(table, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    console.error('Error creating table:', error)
    return NextResponse.json({ error: 'Erro ao criar mesa' }, { status: 500 })
  }
}
