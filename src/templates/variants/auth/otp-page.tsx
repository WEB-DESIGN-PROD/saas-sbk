"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authClient } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function OtpPage() {
  const router = useRouter()
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      })

      if (result.error) {
        toast.error("Erreur", {
          description: result.error.message || "Impossible d'envoyer le code",
        })
        return
      }

      setStep("otp")
      toast.success("Code envoyé !", {
        description: `Un code de vérification a été envoyé à ${email}`,
      })
    } catch {
      toast.error("Erreur", {
        description: "Une erreur est survenue. Réessayez.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await authClient.signIn.emailOtp({
        email,
        otp,
      })

      if (result.error) {
        toast.error("Code invalide", {
          description: result.error.message || "Le code est incorrect ou a expiré",
        })
        return
      }

      toast.success("Connexion réussie !", {
        description: "Redirection vers le dashboard...",
      })

      router.push("/dashboard")
    } catch {
      toast.error("Erreur", {
        description: "Une erreur est survenue. Réessayez.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (step === "otp") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Entrez votre code</CardTitle>
            <CardDescription>
              Un code à 6 chiffres a été envoyé à {email}. Il expire dans 10 minutes.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleVerifyOtp}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Code de vérification</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  className="text-center text-2xl tracking-widest font-mono"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || otp.length < 6}
              >
                {isLoading ? "Vérification..." : "Vérifier le code"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-sm"
                onClick={() => { setStep("email"); setOtp("") }}
              >
                Changer d&apos;adresse email
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Connexion par code</CardTitle>
          <CardDescription>
            Entrez votre email pour recevoir un code de vérification à 6 chiffres
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSendOtp}>
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
              {isLoading ? "Envoi en cours..." : "Recevoir le code"}
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
