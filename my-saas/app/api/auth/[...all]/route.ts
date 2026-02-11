import { auth } from "@/lib/auth/config"
import { toNextJsHandler } from "better-auth/next-js"

// Export des handlers Better Auth pour Next.js App Router
// toNextJsHandler convertit l'instance Better Auth en handlers Next.js compatibles
export const { GET, POST } = toNextJsHandler(auth)
