import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === "/login" || path === "/" || path.startsWith("/api/auth")
  const token = request.cookies.get("next-auth.session-token") || request.cookies.get("__Secure-next-auth.session-token")
  if (!isPublicPath && !token) { return NextResponse.redirect(new URL("/login", request.url)) }
  if (path === "/login" && token) { return NextResponse.redirect(new URL("/dashboard", request.url)) }
  return NextResponse.next()
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"] }
