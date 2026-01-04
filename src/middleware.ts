// Re-enable Auth.js middleware. `trustHost: true` is set in `src/lib/auth.ts`
// to allow platform internal hostnames (e.g. Railway proxies).
export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: ["/((?!api/auth|api/health|_next/static|_next/image|favicon.ico).*)"]
}