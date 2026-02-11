"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Une erreur est survenue</h1>
        <p className="mb-8 text-muted-foreground">
          Nous sommes désolés, quelque chose s'est mal passé.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={() => reset()}>
            Réessayer
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  )
}
