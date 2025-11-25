import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        },
        customer: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { customerId, items, notes } = await request.json();

    let total = 0;
    const productUpdates = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Produto ${product?.name} sem estoque` },
          { status: 400 }
        );
      }

      total += product.price * item.quantity;
      productUpdates.push({
        where: { id: product.id },
        data: { stock: product.stock - item.quantity }
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      for (const update of productUpdates) {
        await tx.product.update(update);
      }

      const order = await tx.order.create({
        data: {
          customerId,
          total,
          notes,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          },
          customer: true
        }
      });

      return order;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
