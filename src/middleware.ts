export { auth as middleware } from "@/lib/auth"

export const config = {
  // Exclude auth routes and the health endpoint so platform healthchecks don't
  // trigger Auth.js host validation. This allows the healthcheck to run
  // without authentication/middleware interference.
  matcher: ["/((?!api/auth|api/health|_next/static|_next/image|favicon.ico).*)"]
}