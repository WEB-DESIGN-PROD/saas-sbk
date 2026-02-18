"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import {
  Upload,
  Trash2,
  ImageIcon,
  FileText,
  Film,
  Music,
  File,
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

function MediaPreview({
  type,
  url,
  name,
}: {
  type: string
  url: string
  name: string
}) {
  if (type === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
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

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [deletingKey, setDeletingKey] = useState<string | null>(null)

  const loadMedia = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/media")
      if (!res.ok) throw new Error("Failed to load")
      const data = await res.json()
      setMedia(data)
    } catch {
      toast.error("Impossible de charger les médias")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMedia()
  }, [loadMedia])

  const handleDelete = async (key: string, name: string) => {
    setDeletingKey(key)
    try {
      const res = await fetch(
        `/api/media?key=${encodeURIComponent(key)}`,
        { method: "DELETE" }
      )
      if (!res.ok) throw new Error("Delete failed")
      setMedia((prev) => prev.filter((m) => m.key !== key))
      toast.success(`"${name}" supprimé`)
    } catch {
      toast.error("Impossible de supprimer le fichier")
    } finally {
      setDeletingKey(null)
    }
  }

  return (
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

        {/* Grille squelette pendant le chargement */}
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
              const isDeleting = deletingKey === item.key

              return (
                <div key={item.key} className="group relative space-y-1">
                  <div className="aspect-square overflow-hidden rounded-lg border bg-muted relative">
                    <MediaPreview type={type} url={item.url} name={item.name} />

                    {/* Overlay au survol */}
                    <div
                      className={`absolute inset-0 rounded-lg bg-black/60 transition-opacity flex items-center justify-center ${
                        isDeleting ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {isDeleting ? (
                        <div className="size-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Button
                          size="icon"
                          variant="destructive"
                          className="size-8"
                          onClick={() => handleDelete(item.key, item.name)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
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

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSuccess={() => {
          setUploadOpen(false)
          loadMedia()
        }}
      />
    </div>
  )
}
