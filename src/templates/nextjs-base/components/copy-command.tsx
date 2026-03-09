"use client"

import { useState } from "react"
import { Sparkles, Check } from "lucide-react"

export function CopyCommand({ command = "/generate-features" }: { command?: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={[
        "flex items-center gap-2.5 rounded-xl border px-4 h-12 backdrop-blur-sm transition-all duration-200 cursor-pointer select-none",
        copied
          ? "border-emerald-400/50 bg-emerald-400/[0.10]"
          : "border-emerald-400/20 bg-emerald-400/[0.04] hover:border-emerald-400/35 hover:bg-emerald-400/[0.07]",
      ].join(" ")}
    >
      <div className={[
        "flex h-5 w-5 items-center justify-center rounded-md shrink-0 transition-colors duration-200",
        copied ? "bg-emerald-400/30" : "bg-emerald-400/15",
      ].join(" ")}>
        {copied
          ? <Check className="h-3 w-3 text-emerald-400" />
          : <Sparkles className="h-3 w-3 text-emerald-400" />
        }
      </div>
      <span className="font-mono text-sm text-emerald-400">{command}</span>
      <span className={[
        "text-xs hidden sm:inline transition-colors duration-200",
        copied ? "text-emerald-400" : "text-muted-foreground",
      ].join(" ")}>
        {copied ? "Copié !" : "dans Claude Code"}
      </span>
    </button>
  )
}
