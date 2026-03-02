"use client"

import { useState } from "react"
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
import { Pencil, Trash2, Search, Eye, Plus } from "lucide-react"

type PostStatus = "Draft" | "Published" | "Scheduled" | "Archived"

interface PostRow {
  id: string
  title: string
  slug: string
  status: PostStatus
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
}

const STATUS_COLORS: Record<PostStatus, string> = {
  Draft: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  Published: "bg-green-500/10 text-green-600 border-green-500/20",
  Scheduled: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Archived: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
}

export function ArticlesTable({ posts: initialPosts, basePath }: { posts: PostRow[]; basePath: string }) {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [deleteTarget, setDeleteTarget] = useState<PostRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = posts.filter((p) => {
    const matchSearch = search
      ? p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.authorName.toLowerCase().includes(search.toLowerCase())
      : true
    const matchStatus = statusFilter === "all" ? true : p.status === statusFilter
    return matchSearch && matchStatus
  })

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
          <SelectTrigger className="h-9 w-40 text-sm">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="Draft">Brouillons</SelectItem>
            <SelectItem value="Published">Publiés</SelectItem>
            <SelectItem value="Scheduled">Programmés</SelectItem>
            <SelectItem value="Archived">Archivés</SelectItem>
          </SelectContent>
        </Select>
        <Link href={`${basePath}/new`}>
          <Button size="sm" className="h-9 gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Nouvel article
          </Button>
        </Link>
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
                <TableHead>Titre</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Lecture</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{post.title}</p>
                      <p className="text-xs text-muted-foreground">/blog/{post.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{post.authorName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">{post.category?.name || "—"}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${STATUS_COLORS[post.status]}`}>
                      {STATUS_LABELS[post.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {post.publishedAt ? formatDate(post.publishedAt) : "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {post.readingTime ? `${post.readingTime} min` : "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {post.status === "Published" && (
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
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

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'article</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer <strong>{deleteTarget?.title}</strong> ?
              <br />Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
