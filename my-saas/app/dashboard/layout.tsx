import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

// Layout minimal SANS vérification auth
// L'auth est gérée par le proxy.ts
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Données utilisateur en dur pour le moment (pour test)
  const user = {
    name: "Utilisateur",
    email: "user@example.com",
    image: null,
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user} />
      <SidebarInset>
        <main className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
