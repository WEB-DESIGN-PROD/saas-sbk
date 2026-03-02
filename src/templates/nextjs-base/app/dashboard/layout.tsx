import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ImpersonationBanner } from "@/components/impersonation-banner"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { verifySession, getUserPlan } from "@/lib/dal"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, userId, role, impersonatedBy } = await verifySession()
  const plan = await getUserPlan(userId)

  // L'admin est redirigé vers /admin sauf s'il est en train d'impersonner un user
  if (role === "admin" && !impersonatedBy) {
    redirect("/admin")
  }

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
        hasBlog={process.env.NEXT_PUBLIC_HAS_BLOG === "true"}
      />
      <SidebarInset>
        {impersonatedBy && (
          <ImpersonationBanner userName={user.name} userEmail={user.email} />
        )}
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
