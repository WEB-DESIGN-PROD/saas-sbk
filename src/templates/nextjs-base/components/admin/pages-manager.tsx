"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Globe, ExternalLink, CheckCircle2, XCircle, GripVertical } from "lucide-react"
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"
import { Switch } from "@/components/ui/switch"
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

interface Page {
  id: string
  title: string
  slug: string
  content: string
  inHeader: boolean
  inFooter: boolean
  active: boolean
  isDefault: boolean
  sortOrder: number
}

interface PagesManagerProps {
  initialPages: Page[]
}

const EMPTY: Omit<Page, "id" | "sortOrder" | "isDefault"> = {
  title: "", slug: "", content: "", inHeader: false, inFooter: false, active: true,
}

function toSlug(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim()
}

async function patchPage(id: string, data: Partial<Page>) {
  await fetch(`/api/admin/pages/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
}

// Ligne mixte : défaut = toggles seulement, custom = CRUD complet
function SortableRow({ page, onEdit, onDelete, onToggle }: {
  page: Page
  onEdit: () => void
  onDelete: () => void
  onToggle: (field: "inHeader" | "inFooter", value: boolean) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: page.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 10 : undefined }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 px-4 py-3">
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground shrink-0 touch-none" tabIndex={-1}>
        <GripVertical className="h-4 w-4" />
      </button>
      <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-sm">{page.title}</p>
          {page.isDefault && <Badge variant="secondary" className="text-xs">Par défaut</Badge>}
          {!page.isDefault && (page.active
            ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
            : <XCircle className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
        </div>
      </div>

      {/* Pages par défaut : toggles Header/Footer */}
      {page.isDefault && (
        <div className="flex items-center gap-4 shrink-0">
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
            <Switch checked={page.inHeader} onCheckedChange={(v) => onToggle("inHeader", v)} className="scale-75" />
            Header
          </label>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
            <Switch checked={page.inFooter} onCheckedChange={(v) => onToggle("inFooter", v)} className="scale-75" />
            Footer
          </label>
        </div>
      )}

      <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </a>

      {/* Pages custom : édition et suppression */}
      {!page.isDefault && (
        <div className="flex gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-4 py-2 bg-muted/40 border-b">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
    </div>
  )
}

export function PagesManager({ initialPages }: PagesManagerProps) {
  const [pages, setPages] = useState<Page[]>(initialPages)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Page | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor))

  // Sections unifiées : header = toutes les pages inHeader (défaut + custom)
  const headerPages = pages.filter(p => p.inHeader)
  const footerPages = pages.filter(p => p.inFooter && !p.inHeader)
  const otherPages  = pages.filter(p => !p.inHeader && !p.inFooter && !p.isDefault)

  function makeDragEnd(group: Page[]) {
    return async (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return
      const oldIndex = group.findIndex(p => p.id === active.id)
      const newIndex = group.findIndex(p => p.id === over.id)
      const reordered = arrayMove(group, oldIndex, newIndex)
      const reorderedIds = new Set(reordered.map(p => p.id))
      setPages(prev => [...prev.filter(p => !reorderedIds.has(p.id)), ...reordered])
      await fetch("/api/admin/pages/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: reordered.map(p => p.id) }),
      })
    }
  }

  async function handleToggle(id: string, field: "inHeader" | "inFooter", value: boolean) {
    await patchPage(id, { [field]: value })
    setPages(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  function openCreate() { setEditing(null); setForm(EMPTY); setPreview(false); setDialogOpen(true) }

  function openEdit(page: Page) {
    setEditing(page)
    setForm({ title: page.title, slug: page.slug, content: page.content, inHeader: page.inHeader, inFooter: page.inFooter, active: page.active })
    setPreview(false)
    setDialogOpen(true)
  }

  function handleTitleChange(title: string) {
    setForm(f => ({ ...f, title, ...(!editing ? { slug: toSlug(title) } : {}) }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (editing) {
        const res = await fetch(`/api/admin/pages/${editing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
        })
        const updated = await res.json()
        setPages(pages.map(p => p.id === editing.id ? { ...updated, isDefault: editing.isDefault } : p))
      } else {
        const res = await fetch("/api/admin/pages", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, sortOrder: pages.length }),
        })
        const created = await res.json()
        setPages([...pages, { ...created, isDefault: false }])
      }
      setDialogOpen(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/pages/${id}`, { method: "DELETE" })
    setPages(pages.filter(p => p.id !== id))
    setDeleteId(null)
  }

  function renderSection(label: string, group: Page[], dndId: string) {
    return (
      <div>
        <SectionLabel label={label} />
        {group.length === 0 ? (
          <p className="px-4 py-4 text-center text-sm text-muted-foreground">Aucune page dans cette section.</p>
        ) : (
          <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={makeDragEnd(group)}>
            <SortableContext items={group.map(p => p.id)} strategy={verticalListSortingStrategy}>
              <div className="divide-y">
                {group.map(page => (
                  <SortableRow
                    key={page.id}
                    page={page}
                    onEdit={() => openEdit(page)}
                    onDelete={() => setDeleteId(page.id)}
                    onToggle={(field, value) => handleToggle(page.id, field, value)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Nouvelle page
        </Button>
      </div>

      <div className="rounded-xl border overflow-hidden divide-y">
        {renderSection("Dans le header", headerPages, "dnd-header")}
        {renderSection("Dans le footer", footerPages, "dnd-footer")}
        {otherPages.length > 0 && renderSection("Autres pages", otherPages, "dnd-other")}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier la page" : "Nouvelle page"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Titre</Label>
                <Input value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Mentions légales" />
              </div>
              <div className="space-y-1.5">
                <Label>Slug (URL)</Label>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-muted-foreground">/</span>
                  <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: toSlug(e.target.value) }))} placeholder="mentions-legales" />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>Contenu (Markdown)</Label>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setPreview(!preview)}>
                  {preview ? "Éditer" : "Aperçu"}
                </Button>
              </div>
              {preview ? (
                <div className="min-h-[200px] rounded-md border p-4 prose prose-sm dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm font-sans">{form.content || <span className="text-muted-foreground italic">Aucun contenu</span>}</pre>
                </div>
              ) : (
                <Textarea rows={10} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="# Titre&#10;&#10;Votre contenu en **Markdown**..." className="font-mono text-sm" />
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.inHeader} onChange={e => setForm(f => ({ ...f, inHeader: e.target.checked }))} />
                Menu header
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.inFooter} onChange={e => setForm(f => ({ ...f, inFooter: e.target.checked }))} />
                Menu footer
              </label>
              <div className="flex items-center gap-3">
                <Switch id="page-active" checked={form.active} onCheckedChange={v => setForm(f => ({ ...f, active: v }))} />
                <Label htmlFor="page-active" className="cursor-pointer">Visible</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving || !form.title || !form.slug}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette page ?</AlertDialogTitle>
            <AlertDialogDescription>La page sera supprimée et son URL ne sera plus accessible.</AlertDialogDescription>
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
