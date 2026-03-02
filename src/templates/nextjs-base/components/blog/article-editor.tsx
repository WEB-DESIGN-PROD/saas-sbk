"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { TagInput } from "@/components/blog/tag-input"
import { MarkdownPreview } from "@/components/blog/markdown-preview"
import {
  Eye, EyeOff, Loader2, ExternalLink, Upload, X, ChevronDown, ChevronUp, CheckCircle2, XCircle,
} from "lucide-react"

function CharGauge({ value, max }: { value: number; max: number }) {
  const pct = Math.min(110, Math.round((value / max) * 100))
  const isOver = value > max
  const isGood = !isOver && value >= max * 0.8
  const barColor = isOver ? "bg-red-500" : isGood ? "bg-green-500" : "bg-amber-400"
  const textColor = isOver ? "text-red-500" : isGood ? "text-green-600" : "text-amber-500"
  return (
    <div className="space-y-1">
      <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${value === 0 ? "bg-muted" : barColor}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      <p className={`text-xs ${value === 0 ? "text-muted-foreground" : textColor}`}>
        {value}/{max} caractères
        {isOver ? ` — dépassement de ${value - max}` : isGood ? " — longueur idéale" : " — trop court"}
      </p>
    </div>
  )
}

interface Category {
  id: string
  name: string
  slug: string
  children: { id: string; name: string; slug: string }[]
}

interface Tag {
  id: string
  name: string
  slug: string
}

interface ArticleEditorProps {
  post?: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    content: string
    coverImage: string | null
    coverImageAlt: string | null
    authorName: string
    status: string
    publishedAt: string | null
    seoTitle: string | null
    seoDescription: string | null
    categoryId: string | null
    tags: Tag[]
  }
  categories: Category[]
  currentUserName: string
  basePath: string // "/admin/blog" ou "/dashboard/blog"
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
}

export function ArticleEditor({ post, categories, currentUserName, basePath }: ArticleEditorProps) {
  const router = useRouter()
  const isEdit = !!post

  // Champs
  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")
  const [slugManual, setSlugManual] = useState(isEdit)
  const [slugValid, setSlugValid] = useState<boolean | null>(null)
  const [slugChecking, setSlugChecking] = useState(false)
  const [authorName, setAuthorName] = useState(post?.authorName || currentUserName)
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [content, setContent] = useState(post?.content || "")
  const [showPreview, setShowPreview] = useState(false)
  const [coverImage, setCoverImage] = useState(post?.coverImage || "")
  const [coverImageAlt, setCoverImageAlt] = useState(post?.coverImageAlt || "")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [tags, setTags] = useState<Tag[]>(post?.tags || [])
  const [categoryId, setCategoryId] = useState(post?.categoryId || "none")
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle || "")
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription || "")
  const [showSeo, setShowSeo] = useState(false)

  const openSeo = () => {
    if (!showSeo) {
      if (!seoTitle.trim()) setSeoTitle(title.slice(0, 60))
      if (!seoDescription.trim()) setSeoDescription(excerpt.slice(0, 160))
    }
    setShowSeo(!showSeo)
  }
  const [pubMode, setPubMode] = useState<"now" | "draft" | "scheduled">(
    post?.status === "Draft" ? "draft" :
    post?.status === "Scheduled" ? "scheduled" : "now"
  )
  const [scheduledDate, setScheduledDate] = useState(
    post?.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : ""
  )
  const [saving, setSaving] = useState(false)

  // Nouvelle catégorie dialog
  const [showNewCat, setShowNewCat] = useState(false)
  const [newCatName, setNewCatName] = useState("")
  const [newCatParentId, setNewCatParentId] = useState("")
  const [localCategories, setLocalCategories] = useState<Category[]>(categories)
  const [savingCat, setSavingCat] = useState(false)

  // Auto-slug depuis le titre
  useEffect(() => {
    if (!slugManual && title) {
      setSlug(generateSlug(title))
    }
  }, [title, slugManual])

  // Vérification unicité du slug
  const checkSlug = useCallback(async (value: string) => {
    if (!value) { setSlugValid(null); return }
    setSlugChecking(true)
    try {
      const res = await fetch(`/api/blog/check-slug?slug=${encodeURIComponent(value)}${isEdit ? `&excludeId=${post!.id}` : ""}`)
      const { available } = await res.json()
      setSlugValid(available)
    } finally {
      setSlugChecking(false)
    }
  }, [isEdit, post])

  useEffect(() => {
    const t = setTimeout(() => checkSlug(slug), 400)
    return () => clearTimeout(t)
  }, [slug, checkSlug])

  // Upload image de couverture
  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/media/upload", { method: "POST", body: formData })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      setCoverImage(url)
      toast.success("Image uploadée")
    } catch {
      toast.error("Erreur lors de l'upload")
    } finally {
      setUploadingImage(false)
    }
  }

  // Création catégorie inline
  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return
    setSavingCat(true)
    try {
      const slug = generateSlug(newCatName)
      const res = await fetch("/api/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName.trim(), slug, parentId: newCatParentId || null }),
      })
      if (!res.ok) throw new Error()
      const cat = await res.json()
      // Recharger les catégories
      const catsRes = await fetch("/api/blog/categories")
      const cats = await catsRes.json()
      setLocalCategories(cats)
      setCategoryId(cat.id)
      setShowNewCat(false)
      setNewCatName("")
      setNewCatParentId("")
      toast.success("Catégorie créée")
    } catch {
      toast.error("Erreur lors de la création")
    } finally {
      setSavingCat(false)
    }
  }

  // Enregistrement
  const handleSave = async () => {
    if (!title.trim()) { toast.error("Le titre est requis"); return }
    if (!slug.trim()) { toast.error("Le slug est requis"); return }
    if (!content.trim()) { toast.error("Le contenu est requis"); return }
    if (slugValid === false) { toast.error("Ce slug est déjà utilisé"); return }

    setSaving(true)
    try {
      const status = pubMode === "draft" ? "Draft" : pubMode === "scheduled" ? "Scheduled" : "Published"
      const publishedAt = pubMode === "scheduled" ? scheduledDate : pubMode === "now" ? new Date().toISOString() : null

      const body = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        coverImage: coverImage || null,
        coverImageAlt: coverImageAlt || null,
        authorName: authorName.trim() || currentUserName,
        status,
        publishedAt,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        categoryId: categoryId === "none" ? null : categoryId || null,
        tagIds: tags.map((t) => t.id),
      }

      const url = isEdit ? `/api/blog/posts/${post!.id}` : "/api/blog/posts"
      const method = isEdit ? "PATCH" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error()
      toast.success(isEdit ? "Article mis à jour" : "Article créé")
      router.push(basePath)
      router.refresh()
    } catch {
      toast.error("Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  // Catégories aplaties pour le select
  const flatCategories: { id: string; name: string; depth: number }[] = []
  for (const cat of localCategories) {
    flatCategories.push({ id: cat.id, name: cat.name, depth: 0 })
    for (const child of cat.children || []) {
      flatCategories.push({ id: child.id, name: child.name, depth: 1 })
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Titre + Slug + Auteur */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="space-y-2">
          <Label>Titre * <span className="text-muted-foreground font-normal">(max 60 caractères)</span></Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Mon super article…"
            className="text-lg font-medium"
            maxLength={80}
          />
          <CharGauge value={title.length} max={60} />
        </div>

        <div className="space-y-2">
          <Label>Slug</Label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugManual(true) }}
                placeholder="mon-super-article"
                className="pr-8"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
                {slugChecking ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : slugValid === true ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : slugValid === false ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : null}
              </span>
            </div>
            {slugManual && (
              <Button type="button" variant="outline" size="sm" onClick={() => { setSlugManual(false); setSlug(generateSlug(title)) }}>
                Reset
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">/blog/{slug || "…"}</p>
        </div>

        <div className="space-y-2">
          <Label>Auteur</Label>
          <Input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Nom de l'auteur"
          />
        </div>
      </div>

      {/* Editeur Markdown */}
      <div className="rounded-xl border bg-card p-6 space-y-3">
        <div className="flex items-center justify-between">
          <Label>Contenu *</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)} className="gap-1.5">
            {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showPreview ? "Editer" : "Aperçu"}
          </Button>
        </div>
        {showPreview ? (
          <div className="min-h-64 rounded-md border p-4 bg-muted/30">
            <MarkdownPreview content={content} />
          </div>
        ) : (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Rédigez votre article en Markdown…"
            className="min-h-64 font-mono text-sm resize-y"
          />
        )}
        {content && (
          <p className="text-xs text-muted-foreground">
            {Math.ceil(content.split(/\s+/).length / 200)} min de lecture · {content.split(/\s+/).length} mots
          </p>
        )}
      </div>

      {/* Extrait */}
      <div className="rounded-xl border bg-card p-6 space-y-2">
        <Label>Extrait <span className="text-muted-foreground font-normal">(max 160 caractères)</span></Label>
        <Textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Résumé court affiché dans le listing…"
          className="resize-none"
          rows={3}
          maxLength={200}
        />
        <CharGauge value={excerpt.length} max={160} />
      </div>

      {/* Image de couverture */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <Label>Image de couverture</Label>
        {coverImage ? (
          <div className="relative rounded-lg overflow-hidden aspect-video w-full">
            <img src={coverImage} alt={coverImageAlt || ""} className="w-full h-full object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={() => { setCoverImage(""); setCoverImageAlt("") }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors w-full ${
              isDragging
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onClick={() => !uploadingImage && fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              const file = e.dataTransfer.files?.[0]
              if (file && file.type.startsWith("image/")) handleImageUpload(file)
              else if (file) toast.error("Seules les images sont acceptées")
            }}
          >
            {uploadingImage ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <Upload className={`h-6 w-6 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
            )}
            <span className={`text-sm transition-colors ${isDragging ? "text-primary font-medium" : "text-muted-foreground"}`}>
              {isDragging ? "Déposez l'image ici" : "Cliquer ou glisser-déposer une image"}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              disabled={uploadingImage}
            />
          </div>
        )}
        {coverImage && (
          <div className="space-y-2">
            <Label>Texte alternatif (alt)</Label>
            <Input value={coverImageAlt} onChange={(e) => setCoverImageAlt(e.target.value)} placeholder="Description de l'image…" />
          </div>
        )}
      </div>

      {/* Tags + Categorie */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="space-y-2">
          <Label>Tags</Label>
          <TagInput tags={tags} onChange={setTags} />
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Categorie</Label>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewCat(true)} className="text-xs h-7">
              + Nouvelle categorie
            </Button>
          </div>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une categorie…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune</SelectItem>
              {flatCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.depth > 0 ? `↳ ${cat.name}` : cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* SEO */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <button
          type="button"
          onClick={openSeo}
          className="flex items-center justify-between w-full"
        >
          <Label className="cursor-pointer">SEO (optionnel)</Label>
          {showSeo ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {showSeo && (
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Meta title <span className="text-muted-foreground font-normal">(max 60 caractères)</span></Label>
              <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder={title || "Meta title…"} maxLength={80} />
              <CharGauge value={seoTitle.length} max={60} />
            </div>
            <div className="space-y-2">
              <Label>Meta description <span className="text-muted-foreground font-normal">(max 160 caractères)</span></Label>
              <Textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder={excerpt || "Meta description…"} rows={2} className="resize-none" maxLength={200} />
              <CharGauge value={seoDescription.length} max={160} />
            </div>
            <div className="space-y-2">
              <Label>Meta keywords</Label>
              <Input
                value={tags.map((t) => t.name).join(", ")}
                readOnly
                placeholder="Les tags de l'article (auto-générés)"
                className="text-muted-foreground bg-muted/50 cursor-default"
              />
              <p className="text-xs text-muted-foreground">Générés automatiquement depuis les tags de l'article.</p>
            </div>
          </div>
        )}
      </div>

      {/* Publication */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <Label>Publication</Label>
        <div className="space-y-2">
          {(["now", "draft", "scheduled"] as const).map((mode) => (
            <label key={mode} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="pubMode"
                value={mode}
                checked={pubMode === mode}
                onChange={() => setPubMode(mode)}
                className="accent-primary"
              />
              <span className="text-sm">
                {mode === "now" && "Publier maintenant"}
                {mode === "draft" && "Enregistrer en brouillon"}
                {mode === "scheduled" && "Programmer"}
              </span>
            </label>
          ))}
        </div>
        {pubMode === "scheduled" && (
          <div className="space-y-2 pl-6">
            <Label>Date et heure de publication</Label>
            <Input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {isEdit && (
          <Button
            type="button"
            variant="outline"
            onClick={() => window.open(`/blog/preview/${post!.id}`, "_blank")}
            className="gap-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Aperçu
          </Button>
        )}
        <div className="flex items-center gap-3 ml-auto">
          <Button type="button" variant="outline" onClick={() => router.push(basePath)}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-1.5 min-w-32">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {saving ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer l'article"}
          </Button>
        </div>
      </div>

      {/* Dialog nouvelle categorie */}
      <Dialog open={showNewCat} onOpenChange={setShowNewCat}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle categorie</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Nom</Label>
              <Input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Ma categorie" />
            </div>
            <div className="space-y-1.5">
              <Label>Sous-categorie de (optionnel)</Label>
              <Select value={newCatParentId} onValueChange={setNewCatParentId}>
                <SelectTrigger><SelectValue placeholder="Aucune (categorie racine)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  {localCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewCat(false)}>Annuler</Button>
            <Button onClick={handleCreateCategory} disabled={savingCat || !newCatName.trim()}>
              {savingCat ? "Création…" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
