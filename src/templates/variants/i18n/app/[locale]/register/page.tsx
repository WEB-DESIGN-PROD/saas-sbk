"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/navigation"
import { useLocale } from "next-intl"
import { toast } from "sonner"
import { signUp } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GitHubButton } from "@/components/auth/github-button"

export default function RegisterPage() {
  const t = useTranslations("auth")
  const router = useRouter()
  const locale = useLocale()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error(t("error_passwords_mismatch"))
      return
    }
    if (password.length < 8) {
      toast.error(t("error_password_short"))
      return
    }

    setIsLoading(true)
    try {
      const result = await signUp.email({ email, password, name })

      if (result.error) {
        const msg = result.error.message || ""
        if (msg.includes("already exists") || msg.includes("unique")) {
          toast.error(t("error_account_exists"))
        } else {
          toast.error(t("error_generic"), { description: msg })
        }
        return
      }

      toast.success(t("success_account_created"), { description: t("success_verify_email") })
      router.push(`/verify-email?email=${encodeURIComponent(email)}`)
    } catch (error: any) {
      toast.error(t("error_generic"), { description: error?.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t("register_title")}</CardTitle>
          <CardDescription>{t("register_desc")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pb-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t("fullname")}</Label>
              <Input id="name" type="text" placeholder={t("fullname_placeholder")} value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" placeholder={t("email_placeholder")} value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} disabled={isLoading} />
              <p className="text-xs text-muted-foreground">{t("password_min")}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirm_password")}</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("creating") : t("create_btn")}
            </Button>
            <GitHubButton />
            <p className="text-center text-sm text-muted-foreground">
              {t("already_account")}{" "}
              <Link href="/login" className="font-medium underline underline-offset-4">{t("sign_in_link")}</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
