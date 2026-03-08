"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Loader2 } from "lucide-react"

type Status = "idle" | "loading" | "success" | "error"

export default function ContactPage() {
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
        setErrorMsg(data.error || "Une erreur est survenue.")
        setStatus("error")
      } else {
        setStatus("success")
      }
    } catch {
      setErrorMsg("Une erreur est survenue. Veuillez réessayer.")
      setStatus("error")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto max-w-xl px-4 py-24">
          <div className="mb-10 text-center">
            <h1 className="mb-3 text-4xl font-bold tracking-tight">Contactez-nous</h1>
            <p className="text-muted-foreground">
              Une question, une suggestion ? Nous vous répondons sous 24h.
            </p>
          </div>

          {status === "success" ? (
            <div className="flex flex-col items-center gap-4 rounded-xl border bg-card px-8 py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <h2 className="text-xl font-semibold">Message envoyé !</h2>
              <p className="text-muted-foreground text-sm">
                Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
              </p>
              <Button variant="outline" className="mt-2" onClick={() => { setStatus("idle"); setForm({ name: "", email: "", subject: "", message: "" }) }}>
                Envoyer un autre message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    placeholder="Jean Dupont"
                    value={form.name}
                    onChange={e => update("name", e.target.value)}
                    required
                    disabled={status === "loading"}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jean@exemple.com"
                    value={form.email}
                    onChange={e => update("email", e.target.value)}
                    required
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subject">Sujet</Label>
                <Input
                  id="subject"
                  placeholder="Votre sujet..."
                  value={form.subject}
                  onChange={e => update("subject", e.target.value)}
                  required
                  disabled={status === "loading"}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Décrivez votre demande..."
                  rows={6}
                  value={form.message}
                  onChange={e => update("message", e.target.value)}
                  required
                  disabled={status === "loading"}
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-destructive">{errorMsg}</p>
              )}

              <Button type="submit" className="w-full" disabled={status === "loading"}>
                {status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {status === "loading" ? "Envoi en cours…" : "Envoyer le message"}
              </Button>
            </form>
          )}
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 {{PROJECT_NAME}}. Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}
