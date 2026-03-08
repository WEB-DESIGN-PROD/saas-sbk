"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, ChevronDown, GripVertical } from "lucide-react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"
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

const EMPTY: Omit<Faq, "id" | "sortOrder"> = {
  question: "", answer: "", active: true,
}

function SortableRow({
  faq, isAdmin, expanded, onToggle, onEdit, onDelete,
}: {
  faq: Faq
  isAdmin: boolean
  expanded: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: faq.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style} className="px-4 py-3 space-y-2">
      <div className="flex items-center gap-3">
        {isAdmin && (
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground shrink-0 touch-none"
            tabIndex={-1}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}
        <button
          className="flex-1 flex items-center justify-between text-left gap-2 min-w-0"
          onClick={onToggle}
        >
          <span className="font-medium text-sm truncate">{faq.question}</span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
        <Badge variant={faq.active ? "default" : "secondary"} className="text-xs shrink-0">
          {faq.active ? "Actif" : "Inactif"}
        </Badge>
        {isAdmin && (
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
      {expanded && (
        <p className="text-sm text-muted-foreground pb-1 pl-7">{faq.answer}</p>
      )}
    </div>
  )
}

export function FaqManager({ initialFaqs, isAdmin }: FaqManagerProps) {
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Faq | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor))

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = faqs.findIndex(f => f.id === active.id)
    const newIndex = faqs.findIndex(f => f.id === over.id)
    const reordered = arrayMove(faqs, oldIndex, newIndex)
    setFaqs(reordered)

    await fetch("/api/admin/faq/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: reordered.map(f => f.id) }),
    })
  }

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setDialogOpen(true)
  }

  function openEdit(faq: Faq) {
    setEditing(faq)
    setForm({ question: faq.question, answer: faq.answer, active: faq.active })
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
          body: JSON.stringify({ ...form, sortOrder: faqs.length }),
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={faqs.map(f => f.id)} strategy={verticalListSortingStrategy}>
            {faqs.map((faq) => (
              <SortableRow
                key={faq.id}
                faq={faq}
                isAdmin={isAdmin}
                expanded={expanded === faq.id}
                onToggle={() => setExpanded(expanded === faq.id ? null : faq.id)}
                onEdit={() => openEdit(faq)}
                onDelete={() => setDeleteId(faq.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
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
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
              Active (visible sur la homepage)
            </label>
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
