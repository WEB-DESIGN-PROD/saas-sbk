"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Feature {
  id: string
  title: string
  description: string
  icon: string | null
  active: boolean
  sortOrder: number
}

interface FeaturesManagerProps {
  initialFeatures: Feature[]
  isAdmin: boolean
}

const EMPTY: Omit<Feature, "id"> = {
  title: "", description: "", icon: null, active: true, sortOrder: 0,
}

export function FeaturesManager({ initialFeatures, isAdmin }: FeaturesManagerProps) {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Feature | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setDialogOpen(true)
  }

  function openEdit(f: Feature) {
    setEditing(f)
    setForm({ ...f })
    setDialogOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (editing) {
        const res = await fetch(`/api/admin/features/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        const updated = await res.json()
        setFeatures(features.map(f => f.id === editing.id ? updated : f))
      } else {
        const res = await fetch("/api/admin/features", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        const created = await res.json()
        setFeatures([...features, created])
      }
      setDialogOpen(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/features/${id}`, { method: "DELETE" })
    setFeatures(features.filter(f => f.id !== id))
    setDeleteId(null)
  }

  return (
    <div className="space-y-4">
      {isAdmin && (
        <div className="flex justify-end">
          <Button onClick={openCreate} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Ajouter une feature
          </Button>
        </div>
      )}

      <div className="rounded-xl border divide-y">
        {features.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">Aucune feature. Créez-en une.</p>
        )}
        {features.map((f) => (
          <div key={f.id} className="flex items-center gap-4 px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm truncate">{f.title}</p>
                {f.icon && <Badge variant="outline" className="text-xs">{f.icon}</Badge>}
                {f.active
                  ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  : <XCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                }
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{f.description}</p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">#{f.sortOrder}</span>
            {isAdmin && (
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(f)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteId(f.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier la feature" : "Nouvelle feature"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Titre</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Authentification" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Icône Lucide (nom)</Label>
                <Input value={form.icon ?? ""} onChange={e => setForm(f => ({ ...f, icon: e.target.value || null }))} placeholder="Shield" />
              </div>
              <div className="space-y-1.5">
                <Label>Ordre</Label>
                <Input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
              Active (visible sur la homepage)
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving || !form.title}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette feature ?</AlertDialogTitle>
            <AlertDialogDescription>Elle disparaîtra de la homepage.</AlertDialogDescription>
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
