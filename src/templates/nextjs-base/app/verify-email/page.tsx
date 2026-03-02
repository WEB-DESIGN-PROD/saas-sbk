"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { authClient } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""
  const [isLoading, setIsLoading] = useState(false)

  const handleResend = async () => {
    if (!email) {
      toast.error("Email manquant", {
        description: "Impossible de renvoyer l'email sans adresse email.",
      })
      return
    }

    setIsLoading(true)

    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: "/dashboard",
      })

      toast.success("Email renvoyé !", {
        description: "Vérifiez votre boîte mail.",
      })
    } catch {
      toast.error("Erreur", {
        description: "Impossible de renvoyer l'email. Réessayez.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-4 text-4xl">📧</div>
        <CardTitle className="text-2xl font-bold">Vérifiez vos emails</CardTitle>
        <CardDescription>
          Un email de vérification a été envoyé
          {email ? ` à ${email}` : ""}. Cliquez sur le lien pour activer votre compte.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center text-sm text-muted-foreground">
        <p>Vous n&apos;avez pas reçu l&apos;email ? Vérifiez vos spams ou renvoyez-en un.</p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        {email && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={isLoading}
          >
            {isLoading ? "Envoi..." : "Renvoyer l'email"}
          </Button>
        )}
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <Suspense fallback={<div>Chargement...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}
