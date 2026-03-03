"use client"

import { useState, KeyboardEvent, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface TagItem {
  id: string
  name: string
  slug: string
}

interface TagInputProps {
  tags: TagItem[]
  onChange: (tags: TagItem[]) => void
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [allTags, setAllTags] = useState<TagItem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/blog/tags")
      .then((r) => r.json())
      .then((data: TagItem[]) => setAllTags(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const suggestions = allTags.filter(
    (t) =>
      inputValue.length > 0 &&
      t.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.some((tag) => tag.id === t.id)
  )

  const addTagFromSuggestion = (tag: TagItem) => {
    if (!tags.some((t) => t.id === tag.id)) {
      onChange([...tags, tag])
    }
    setInputValue("")
    setShowSuggestions(false)
  }

  const addTag = async (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    if (tags.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue("")
      return
    }
    const existing = allTags.find((t) => t.name.toLowerCase() === trimmed.toLowerCase())
    if (existing) {
      addTagFromSuggestion(existing)
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
        setAllTags((prev) => [...prev, tag])
      }
    } finally {
      setLoading(false)
      setInputValue("")
      setShowSuggestions(false)
    }
  }

  const removeTag = (id: string) => {
    onChange(tags.filter((t) => t.id !== id))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      if (suggestions.length > 0) {
        addTagFromSuggestion(suggestions[0])
      } else {
        addTag(inputValue)
      }
    }
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1].id)
    }
    if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="relative" ref={containerRef}>
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
          onChange={(e) => { setInputValue(e.target.value); setShowSuggestions(true) }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Ajouter des tags (Entrée pour valider)…" : ""}
          disabled={loading}
          className="flex-1 min-w-24 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full rounded-md border bg-popover shadow-md overflow-hidden">
          {suggestions.slice(0, 6).map((tag) => (
            <button
              key={tag.id}
              type="button"
              className="flex w-full items-center px-3 py-1.5 text-sm hover:bg-accent cursor-pointer text-left"
              onMouseDown={(e) => { e.preventDefault(); addTagFromSuggestion(tag) }}
            >
              #{tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
