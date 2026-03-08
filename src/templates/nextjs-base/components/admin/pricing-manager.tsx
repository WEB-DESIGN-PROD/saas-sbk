"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  createdAt: string
  updatedAt: string
}

interface CreditPack {
  id: string
  name: string
  credits: number
  price: number
  currency: string
  description: string
  active: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

interface PricingManagerProps {
  initialPlans: Plan[]
  initialCreditPacks: CreditPack[]
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

const EMPTY_PACK: Omit<CreditPack, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  credits: 100,
  price: 990,
  currency: "EUR",
  description: "",
  active: true,
  sortOrder: 0,
}

function formatPrice(price: number, currency: string, period?: string | null) {
  if (price === -1) return "Sur mesure"
  if (price === 0) return "Gratuit"
  const formatted = (price / 100).toFixed(2).replace(".00", "") + "€"
  if (!period) return formatted
  return `${formatted}/${period === "month" ? "mois" : "an"}`
}

export function PricingManager({ initialPlans, initialCreditPacks, isAdmin }: PricingManagerProps) {
  // Plans state
  const [plans, setPlans] = useState<Plan[]>(initialPlans)
  const [planDialog, setPlanDialog] = useState(false)
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [planForm, setPlanForm] = useState(EMPTY_PLAN)
  const [featuresText, setFeaturesText] = useState("")
  const [savingPlan, setSavingPlan] = useState(false)

  // Credit packs state
  const [packs, setPacks] = useState<CreditPack[]>(initialCreditPacks)
  const [packDialog, setPackDialog] = useState(false)
  const [deletePackId, setDeletePackId] = useState<string | null>(null)
  const [editingPack, setEditingPack] = useState<CreditPack | null>(null)
  const [packForm, setPackForm] = useState(EMPTY_PACK)
  const [savingPack, setSavingPack] = useState(false)

  // --- Plans handlers ---
  function openCreatePlan() {
    setEditingPlan(null)
    setPlanForm(EMPTY_PLAN)
    setFeaturesText("")
    setPlanDialog(true)
  }
  function openEditPlan(plan: Plan) {
    setEditingPlan(plan)
    setPlanForm({ ...plan })
    setFeaturesText(plan.features.join("\n"))
    setPlanDialog(true)
  }
  async function handleSavePlan() {
    setSavingPlan(true)
    const payload = { ...planForm, features: featuresText.split("\n").map(s => s.trim()).filter(Boolean) }
    try {
      if (editingPlan) {
        const res = await fetch(`/api/admin/pricing/${editingPlan.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        })
        const updated = await res.json()
        setPlans(plans.map(p => p.id === editingPlan.id ? updated : p))
      } else {
        const res = await fetch("/api/admin/pricing", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        })
        const created = await res.json()
        setPlans([...plans, created])
      }
      setPlanDialog(false)
    } finally {
      setSavingPlan(false)
    }
  }
  async function handleDeletePlan(id: string) {
    await fetch(`/api/admin/pricing/${id}`, { method: "DELETE" })
    setPlans(plans.filter(p => p.id !== id))
    setDeletePlanId(null)
  }

  // --- Credit packs handlers ---
  function openCreatePack() {
    setEditingPack(null)
    setPackForm(EMPTY_PACK)
    setPackDialog(true)
  }
  function openEditPack(pack: CreditPack) {
    setEditingPack(pack)
    setPackForm({ ...pack })
    setPackDialog(true)
  }
  async function handleSavePack() {
    setSavingPack(true)
    try {
      if (editingPack) {
        const res = await fetch(`/api/admin/credit-packs/${editingPack.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(packForm),
        })
        const updated = await res.json()
        setPacks(packs.map(p => p.id === editingPack.id ? updated : p))
      } else {
        const res = await fetch("/api/admin/credit-packs", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(packForm),
        })
        const created = await res.json()
        setPacks([...packs, created])
      }
      setPackDialog(false)
    } finally {
      setSavingPack(false)
    }
  }
  async function handleDeletePack(id: string) {
    await fetch(`/api/admin/credit-packs/${id}`, { method: "DELETE" })
    setPacks(packs.filter(p => p.id !== id))
    setDeletePackId(null)
  }

  return (
    <Tabs defaultValue="plans">
      <TabsList className="mb-4">
        <TabsTrigger value="plans">Plans d&apos;abonnement</TabsTrigger>
        <TabsTrigger value="credits">Packs de crédits</TabsTrigger>
      </TabsList>

      {/* ---- PLANS ---- */}
      <TabsContent value="plans" className="space-y-4">
        {isAdmin && (
          <div className="flex justify-end">
            <Button onClick={openCreatePlan} size="sm">
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
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditPlan(plan)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeletePlanId(plan.id)}>
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
      </TabsContent>

      {/* ---- CREDIT PACKS ---- */}
      <TabsContent value="credits" className="space-y-4">
        {isAdmin && (
          <div className="flex justify-end">
            <Button onClick={openCreatePack} size="sm">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un pack
            </Button>
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack) => (
            <div key={pack.id} className="rounded-xl border bg-card p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{pack.name}</h3>
                  <p className="text-sm text-muted-foreground">{pack.description}</p>
                </div>
                {isAdmin && (
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditPack(pack)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeletePackId(pack.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">{formatPrice(pack.price, pack.currency)}</p>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" /> {pack.credits} crédits
                </span>
              </div>
              <div className="pt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant={pack.active ? "default" : "secondary"}>{pack.active ? "Actif" : "Inactif"}</Badge>
                <span>Ordre : {pack.sortOrder}</span>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* Dialog plan */}
      <Dialog open={planDialog} onOpenChange={setPlanDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Modifier le plan" : "Nouveau plan"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Nom</Label>
                <Input value={planForm.name} onChange={e => setPlanForm(f => ({ ...f, name: e.target.value }))} placeholder="Pro" />
              </div>
              <div className="space-y-1.5">
                <Label>Prix (centimes, -1 = sur mesure)</Label>
                <Input type="number" value={planForm.price} onChange={e => setPlanForm(f => ({ ...f, price: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Période (month / year / vide)</Label>
                <Input value={planForm.period ?? ""} onChange={e => setPlanForm(f => ({ ...f, period: e.target.value || null }))} placeholder="month" />
              </div>
              <div className="space-y-1.5">
                <Label>Ordre d&apos;affichage</Label>
                <Input type="number" value={planForm.sortOrder} onChange={e => setPlanForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input value={planForm.description} onChange={e => setPlanForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Features (une par ligne)</Label>
              <Textarea rows={5} value={featuresText} onChange={e => setFeaturesText(e.target.value)} placeholder={"Projets illimités\nSupport prioritaire"} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Texte du bouton</Label>
                <Input value={planForm.cta} onChange={e => setPlanForm(f => ({ ...f, cta: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>URL du bouton</Label>
                <Input value={planForm.href} onChange={e => setPlanForm(f => ({ ...f, href: e.target.value }))} />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={planForm.popular} onChange={e => setPlanForm(f => ({ ...f, popular: e.target.checked }))} />
                Populaire
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={planForm.active} onChange={e => setPlanForm(f => ({ ...f, active: e.target.checked }))} />
                Actif
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlanDialog(false)}>Annuler</Button>
            <Button onClick={handleSavePlan} disabled={savingPlan || !planForm.name}>
              {savingPlan ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog credit pack */}
      <Dialog open={packDialog} onOpenChange={setPackDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPack ? "Modifier le pack" : "Nouveau pack de crédits"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Nom</Label>
                <Input value={packForm.name} onChange={e => setPackForm(f => ({ ...f, name: e.target.value }))} placeholder="Starter" />
              </div>
              <div className="space-y-1.5">
                <Label>Crédits inclus</Label>
                <Input type="number" value={packForm.credits} onChange={e => setPackForm(f => ({ ...f, credits: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Prix (centimes)</Label>
                <Input type="number" value={packForm.price} onChange={e => setPackForm(f => ({ ...f, price: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Ordre d&apos;affichage</Label>
                <Input type="number" value={packForm.sortOrder} onChange={e => setPackForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input value={packForm.description} onChange={e => setPackForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={packForm.active} onChange={e => setPackForm(f => ({ ...f, active: e.target.checked }))} />
              Actif
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPackDialog(false)}>Annuler</Button>
            <Button onClick={handleSavePack} disabled={savingPack || !packForm.name}>
              {savingPack ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm suppression plan */}
      <AlertDialog open={!!deletePlanId} onOpenChange={() => setDeletePlanId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce plan ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletePlanId && handleDeletePlan(deletePlanId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm suppression pack */}
      <AlertDialog open={!!deletePackId} onOpenChange={() => setDeletePackId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce pack ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletePackId && handleDeletePack(deletePackId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  )
}
