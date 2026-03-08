"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, ChevronDown } from "lucide-react"
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

interface Faq {
  id: string
  question: string
  answer: string
  active: boolean
  sortOrder: number
}

interface FaqManagerProps {
  initialFaqs: Faq[]
  isAdmin: boolean
}

const EMPTY: Omit<Faq, "id"> = {
  question: "", answer: "", active: true, sortOrder: 0,
}

export function FaqManager({ initialFaqs, isAdmin }: FaqManagerProps) {
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Faq | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setDialogOpen(true)
  }

  function openEdit(faq: Faq) {
    setEditing(faq)
    setForm({ ...faq })
    setDialogOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (editing) {
        const res = await fetch(`/api/admin/faq/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        const updated = await res.json()
        setFaqs(faqs.map(f => f.id === editing.id ? updated : f))
      } else {
        const res = await fetch("/api/admin/faq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        const created = await res.json()
        setFaqs([...faqs, created])
      }
      setDialogOpen(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/faq/${id}`, { method: "DELETE" })
    setFaqs(faqs.filter(f => f.id !== id))
    setDeleteId(null)
  }

  return (
    <div className="space-y-4">
      {isAdmin && (
        <div className="flex justify-end">
          <Button onClick={openCreate} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Ajouter une FAQ
          </Button>
        </div>
      )}

      <div className="rounded-xl border divide-y">
        {faqs.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">Aucune FAQ. Créez-en une.</p>
        )}
        {faqs.map((faq) => (
          <div key={faq.id} className="px-4 py-3 space-y-2">
            <div className="flex items-center gap-3">
              <button
                className="flex-1 flex items-center justify-between text-left gap-2 min-w-0"
                onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
              >
                <span className="font-medium text-sm truncate">{faq.question}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${expanded === faq.id ? "rotate-180" : ""}`} />
              </button>
              <Badge variant={faq.active ? "default" : "secondary"} className="text-xs shrink-0">
                {faq.active ? "Actif" : "Inactif"}
              </Badge>
              {isAdmin && (
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(faq)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteId(faq.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
            {expanded === faq.id && (
              <p className="text-sm text-muted-foreground pl-0 pb-1">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier la FAQ" : "Nouvelle FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Question</Label>
              <Input value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Réponse</Label>
              <Textarea rows={4} value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Ordre</Label>
                <Input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                  Active (visible sur la homepage)
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving || !form.question || !form.answer}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette FAQ ?</AlertDialogTitle>
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
