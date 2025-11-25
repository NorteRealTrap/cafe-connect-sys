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

    if (!establishmentId) {
      return new NextResponse('Establishment ID required', { status: 400 })
    }

    const products = await prisma.product.findMany({
      where: { 
        establishmentId,
        isActive: true 
      },
      include: {
        category: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { 
      name, 
      description, 
      price, 
      cost,
      categoryId, 
      image, 
      barcode,
      sku,
      stock,
      minStock,
      preparationTime,
      establishmentId 
    } = body

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        cost: cost ? parseFloat(cost) : null,
        categoryId,
        image,
        barcode,
        sku,
        stock: parseInt(stock) || 0,
        minStock: parseInt(minStock) || 0,
        preparationTime: preparationTime ? parseInt(preparationTime) : null,
        establishmentId
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}