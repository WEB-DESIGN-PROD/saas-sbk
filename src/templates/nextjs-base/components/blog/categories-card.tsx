"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { FolderOpen, Plus } from "lucide-react"

const DESC_MAX = 160

function CharGauge({ value }: { value: number }) {
  const pct = Math.min(110, Math.round((value / DESC_MAX) * 100))
  const isOver = value > DESC_MAX
  const isGood = !isOver && value >= DESC_MAX * 0.8
  const barColor = isOver ? "bg-red-500" : isGood ? "bg-green-500" : "bg-amber-400"
  const textColor = isOver ? "text-red-500" : isGood ? "text-green-600" : "text-amber-500"
  if (value === 0) return null
  return (
    <div className="space-y-1">
      <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
      <p className={`text-xs ${textColor}`}>
        {value}/{DESC_MAX} caractères{isOver ? ` — dépassement de ${value - DESC_MAX}` : isGood ? " — longueur idéale" : ""}
      </p>
    </div>
  )
}

interface Category {
  id: string
  name: string
  description?: string | null
  _count: { posts: number }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function BlogCategoriesCard({
  categories: initialCategories,
  userRole = "admin",
}: {
  categories: Category[]
  userRole?: string
}) {
  const canManage = userRole !== "contributor"
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)

  // Edition via Dialog
  const [editingCat, setEditingCat] = useState<Category | null>(null)
  const [editingName, setEditingName] = useState("")
  const [editingDesc, setEditingDesc] = useState("")
  const [saving, setSaving] = useState(false)

  // Nouvelle catégorie
  const [showNewCat, setShowNewCat] = useState(false)
  const [newCatName, setNewCatName] = useState("")
  const [newCatDesc, setNewCatDesc] = useState("")
  const [savingNew, setSavingNew] = useState(false)

  const openEdit = (cat: Category) => {
    setEditingCat(cat)
    setEditingName(cat.name)
    setEditingDesc(cat.description ?? "")
  }

  const closeEdit = () => {
    setEditingCat(null)
    setEditingName("")
    setEditingDesc("")
  }

  const saveEdit = async () => {
    if (!editingCat || !editingName.trim()) return
    setSaving(true)
    try {
      const res = await fetch(`/api/blog/categories/${editingCat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingName.trim(),
          slug: generateSlug(editingName),
          description: editingDesc.trim() || null,
        }),
      })
      if (!res.ok) throw new Error()
      const oldName = editingCat.name
      const newName = editingName.trim()
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCat.id
            ? { ...c, name: newName, description: editingDesc.trim() || null }
            : c
        )
      )
      if (oldName !== newName) {
        window.dispatchEvent(new CustomEvent("blog:category-renamed", {
          detail: { oldName, newName },
        }))
      }
      toast.success("Catégorie mise à jour")
      closeEdit()
      router.refresh()
    } catch {
      toast.error("Impossible de mettre à jour la catégorie")
    } finally {
      setSaving(false)
    }
  }

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return
    setSavingNew(true)
    try {
      const res = await fetch("/api/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName.trim(), slug: generateSlug(newCatName), description: newCatDesc.trim() || null }),
      })
      if (!res.ok) throw new Error()
      const cat = await res.json()
      setCategories((prev) => [...prev, { ...cat, _count: { posts: 0 } }])
      toast.success(`Catégorie "${newCatName.trim()}" créée`)
      setShowNewCat(false)
      setNewCatName("")
      setNewCatDesc("")
      router.refresh()
    } catch {
      toast.error("Impossible de créer la catégorie")
    } finally {
      setSavingNew(false)
    }
  }

  return (
    <>
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {categories.length} catégorie{categories.length !== 1 ? "s" : ""}
            </span>
          </div>
          {canManage && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-xs"
              onClick={() => setShowNewCat(true)}
            >
              <Plus className="h-3 w-3" />
              Nouvelle catégorie
            </Button>
          )}
        </div>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune catégorie créée.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) =>
              canManage ? (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => openEdit(cat)}
                  className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-1.5 hover:border-primary/50 hover:bg-muted/60 transition-colors"
                  title="Cliquer pour modifier"
                >
                  <span className="text-sm font-medium">{cat.name}</span>
                  <Badge variant="secondary" className="text-xs tabular-nums">
                    {cat._count.posts}
                  </Badge>
                </button>
              ) : (
                <div
                  key={cat.id}
                  className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-1.5"
                >
                  <span className="text-sm font-medium">{cat.name}</span>
                  <Badge variant="secondary" className="text-xs tabular-nums">
                    {cat._count.posts}
                  </Badge>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Dialog édition */}
      <Dialog open={!!editingCat} onOpenChange={(open) => { if (!open) closeEdit() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription>Modifiez le nom et la description de cette catégorie.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                placeholder="Nom de la catégorie"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); saveEdit() } }}
              />
            </div>
            <div className="space-y-2">
              <Label>Description <span className="text-muted-foreground font-normal">(max {DESC_MAX} caractères)</span></Label>
              <Textarea
                value={editingDesc}
                onChange={(e) => setEditingDesc(e.target.value)}
                placeholder="Décrivez cette catégorie…"
                rows={3}
                className="resize-none"
                maxLength={DESC_MAX + 20}
              />
              <CharGauge value={editingDesc.length} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEdit} disabled={saving}>
              Annuler
            </Button>
            <Button
              onClick={saveEdit}
              disabled={saving || !editingName.trim() || editingDesc.length > DESC_MAX}
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog création */}
      <Dialog open={showNewCat} onOpenChange={(open) => { if (!open) { setShowNewCat(false); setNewCatName(""); setNewCatDesc("") } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle catégorie</DialogTitle>
            <DialogDescription>Créez une catégorie pour organiser vos articles.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Ma catégorie"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label>Description <span className="text-muted-foreground font-normal">(max {DESC_MAX} caractères)</span></Label>
              <Textarea
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Décrivez cette catégorie…"
                rows={3}
                className="resize-none"
                maxLength={DESC_MAX + 20}
              />
              <CharGauge value={newCatDesc.length} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowNewCat(false); setNewCatName(""); setNewCatDesc("") }} disabled={savingNew}>
              Annuler
            </Button>
            <Button onClick={handleCreateCategory} disabled={savingNew || !newCatName.trim() || newCatDesc.length > DESC_MAX}>
              {savingNew ? "Création…" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
