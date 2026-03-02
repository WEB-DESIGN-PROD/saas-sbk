"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { authClient } from "@/lib/auth/client"
import { LogOut, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImpersonationBannerProps {
  userName: string | null
  userEmail: string
}

export function ImpersonationBanner({ userName, userEmail }: ImpersonationBannerProps) {
  const router = useRouter()
  const [isLeaving, setIsLeaving] = useState(false)

  const handleStop = async () => {
    setIsLeaving(true)
    try {
      await (authClient as any).admin.stopImpersonating()
      router.push("/admin")
      router.refresh()
    } finally {
      setIsLeaving(false)
    }
  }

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm">
        <UserCheck className="h-4 w-4 text-amber-500 shrink-0" />
        <span className="text-amber-700 dark:text-amber-400">
          Connecté en tant que{" "}
          <strong>{userName || userEmail}</strong>
          <span className="ml-1 text-amber-600/70 dark:text-amber-500/70">
            ({userEmail})
          </span>
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleStop}
        disabled={isLeaving}
        className="shrink-0 border-amber-500/40 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400"
      >
        <LogOut className="mr-1.5 h-3.5 w-3.5" />
        {isLeaving ? "Retour..." : "Quitter la vue"}
      </Button>
    </div>
  )
}
