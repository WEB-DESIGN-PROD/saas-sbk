"use client"

import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success("Déconnexion réussie")
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Erreur de déconnexion:", error)
      toast.error("Échec de la déconnexion")
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      Déconnexion
    </Button>
  )
}
