import { NextRequest, NextResponse } from 'next/server'

// Attempt dynamic import of the Auth middleware at runtime.
// If importing or initializing uth fails (e.g. DB unreachable),
// fall back to a pass-through middleware so the app doesn't crash.
export default async function middleware(request: NextRequest) {
  try {
    const mod = await import('./lib/auth')
    const auth = mod?.auth
    if (auth && typeof auth.middleware === 'function') {
      // Delegate to Auth.js middleware when available
      return await auth.middleware(request)
    }
  } catch (err) {
    // Import failed or auth initialization errored (e.g. DB down)
    // allow the request to continue instead of failing the whole app
    // eslint-disable-next-line no-console
    console.error('[middleware] auth import failed, passing through:', err)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/auth|api/health|_next/static|_next/image|favicon.ico).*)']
}
