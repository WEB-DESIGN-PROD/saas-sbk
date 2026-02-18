"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Upload, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

type UploadDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

type FileStatus = {
  file: File
  status: "pending" | "uploading" | "done" | "error"
  error?: string
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function UploadDialog({ open, onOpenChange, onSuccess }: UploadDialogProps) {
  const [files, setFiles] = useState<FileStatus[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset à chaque ouverture du dialog
  useEffect(() => {
    if (open) setFiles([])
  }, [open])

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
    const valid = fileArray.filter((f) => f.size <= 50 * 1024 * 1024)
    const tooLarge = fileArray.length - valid.length

    if (tooLarge > 0) {
      toast.error(`${tooLarge} fichier(s) ignoré(s) — taille max 50 MB`)
    }

    setFiles((prev) => [
      ...prev,
      ...valid.map((f) => ({ file: f, status: "pending" as const })),
    ])
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      addFiles(e.dataTransfer.files)
    },
    [addFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    const pending = files.filter((f) => f.status === "pending")
    if (pending.length === 0) return

    setIsUploading(true)
    let successCount = 0

    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== "pending") continue

      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === i ? { ...f, status: "uploading" } : f
        )
      )

      try {
        const formData = new FormData()
        formData.append("file", files[i].file)

        const res = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || "Échec de l'upload")
        }

        setFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: "done" } : f))
        )
        successCount++
      } catch (error: any) {
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: "error", error: error.message } : f
          )
        )
      }
    }

    setIsUploading(false)

    if (successCount > 0) {
      toast.success(
        `${successCount} fichier${successCount > 1 ? "s" : ""} uploadé${successCount > 1 ? "s" : ""}`
      )
      onSuccess()
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isUploading) return
    if (!nextOpen) setFiles([])
    onOpenChange(nextOpen)
  }

  const pendingCount = files.filter((f) => f.status === "pending").length

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un média</DialogTitle>
        </DialogHeader>

        {files.length === 0 ? (
          /* Zone drag-and-drop initiale */
          <div
            className={`flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-12 transition-colors cursor-pointer ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
          >
            <div className="rounded-full bg-muted p-4">
              <Upload className="size-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-medium">Glissez vos fichiers ici</p>
              <p className="text-sm text-muted-foreground">
                ou cliquez pour sélectionner
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Images, PDF, vidéos, audio… · Max 50 MB par fichier
            </p>
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
          </div>
        ) : (
          /* Liste des fichiers sélectionnés */
          <div className="flex flex-col gap-2">
            <div className="max-h-60 overflow-y-auto space-y-2">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-md border px-3 py-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{f.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatSize(f.file.size)}
                    </p>
                    {f.status === "error" && (
                      <p className="text-xs text-destructive mt-0.5">
                        {f.error}
                      </p>
                    )}
                  </div>

                  {f.status === "uploading" && (
                    <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
                  )}
                  {f.status === "done" && (
                    <CheckCircle2 className="size-4 shrink-0 text-green-500" />
                  )}
                  {f.status === "error" && (
                    <AlertCircle className="size-4 shrink-0 text-destructive" />
                  )}
                  {f.status === "pending" && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-6 shrink-0"
                      onClick={() => removeFile(i)}
                    >
                      <X className="size-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <button
              className="w-full rounded-md border-2 border-dashed border-muted-foreground/25 py-2 text-sm text-muted-foreground hover:border-muted-foreground/50 transition-colors cursor-pointer"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
            >
              + Ajouter d&apos;autres fichiers
            </button>
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isUploading}
          >
            {files.every((f) => f.status === "done") ? "Fermer" : "Annuler"}
          </Button>
          {pendingCount > 0 && (
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Upload en cours…
                </>
              ) : (
                `Uploader ${pendingCount} fichier${pendingCount > 1 ? "s" : ""}`
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
