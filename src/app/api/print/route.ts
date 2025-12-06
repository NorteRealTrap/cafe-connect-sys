import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { orderId, printType = 'CASHIER' } = await request.json()

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        },
        establishment: true,
        table: true,
        createdBy: {
          select: { name: true }
        }
      }
    })

    if (!order) {
      return new NextResponse('Order not found', { status: 404 })
    }

    const printContent = generatePrintContent(order, printType)

    await prisma.orderPrint.create({
      data: {
        orderId: order.id,
        type: printType,
        content: printContent,
        success: true
      }
    })

    return NextResponse.json({
      success: true,
      content: printContent,
      message: 'Cupom gerado com sucesso'
    })
  } catch (error) {
    console.error('Error printing:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

function generatePrintContent(order: any, printType: string): string {
  const establishment = order.establishment
  const date = new Date(order.createdAt).toLocaleString('pt-BR')
  
  let content = `
========================================
${establishment.name.toUpperCase()}
${establishment.address || ''}
${establishment.phone || ''}
========================================

PEDIDO: ${order.orderNumber}
DATA: ${date}
OPERADOR: ${order.createdBy.name}
${order.customerName ? `CLIENTE: ${order.customerName}` : ''}
${order.table ? `MESA: ${order.table.number}` : ''}
${order.type === 'DELIVERY' ? 'TIPO: ENTREGA' : ''}

----------------------------------------
ITENS:
`
  
  order.items.forEach((item: any) => {
    content += `${item.quantity}x ${item.product.name}\n`
    content += `   R$ ${Number(item.unitPrice).toFixed(2)} = R$ ${Number(item.totalPrice).toFixed(2)}\n`
    if (item.notes) {
      content += `   OBS: ${item.notes}\n`
    }
  })
  
  content += `
----------------------------------------
SUBTOTAL: R$ ${Number(order.subtotal).toFixed(2)}
TAXA: R$ ${Number(order.tax || 0).toFixed(2)}
TOTAL: R$ ${Number(order.total).toFixed(2)}
----------------------------------------

${order.notes ? `OBSERVAÇÕES: ${order.notes}` : ''}

Obrigado pela preferência!
Volte sempre!

========================================
`
  
  return content
}
