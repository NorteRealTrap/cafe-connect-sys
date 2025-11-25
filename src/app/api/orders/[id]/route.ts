import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: body.status
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
