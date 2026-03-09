"use client"

import { useState, Suspense } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { authClient } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

function VerifyEmailContent() {
  const t = useTranslations("auth")
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""
  const [isLoading, setIsLoading] = useState(false)

  const handleResend = async () => {
    if (!email) {
      toast.error(t("error_generic"))
      return
    }
    setIsLoading(true)
    try {
      await authClient.sendVerificationEmail({ email, callbackURL: "/dashboard" })
      toast.success(t("verify_success"), { description: t("verify_success_desc") })
    } catch {
      toast.error(t("verify_error"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-4 text-4xl">📧</div>
        <CardTitle className="text-2xl font-bold">{t("verify_title")}</CardTitle>
        <CardDescription>{t("verify_desc", { email: email ? ` à ${email}` : "" })}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center text-sm text-muted-foreground">
        <p>{t("verify_no_email")}</p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        {email && (
          <Button variant="outline" className="w-full" onClick={handleResend} disabled={isLoading}>
            {isLoading ? t("verify_resending") : t("verify_resend")}
          </Button>
        )}
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="hover:underline">{t("verify_back")}</Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <Suspense fallback={<div>...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}
