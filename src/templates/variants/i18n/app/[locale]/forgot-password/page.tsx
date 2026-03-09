"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { useLocale } from "next-intl"
import { toast } from "sonner"
import { authClient } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const t = useTranslations("auth")
  const locale = useLocale()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: `/${locale}/reset-password`,
      })
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
            <CardTitle className="text-2xl font-bold">{t("forgot_sent_title")}</CardTitle>
            <CardDescription>{t("forgot_sent_desc")}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link href="/login" className="text-sm text-muted-foreground hover:underline">{t("forgot_back")}</Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t("forgot_title")}</CardTitle>
          <CardDescription>{t("forgot_desc")}</CardDescription>
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
              {isLoading ? t("forgot_sending") : t("forgot_submit")}
            </Button>
            <Link href="/login" className="text-sm text-muted-foreground hover:underline">{t("forgot_back")}</Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
