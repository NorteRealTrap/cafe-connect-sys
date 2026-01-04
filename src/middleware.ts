import { NextRequest, NextResponse } from 'next/server'

// Simple pass-through middleware to avoid Edge runtime errors
// while the database/auth adapter may be unavailable in production.
// This keeps the site running; re-enable Auth middleware once DB is healthy.
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/auth|api/health|_next/static|_next/image|favicon.ico).*)']
}
