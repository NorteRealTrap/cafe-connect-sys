import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Redirecionar para login se não autenticado
    if (!token && pathname.startsWith('/dashboard')) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', req.url)
      return NextResponse.redirect(loginUrl)
    }

    // Proteção de rotas baseada em roles
    if (token) {
      // Apenas ADMIN e MANAGER podem acessar configurações e estoque
      if (
        (pathname.startsWith('/dashboard/admin') || 
         pathname.startsWith('/dashboard/stock') ||
         pathname.startsWith('/dashboard/establishments')) && 
        !['ADMIN', 'MANAGER'].includes(token.role)
      ) {
        return new NextResponse('Acesso negado', { status: 403 })
      }

      // Apenas ADMIN pode acessar usuários
      if (pathname.startsWith('/dashboard/users') && token.role !== 'ADMIN') {
        return new NextResponse('Acesso negado', { status: 403 })
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Rotas públicas
        const publicPaths = ['/login', '/register', '/api/auth']
        if (publicPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
          return true
        }

        // Rotas protegidas
        return !!token
      }
    }
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    '/login',
    '/register'
  ]
}