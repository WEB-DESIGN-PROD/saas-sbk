"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signUp } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GitHubButton } from "@/components/auth/github-button"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Erreur de validation", {
        description: "Les mots de passe ne correspondent pas"
      })
      return
    }

    if (password.length < 8) {
      toast.error("Mot de passe trop court", {
        description: "Le mot de passe doit contenir au moins 8 caractères"
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("🔄 Début de l'inscription...", { email, name })

      // Inscription avec Better Auth
      const result = await signUp.email({
        email,
        password,
        name,
      })

      console.log("📦 Résultat signUp:", result)

      if (result.error) {
        console.error("❌ Erreur Better Auth:", result.error)
        console.error("Type d'erreur:", typeof result.error)
        console.error("Clés de l'erreur:", Object.keys(result.error))

        const errorMessage = result.error.message || JSON.stringify(result.error)

        // Détecter si l'utilisateur existe déjà
        if (errorMessage.includes("already exists") || errorMessage.includes("déjà") || errorMessage.includes("unique")) {
          toast.error("Compte existant", {
            description: "Un compte avec cet email existe déjà. Essayez de vous connecter."
          })
        } else if (!errorMessage || errorMessage === "{}") {
          toast.error("Erreur de configuration", {
            description: "Vérifiez que la base de données est démarrée et configurée. Consultez la console pour plus de détails."
          })
        } else {
          toast.error("Échec de l'inscription", {
            description: errorMessage
          })
        }
        return
      }

      console.log("✅ Inscription réussie, redirection...")

      toast.success("Compte créé avec succès !", {
        description: "Bienvenue ! Redirection vers le dashboard..."
      })

      // Rediriger vers le dashboard après inscription réussie
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 500)
    } catch (error: any) {
      console.error("❌ Exception lors de l'inscription:", error)
      console.error("Stack trace:", error.stack)

      toast.error("Erreur d'inscription", {
        description: error?.message || "Une erreur est survenue lors de l'inscription"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour créer votre compte
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Minimum 8 caractères
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? "Création..." : "Créer mon compte"}
            </Button>

            <GitHubButton />

            <p className="text-center text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <Link href="/login" className="font-medium underline underline-offset-4">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
