"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Trash2, Pencil, Plus, FolderOpen } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  parentId: string | null
  children: { id: string; name: string; slug: string; _count?: { posts: number } }[]
  _count?: { posts: number }
}

function generateSlug(name: string) {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 60)
}

export function CategoryManager({ categories: initialCategories }: { categories: Category[] }) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [showDialog, setShowDialog] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [parentId, setParentId] = useState("none")
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const openCreate = () => {
    setEditing(null); setName(""); setSlug(""); setParentId("none"); setShowDialog(true)
  }
  const openEdit = (cat: Category) => {
    setEditing(cat); setName(cat.name); setSlug(cat.slug); setParentId(cat.parentId || "none"); setShowDialog(true)
  }

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      const finalSlug = slug.trim() || generateSlug(name)
      const body = { name: name.trim(), slug: finalSlug, parentId: parentId === "none" ? null : parentId || null }
      const res = editing
        ? await fetch(`/api/blog/categories/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        : await fetch("/api/blog/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error()
      toast.success(editing ? "Categorie modifiee" : "Categorie creee")
      setShowDialog(false)
      router.refresh()
      // Recharger
      const catsRes = await fetch("/api/blog/categories")
      setCategories(await catsRes.json())
    } catch {
      toast.error("Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await fetch(`/api/blog/categories/${deleteTarget.id}`, { method: "DELETE" })
      toast.success("Categorie supprimee")
      setDeleteTarget(null)
      const catsRes = await fetch("/api/blog/categories")
      setCategories(await catsRes.json())
      router.refresh()
    } catch {
      toast.error("Impossible de supprimer")
    } finally {
      setIsDeleting(false)
    }
  }

  const rootCats = categories.filter((c) => !c.parentId)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Categories</h2>
          <p className="text-sm text-muted-foreground">{categories.length} categorie{categories.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Nouvelle categorie
        </Button>
      </div>

      {rootCats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
          <FolderOpen className="h-8 w-8 opacity-30" />
          <p className="text-sm">Aucune categorie pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rootCats.map((cat) => (
            <div key={cat.id} className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{cat.name}</span>
                  <Badge variant="outline" className="text-xs font-mono">{cat.slug}</Badge>
                  {cat._count && <span className="text-xs text-muted-foreground">{cat._count.posts} article{cat._count.posts !== 1 ? "s" : ""}</span>}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(cat)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              {cat.children.length > 0 && (
                <div className="pl-4 space-y-1 border-l ml-2">
                  {cat.children.map((child) => (
                    <div key={child.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">↳ {child.name}</span>
                        <Badge variant="outline" className="text-xs font-mono">{child.slug}</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(child as any)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => setDeleteTarget({ id: child.id, name: child.name })}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dialog create/edit */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier la categorie" : "Nouvelle categorie"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Nom *</Label>
              <Input value={name} onChange={(e) => { setName(e.target.value); if (!editing) setSlug(generateSlug(e.target.value)) }} placeholder="Ma categorie" />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="ma-categorie" />
            </div>
            <div className="space-y-1.5">
              <Label>Sous-categorie de (optionnel)</Label>
              <Select value={parentId} onValueChange={setParentId}>
                <SelectTrigger><SelectValue placeholder="Aucune (categorie racine)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  {rootCats.filter((c) => c.id !== editing?.id).map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving || !name.trim()}>
              {saving ? "Enregistrement…" : editing ? "Modifier" : "Creer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog delete */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la categorie</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Supprimer <strong>{deleteTarget?.name}</strong> ? Les articles de cette categorie ne seront pas supprimes mais n'auront plus de categorie.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Suppression…" : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
