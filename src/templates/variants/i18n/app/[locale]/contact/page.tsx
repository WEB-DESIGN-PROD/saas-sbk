"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Loader2, Sparkles, Send } from "lucide-react"

type Status = "idle" | "loading" | "success" | "error"

export default function ContactPage() {
  const t = useTranslations("contact")
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  function update(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || t("error_generic"))
        setStatus("error")
      } else {
        setStatus("success")
      }
    } catch {
      setErrorMsg(t("error_retry"))
      setStatus("error")
    }
  }

  return (
    <section className="container mx-auto max-w-xl px-4 py-28">

      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="badge-beam mb-8 inline-flex">
          <div className="badge-beam-ring" />
          <div className="badge-beam-inner gap-2 px-4 py-1.5 text-sm">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {t("hero_badge")}
            </span>
          </div>
        </div>

        <h1 className="mb-4 text-5xl font-bold tracking-tight">
          <span className="block bg-gradient-to-b from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent pb-1">
            {t("hero_title")}
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">
          {t("hero_subtitle")}
        </p>
      </div>

      {status === "success" ? (
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] px-8 py-14 text-center backdrop-blur-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/[0.12] ring-1 ring-emerald-400/[0.25]">
            <CheckCircle2 className="h-7 w-7 text-emerald-400" />
          </div>
          <div>
            <h2 className="mb-2 text-xl font-semibold">{t("success_title")}</h2>
            <p className="text-muted-foreground text-sm">
              {t("success_message")}
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-2 border-white/[0.08] hover:border-white/[0.15]"
            onClick={() => { setStatus("idle"); setForm({ name: "", email: "", subject: "", message: "" }) }}
          >
            {t("success_again")}
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm space-y-5"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm text-muted-foreground">{t("name")}</Label>
              <Input
                id="name"
                placeholder={t("name_placeholder")}
                value={form.name}
                onChange={e => update("name", e.target.value)}
                required
                disabled={status === "loading"}
                className="border-white/[0.08] bg-white/[0.03] focus:border-emerald-400/30 focus:ring-emerald-400/10 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-muted-foreground">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("email_placeholder")}
                value={form.email}
                onChange={e => update("email", e.target.value)}
                required
                disabled={status === "loading"}
                className="border-white/[0.08] bg-white/[0.03] focus:border-emerald-400/30 focus:ring-emerald-400/10 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject" className="text-sm text-muted-foreground">{t("subject")}</Label>
            <Input
              id="subject"
              placeholder={t("subject_placeholder")}
              value={form.subject}
              onChange={e => update("subject", e.target.value)}
              required
              disabled={status === "loading"}
              className="border-white/[0.08] bg-white/[0.03] focus:border-emerald-400/30 focus:ring-emerald-400/10 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-sm text-muted-foreground">{t("message")}</Label>
            <Textarea
              id="message"
              placeholder={t("message_placeholder")}
              rows={6}
              value={form.message}
              onChange={e => update("message", e.target.value)}
              required
              disabled={status === "loading"}
              className="border-white/[0.08] bg-white/[0.03] focus:border-emerald-400/30 focus:ring-emerald-400/10 transition-colors resize-none"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-destructive">{errorMsg}</p>
          )}

          <Button
            type="submit"
            className="w-full gap-2 shadow-lg hover:shadow-[0_0_30px_hsl(var(--primary)/30%)] transition-all duration-300"
            disabled={status === "loading"}
          >
            {status === "loading"
              ? <><Loader2 className="h-4 w-4 animate-spin" />{t("sending")}</>
              : <><Send className="h-4 w-4" />{t("submit")}</>
            }
          </Button>
        </form>
      )}

    </section>
  )
}
