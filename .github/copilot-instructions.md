# AI Coding Agent Instructions for Cafe Connect System

## Project Overview
This is a **full-stack web application** built with:
- **Next.js 14**: Server-side rendering and API routes (App Router)
- **React**: UI components
- **TypeScript**: Type-safe development
- **Prisma**: ORM for database access
- **NextAuth.js v5**: Authentication and authorization
- **shadcn-ui**: Component library
- **Tailwind CSS**: Utility-first CSS styling
- **Zod**: Schema validation

## Key Directories and Files
- `src/app/`: Next.js App Router
  - `src/app/api/`: Backend API routes (all protected by authentication)
  - `src/app/[pages]/`: Frontend pages and layouts
- `src/components/`: Feature-specific React components
- `src/ui/`: Reusable shadcn-ui components
- `src/hooks/`: Custom React hooks
- `src/lib/`: Utilities
  - `src/lib/auth.ts`: NextAuth configuration and handlers
  - `src/lib/prisma.ts`: Prisma client
  - `src/lib/validations/`: Zod schemas
- `src/middleware.ts`: NextAuth middleware for route protection
- `prisma/`: Database schema and migrations
- `.env`: Environment variables (NEXTAUTH_SECRET, DATABASE_URL, etc.)
- `vite.config.ts`: Vite configuration (if used)
- `tailwind.config.ts`: Tailwind CSS configuration

## ⚠️ CRITICAL: API Route Authentication Pattern

**EVERY API route MUST follow this exact pattern:**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs' // REQUIRED for bcryptjs

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Your logic here
  return NextResponse.json({ data })
}
```

### Key Rules for API Routes:
1. ✅ Always import `auth` from `@/lib/auth`
2. ✅ Always add `export const runtime = 'nodejs'` (required for bcryptjs)
3. ✅ Always check session: `const session = await auth()`
4. ✅ Always return `NextResponse.json()` for responses
5. ❌ NEVER use `getServerSession()` - it's deprecated in NextAuth v5
6. ❌ NEVER import `authOptions` directly in routes
7. ❌ NEVER use `getServerSession(authOptions)`

## Authentication Setup

- **File**: `src/lib/auth.ts`
- **Exports**: `{ handlers, auth, authOptions }`
- **Route Handler**: `src/app/api/auth/[...nextauth]/route.ts`
- **Middleware**: `src/middleware.ts`
- **Strategy**: JWT (JSON Web Tokens)
- **Provider**: Credentials (email/password with bcryptjs)
- **Session Duration**: 30 days

## Developer Workflows

### Local Development
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm run start
```

### Database Management
```bash
npx prisma migrate dev        # Create and apply migrations
npx prisma generate           # Generate Prisma Client
npx prisma studio             # Open Prisma Studio UI
```

### Linting
```bash
npm run lint
```

## Project-Specific Conventions

- **Component Structure**: Organized by feature in `src/components/`
- **Styling**: Tailwind CSS with utility-first approach
- **State Management**: React Context API (no external library)
- **Validation**: Zod schemas in `src/lib/validations/`
- **Error Handling**: Try-catch blocks with proper HTTP status codes
- **TypeScript**: Strict mode enabled - use proper types always

## Common Patterns

### Checking Authentication in a Component
```typescript
'use client'

import { useSession } from 'next-auth/react'

export function MyComponent() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <div>Loading...</div>
  if (!session) return <div>Access Denied</div>
  
  return <div>Welcome, {session.user.email}</div>
}
```

### Fetching Data from API Routes
```typescript
const response = await fetch('/api/orders?establishmentId=123')
if (!response.ok) throw new Error('Failed to fetch')
const data = await response.json()
```

### Creating a Protected API Route
See pattern above in "API Route Authentication Pattern"

### Database Queries
```typescript
// Always use prisma from '@/lib/prisma'
import { prisma } from '@/lib/prisma'

const items = await prisma.table.findMany({
  where: { establishmentId },
  include: { /* relationships */ }
})
```

## Environment Variables Required

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here (generate with: openssl rand -base64 32)
DATABASE_URL=postgresql://user:password@localhost:5432/cafe-connect
```

## Important Files to NEVER Modify Incorrectly

- `src/lib/auth.ts`: Core authentication configuration
- `src/app/api/auth/[...nextauth]/route.ts`: NextAuth route handler
- `src/middleware.ts`: Route protection middleware
- `prisma/schema.prisma`: Database schema

## Notes for AI Agents

1. **Always verify imports** - Use `auth` from `@/lib/auth`, not `getServerSession`
2. **API routes require authentication** - Check session first in every route
3. **Follow NextAuth v5 syntax** - Use `await auth()` pattern
4. **Add `runtime = 'nodejs'`** - Required for all API routes using bcryptjs
5. **Maintain consistency** - Follow existing code patterns
6. **Type safety first** - Always use TypeScript strictly
7. **Database access** - Always use Prisma from `@/lib/prisma`

For further details, consult the project maintainers.