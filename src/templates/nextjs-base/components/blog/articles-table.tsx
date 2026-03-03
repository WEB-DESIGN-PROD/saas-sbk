"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Pencil, Trash2, Search, Eye, Plus, CheckCircle2, XCircle, ImageIcon, Link2, AlertTriangle } from "lucide-react"

type PostStatus = "Draft" | "Published" | "Scheduled" | "Archived" | "PendingReview"

interface PostRow {
  id: string
  title: string
  slug: string
  status: PostStatus
  coverImage: string | null
  authorName: string
  publishedAt: string | null
  readingTime: number | null
  category: { name: string } | null
  tags: { name: string }[]
}

const STATUS_LABELS: Record<PostStatus, string> = {
  Draft: "Brouillon",
  Published: "Publié",
  Scheduled: "Programmé",
  Archived: "Archivé",
  PendingReview: "En attente",
}

const STATUS_COLORS: Record<PostStatus, string> = {
  Draft: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  Published: "bg-green-500/10 text-green-600 border-green-500/20",
  Scheduled: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Archived: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  PendingReview: "bg-orange-500/10 text-orange-600 border-orange-500/20",
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
}

async function patchPostStatus(id: string, status: string) {
  const res = await fetch(`/api/blog/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error()
}

export function ArticlesTable({
  posts: initialPosts,
  basePath,
  userRole = "admin",
}: {
  posts: PostRow[]
  basePath: string
  userRole?: string
}) {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [deleteTarget, setDeleteTarget] = useState<PostRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)


  useEffect(() => {
    const handler = (e: Event) => {
      const { oldName, newName } = (e as CustomEvent).detail
      setPosts((prev) =>
        prev.map((p) =>
          p.category?.name === oldName ? { ...p, category: { name: newName } } : p
        )
      )
    }
    window.addEventListener("blog:category-renamed", handler)
    return () => window.removeEventListener("blog:category-renamed", handler)
  }, [])

  const isContributor = userRole === "contributor"
  const canValidate = !isContributor

  const filtered = posts.filter((p) => {
    const matchSearch = search
      ? p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.authorName.toLowerCase().includes(search.toLowerCase())
      : true
    const matchStatus = statusFilter === "all" ? true : p.status === statusFilter
    return matchSearch && matchStatus
  })

  // Nombre d'articles en attente pour badge
  const pendingCount = posts.filter((p) => p.status === "PendingReview").length

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/blog/${slug}`
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Lien copié dans le presse-papier")
    }).catch(() => {
      toast.error("Impossible de copier le lien")
    })
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/blog/posts/${deleteTarget.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      toast.success("Article supprimé")
      setDeleteTarget(null)
      router.refresh()
    } catch {
      toast.error("Impossible de supprimer cet article")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleValidate = async (post: PostRow) => {
    setActionLoadingId(post.id)
    try {
      await patchPostStatus(post.id, "Published")
      setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, status: "Published" } : p))
      toast.success(`"${post.title}" publié`)
      router.refresh()
    } catch {
      toast.error("Impossible de valider l'article")
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleReject = async (post: PostRow) => {
    setActionLoadingId(post.id)
    try {
      await patchPostStatus(post.id, "Draft")
      setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, status: "Draft" } : p))
      toast.success(`"${post.title}" repassé en brouillon`)
      router.refresh()
    } catch {
      toast.error("Impossible de rejeter l'article")
    } finally {
      setActionLoadingId(null)
    }
  }


  return (
    <>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un article…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-44 text-sm">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="PendingReview">
              En attente{pendingCount > 0 ? ` (${pendingCount})` : ""}
            </SelectItem>
            <SelectItem value="Draft">Brouillons</SelectItem>
            <SelectItem value="Published">Publiés</SelectItem>
            <SelectItem value="Scheduled">Programmés</SelectItem>
          </SelectContent>
        </Select>
        <Button asChild size="sm" className="h-9 gap-1.5">
          <Link href={`${basePath}/new`}>
            <Plus className="h-3.5 w-3.5" /> Nouvel article
          </Link>
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-sm">{search || statusFilter !== "all" ? "Aucun article ne correspond." : "Aucun article pour le moment."}</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">Média</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((post) => (
                <TableRow key={post.id} className={post.status === "PendingReview" ? "bg-orange-500/5" : ""}>
                  {/* Miniature image de couverture */}
                  <TableCell>
                    <div className="h-10 w-10 rounded overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                      {post.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-muted-foreground/40" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium line-clamp-1 flex-1">{post.title}</p>
                        <Badge className={`text-xs shrink-0 ${STATUS_COLORS[post.status]}`}>
                          {STATUS_LABELS[post.status]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap mt-1">
                        {post.publishedAt && (
                          <span className="text-xs text-muted-foreground">
                            {post.status === "Scheduled" ? "Programmé le" : "Publié le"} {formatDate(post.publishedAt)}
                          </span>
                        )}
                        <span className="text-muted-foreground/40 text-xs">·</span>
                        <span className="text-xs text-muted-foreground">Auteur : {post.authorName}</span>
                        {post.category ? (
                          <>
                            <span className="text-muted-foreground/40 text-xs">·</span>
                            <span className="text-xs text-muted-foreground">Catégorie : {post.category.name}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-muted-foreground/40 text-xs">·</span>
                            <span className="flex items-center gap-1 text-xs text-amber-500">
                              <AlertTriangle className="h-3 w-3" />
                              Sans catégorie
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {/* Valider / Rejeter — uniquement pour admin/co-admin/editor sur articles pending */}
                      {canValidate && post.status === "PendingReview" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-500/10"
                            title="Valider et publier"
                            disabled={actionLoadingId === post.id}
                            onClick={() => handleValidate(post)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-orange-600 hover:bg-orange-500/10"
                            title="Rejeter (retour brouillon)"
                            disabled={actionLoadingId === post.id}
                            onClick={() => handleReject(post)}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                      {post.status === "Published" && (
                        <>
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Button variant="ghost" size="icon" className="h-7 w-7" title="Voir l'article">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            title="Copier le lien"
                            onClick={() => handleCopyLink(post.slug)}
                          >
                            <Link2 className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                      <Link href={`${basePath}/${post.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(post)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog suppression article */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;article</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer <strong>{deleteTarget?.title}</strong> ?
              <br />Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
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
