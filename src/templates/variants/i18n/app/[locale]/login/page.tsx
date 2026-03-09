"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { toast } from "sonner"
import { authClient } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GitHubButton } from "@/components/auth/github-button"

export default function LoginPage() {
  const t = useTranslations("auth")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await authClient.signIn.magicLink({ email, callbackURL: "/dashboard" })
      if (result.error) {
        toast.error(t("error_generic"), { description: result.error.message })
        return
      }
      setSent(true)
    } catch {
      toast.error(t("error_generic"))
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-2 text-4xl">✉️</div>
            <CardTitle className="text-2xl font-bold">{t("magic_sent_title")}</CardTitle>
            <CardDescription>{t("magic_sent_desc", { email })}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <button className="text-sm text-muted-foreground hover:underline" onClick={() => setSent(false)}>
              {t("resend_link")}
            </button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t("login_title")}</CardTitle>
          <CardDescription>{t("login_desc_magic")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pb-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" placeholder={t("email_placeholder")} value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("sending") : t("send_link")}
            </Button>
            <GitHubButton />
            <p className="text-center text-sm text-muted-foreground">
              {t("no_account")}{" "}
              <Link href="/register" className="font-medium underline underline-offset-4">{t("create_account")}</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
