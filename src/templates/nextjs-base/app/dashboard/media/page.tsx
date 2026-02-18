"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Upload,
  Trash2,
  ImageIcon,
  FileText,
  Film,
  Music,
  File,
  Eye,
  Pencil,
  X,
  Download,
  Loader2,
} from "lucide-react"
import { UploadDialog } from "@/components/media/upload-dialog"

type MediaItem = {
  key: string
  name: string
  size: number
  lastModified: string
  url: string
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileType(
  name: string
): "image" | "video" | "audio" | "pdf" | "other" {
  const ext = name.split(".").pop()?.toLowerCase() || ""
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "bmp"].includes(ext))
    return "image"
  if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext)) return "video"
  if (["mp3", "wav", "ogg", "m4a", "flac"].includes(ext)) return "audio"
  if (ext === "pdf") return "pdf"
  return "other"
}

function MediaPreview({ type, url, name }: { type: string; url: string; name: string }) {
  if (type === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt={name} className="w-full h-full object-cover" loading="lazy" />
    )
  }
  const iconMap: Record<string, React.ElementType> = {
    video: Film,
    audio: Music,
    pdf: FileText,
    other: File,
  }
  const Icon = iconMap[type] || File
  return (
    <div className="flex items-center justify-center h-full bg-muted/50">
      <Icon className="size-10 text-muted-foreground" />
    </div>
  )
}

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({
  item,
  onClose,
}: {
  item: MediaItem
  onClose: () => void
}) {
  const type = getFileType(item.name)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  // Bloquer le scroll du body
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Bouton fermer */}
      <button
        className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors cursor-pointer z-10"
        onClick={onClose}
      >
        <X className="size-8" />
      </button>

      {/* Nom du fichier + taille */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
        <p className="text-white/80 text-sm font-medium">{item.name}</p>
        <p className="text-white/40 text-xs">{formatSize(item.size)}</p>
      </div>

      {type === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.url}
          alt={item.name}
          className="max-h-[88vh] max-w-[92vw] object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        /* Fichiers non-image : icône + bouton télécharger */
        <div
          className="flex flex-col items-center gap-6 p-14 rounded-2xl bg-white/8 backdrop-blur"
          onClick={(e) => e.stopPropagation()}
        >
          {type === "video" && <Film className="size-24 text-white/40" />}
          {type === "audio" && <Music className="size-24 text-white/40" />}
          {type === "pdf" && <FileText className="size-24 text-white/40" />}
          {type === "other" && <File className="size-24 text-white/40" />}
          <p className="text-white text-xl font-semibold">{item.name}</p>
          <p className="text-white/50 text-sm">{formatSize(item.size)}</p>
          <a
            href={item.url}
            download={item.name}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-full font-medium text-sm hover:bg-white/90 transition-colors"
          >
            <Download className="size-4" />
            Télécharger
          </a>
        </div>
      )}
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)

  // Lightbox
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null)

  // Suppression avec confirmation
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Renommage
  const [renameTarget, setRenameTarget] = useState<MediaItem | null>(null)
  const [newName, setNewName] = useState("")
  const [isRenaming, setIsRenaming] = useState(false)
  const renameInputRef = useRef<HTMLInputElement>(null)

  const loadMedia = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/media")
      if (!res.ok) throw new Error("Failed to load")
      setMedia(await res.json())
    } catch {
      toast.error("Impossible de charger les médias")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMedia()
  }, [loadMedia])

  // Focus auto sur l'input de renommage
  useEffect(() => {
    if (renameTarget) {
      setTimeout(() => renameInputRef.current?.focus(), 50)
    }
  }, [renameTarget])

  // ── Suppression ──────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const res = await fetch(
        `/api/media?key=${encodeURIComponent(deleteTarget.key)}`,
        { method: "DELETE" }
      )
      if (!res.ok) throw new Error()
      setMedia((prev) => prev.filter((m) => m.key !== deleteTarget.key))
      toast.success(`"${deleteTarget.name}" supprimé`)
      setDeleteTarget(null)
    } catch {
      toast.error("Impossible de supprimer le fichier")
    } finally {
      setIsDeleting(false)
    }
  }

  // ── Renommage ─────────────────────────────────────────────────────────────
  const confirmRename = async () => {
    if (!renameTarget || !newName.trim() || isRenaming) return
    setIsRenaming(true)
    try {
      const res = await fetch("/api/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: renameTarget.key, newName: newName.trim() }),
      })
      if (!res.ok) throw new Error()
      const { key, url } = await res.json()
      setMedia((prev) =>
        prev.map((m) =>
          m.key === renameTarget.key
            ? { ...m, key, name: newName.trim(), url }
            : m
        )
      )
      toast.success("Fichier renommé")
      setRenameTarget(null)
    } catch {
      toast.error("Impossible de renommer le fichier")
    } finally {
      setIsRenaming(false)
    }
  }

  return (
    <>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">

          {/* En-tête */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Médias</h1>
              <p className="text-muted-foreground text-sm">
                {isLoading
                  ? "Chargement…"
                  : `${media.length} fichier${media.length !== 1 ? "s" : ""} dans votre bibliothèque`}
              </p>
            </div>
            <Button onClick={() => setUploadOpen(true)}>
              <Upload className="mr-2 size-4" />
              Ajouter un média
            </Button>
          </div>

          {/* Squelette */}
          {isLoading && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-square animate-pulse rounded-lg bg-muted" />
                  <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-2 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          )}

          {/* État vide */}
          {!isLoading && media.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="rounded-full bg-muted p-6">
                  <ImageIcon className="size-12 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-lg">Aucun média pour l&apos;instant</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Uploadez des images, vidéos, PDF ou autres fichiers
                  </p>
                </div>
                <Button onClick={() => setUploadOpen(true)} variant="outline">
                  <Upload className="mr-2 size-4" />
                  Ajouter un premier média
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Grille des médias */}
          {!isLoading && media.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {media.map((item) => {
                const type = getFileType(item.name)

                return (
                  <div key={item.key} className="group relative space-y-1">
                    <div className="aspect-square overflow-hidden rounded-lg border bg-muted relative">
                      <MediaPreview type={type} url={item.url} name={item.name} />

                      {/* Overlay actions au survol */}
                      <div className="absolute inset-0 rounded-lg bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        {/* Voir (lightbox) */}
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-28 h-7 text-xs gap-1.5"
                          onClick={() => setLightboxItem(item)}
                        >
                          <Eye className="size-3" />
                          Voir
                        </Button>

                        {/* Renommer */}
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-28 h-7 text-xs gap-1.5"
                          onClick={() => {
                            setRenameTarget(item)
                            setNewName(item.name)
                          }}
                        >
                          <Pencil className="size-3" />
                          Renommer
                        </Button>

                        {/* Supprimer */}
                        <Button
                          size="sm"
                          variant="destructive"
                          className="w-28 h-7 text-xs gap-1.5"
                          onClick={() => setDeleteTarget(item)}
                        >
                          <Trash2 className="size-3" />
                          Supprimer
                        </Button>
                      </div>
                    </div>

                    <p className="truncate text-xs font-medium leading-tight px-0.5">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground px-0.5">
                      {formatSize(item.size)}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Upload dialog ─────────────────────────────────────────────────── */}
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSuccess={() => {
          setUploadOpen(false)
          loadMedia()
        }}
      />

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
      {lightboxItem && (
        <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
      )}

      {/* ── Dialog confirmation suppression ───────────────────────────────── */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && !isDeleting && setDeleteTarget(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Supprimer ce fichier ?</DialogTitle>
            <DialogDescription>
              <span className="font-medium text-foreground">
                &ldquo;{deleteTarget?.name}&rdquo;
              </span>{" "}
              sera définitivement supprimé de votre stockage. Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Suppression…
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 size-4" />
                  Supprimer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog renommage ──────────────────────────────────────────────── */}
      <Dialog
        open={!!renameTarget}
        onOpenChange={(open) => !open && !isRenaming && setRenameTarget(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Renommer le fichier</DialogTitle>
            <DialogDescription>
              Entrez le nouveau nom pour ce fichier.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rename-input">Nouveau nom</Label>
            <Input
              id="rename-input"
              ref={renameInputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmRename()
                if (e.key === "Escape") setRenameTarget(null)
              }}
              disabled={isRenaming}
              placeholder={renameTarget?.name}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameTarget(null)}
              disabled={isRenaming}
            >
              Annuler
            </Button>
            <Button
              onClick={confirmRename}
              disabled={!newName.trim() || isRenaming}
            >
              {isRenaming ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Renommage…
                </>
              ) : (
                "Renommer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
