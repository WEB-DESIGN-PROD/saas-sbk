"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { authClient } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function MagicLinkPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await authClient.signIn.magicLink({
        email,
        callbackURL: "/dashboard",
      })

      if (result.error) {
        toast.error("Erreur", {
          description: result.error.message || "Impossible d'envoyer le lien de connexion",
        })
        return
      }

      setSent(true)
      toast.success("Lien envoyé !", {
        description: "Vérifiez votre boîte mail et cliquez sur le lien.",
      })
    } catch {
      toast.error("Erreur", {
        description: "Une erreur est survenue. Réessayez.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 text-4xl">✨</div>
            <CardTitle className="text-2xl font-bold">Lien envoyé !</CardTitle>
            <CardDescription>
              Un lien de connexion a été envoyé à {email}. Il expire dans 15 minutes.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <p className="text-center text-sm text-muted-foreground w-full">
              <Link href="/login" className="hover:underline">
                Retour à la connexion
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Connexion sans mot de passe</CardTitle>
          <CardDescription>
            Entrez votre email pour recevoir un lien de connexion magique
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Envoi en cours..." : "Envoyer le lien magique"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Préférez un mot de passe ?{" "}
              <Link href="/login" className="font-medium underline underline-offset-4">
                Connexion classique
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
