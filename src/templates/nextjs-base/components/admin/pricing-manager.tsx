"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Plan {
  id: string
  name: string
  price: number
  currency: string
  period: string | null
  description: string
  features: string[]
  cta: string
  href: string
  popular: boolean
  active: boolean
  sortOrder: number
}

interface PricingManagerProps {
  initialPlans: Plan[]
  isAdmin: boolean
}

const EMPTY_PLAN: Omit<Plan, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  price: 0,
  currency: "EUR",
  period: "month",
  description: "",
  features: [],
  cta: "Commencer",
  href: "/register",
  popular: false,
  active: true,
  sortOrder: 0,
}

function formatPrice(price: number, currency: string, period: string | null) {
  if (price === -1) return "Sur mesure"
  if (price === 0) return "Gratuit"
  const formatted = (price / 100).toFixed(2).replace(".00", "") + "€"
  return period ? `${formatted}/${period === "month" ? "mois" : "an"}` : formatted
}

export function PricingManager({ initialPlans, isAdmin }: PricingManagerProps) {
  const [plans, setPlans] = useState<Plan[]>(initialPlans)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Plan | null>(null)
  const [form, setForm] = useState(EMPTY_PLAN)
  const [featuresText, setFeaturesText] = useState("")
  const [saving, setSaving] = useState(false)

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_PLAN)
    setFeaturesText("")
    setDialogOpen(true)
  }

  function openEdit(plan: Plan) {
    setEditing(plan)
    setForm({ ...plan })
    setFeaturesText(plan.features.join("\n"))
    setDialogOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    const payload = { ...form, features: featuresText.split("\n").map(s => s.trim()).filter(Boolean) }
    try {
      if (editing) {
        const res = await fetch(`/api/admin/pricing/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const updated = await res.json()
        setPlans(plans.map(p => p.id === editing.id ? updated : p))
      } else {
        const res = await fetch("/api/admin/pricing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const created = await res.json()
        setPlans([...plans, created])
      }
      setDialogOpen(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/pricing/${id}`, { method: "DELETE" })
    setPlans(plans.filter(p => p.id !== id))
    setDeleteId(null)
  }

  return (
    <div className="space-y-4">
      {isAdmin && (
        <div className="flex justify-end">
          <Button onClick={openCreate} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un plan
          </Button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-xl border bg-card p-5 space-y-3 ${plan.popular ? "border-primary shadow-md" : ""}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-2 left-4 text-xs">
                <Star className="mr-1 h-3 w-3" /> Populaire
              </Badge>
            )}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              {isAdmin && (
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(plan)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteId(plan.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
            <p className="text-2xl font-bold">{formatPrice(plan.price, plan.currency, plan.period)}</p>
            <ul className="space-y-1.5">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
            <div className="pt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant={plan.active ? "default" : "secondary"}>{plan.active ? "Actif" : "Inactif"}</Badge>
              <span>Ordre : {plan.sortOrder}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog création / édition */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier le plan" : "Nouveau plan"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Nom</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Pro" />
              </div>
              <div className="space-y-1.5">
                <Label>Prix (centimes, -1 = sur mesure)</Label>
                <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Période (month / year / vide)</Label>
                <Input value={form.period ?? ""} onChange={e => setForm(f => ({ ...f, period: e.target.value || null }))} placeholder="month" />
              </div>
              <div className="space-y-1.5">
                <Label>Ordre d'affichage</Label>
                <Input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Features (une par ligne)</Label>
              <Textarea rows={5} value={featuresText} onChange={e => setFeaturesText(e.target.value)} placeholder={"Projets illimités\nSupport prioritaire"} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Texte du bouton</Label>
                <Input value={form.cta} onChange={e => setForm(f => ({ ...f, cta: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>URL du bouton</Label>
                <Input value={form.href} onChange={e => setForm(f => ({ ...f, href: e.target.value }))} />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.popular} onChange={e => setForm(f => ({ ...f, popular: e.target.checked }))} />
                Populaire
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                Actif
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving || !form.name}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm suppression */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce plan ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
