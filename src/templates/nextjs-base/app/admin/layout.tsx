import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { verifyAdmin, getUserPlan } from "@/lib/dal"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, userId } = await verifyAdmin()
  const plan = await getUserPlan(userId)

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        user={user}
        accountType={plan.accountType}
        mode="admin"
        hasBlog={process.env.NEXT_PUBLIC_HAS_BLOG === "true"}
        hasStorage={process.env.NEXT_PUBLIC_HAS_STORAGE === "true"}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
