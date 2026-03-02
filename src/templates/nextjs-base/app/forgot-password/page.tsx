"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { authClient } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      })

      setSent(true)
      toast.success("Email envoyé", {
        description: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
      })
    } catch {
      // Toujours afficher le même message pour ne pas révéler si l'email existe
      setSent(true)
      toast.success("Email envoyé", {
        description: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Email envoyé</CardTitle>
            <CardDescription>
              Vérifiez votre boîte mail et cliquez sur le lien de réinitialisation.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/login" className="text-sm text-muted-foreground hover:underline">
              Retour à la connexion
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Mot de passe oublié</CardTitle>
          <CardDescription>
            Entrez votre email pour recevoir un lien de réinitialisation
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pb-6">
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
              {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="hover:underline">
                Retour à la connexion
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
