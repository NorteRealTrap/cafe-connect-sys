import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      establishments: any[]
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    establishments?: any[]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    establishments?: any[]
  }
}
