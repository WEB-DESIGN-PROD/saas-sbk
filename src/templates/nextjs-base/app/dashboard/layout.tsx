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
  const { user, userId, impersonatedBy } = await verifySession()
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
