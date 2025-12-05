# API Route Patterns

## NextAuth v4 Pattern (CURRENT)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Your logic here
}
```

## Database Access

```typescript
import { prisma } from '@/lib/prisma'

const data = await prisma.model.findMany({
  where: { isActive: true }
})
```

## Field Names
- Use `isActive` NOT `active` for Product/Category models
- Use `totalPrice` NOT `subtotal` for OrderItem
- Use `number` as STRING for Table model
- Use `orderNumber` and `createdById` for Order model

## Status Enums
- TableStatus: AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE
- OrderStatus: PENDING, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED
