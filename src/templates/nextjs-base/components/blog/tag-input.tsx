"use client"

import { useState, KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface TagInputProps {
  tags: { id: string; name: string; slug: string }[]
  onChange: (tags: { id: string; name: string; slug: string }[]) => void
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)

  const addTag = async (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    // Vérifie si déjà présent
    if (tags.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue("")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/blog/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      })
      if (res.ok) {
        const tag = await res.json()
        onChange([...tags, tag])
      }
    } finally {
      setLoading(false)
      setInputValue("")
    }
  }

  const removeTag = (id: string) => {
    onChange(tags.filter((t) => t.id !== id))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(inputValue)
    }
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1].id)
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5 rounded-md border border-input bg-background px-3 py-2 min-h-9 focus-within:ring-1 focus-within:ring-ring">
      {tags.map((tag) => (
        <Badge key={tag.id} variant="secondary" className="gap-1 pr-1 text-xs">
          #{tag.name}
          <button type="button" onClick={() => removeTag(tag.id)} className="rounded-full hover:bg-muted-foreground/20 p-0.5">
            <X className="h-2.5 w-2.5" />
          </button>
        </Badge>
      ))}
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? "Ajouter des tags (Entrée pour valider)…" : ""}
        disabled={loading}
        className="flex-1 min-w-24 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
      />
    </div>
  )
}
