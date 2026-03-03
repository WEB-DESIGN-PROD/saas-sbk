import { verifyStaff } from "@/lib/dal"
import { prisma } from "@/lib/db/client"
import { SectionCardsAdmin } from "@/components/admin/section-cards-admin"
import { AdminChartSignups } from "@/components/admin/admin-chart-signups"
import { AutoRefresh } from "@/components/admin/auto-refresh"

export default async function AdminPage() {
  await verifyStaff()

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const memberFilter = { role: { not: "admin" } } as const
  const staffRoles = ['co-admin', 'editor', 'contributor'] as const

  const [totalUsers, newToday, activeStaffSessions, verifiedUsers, recentSignups] = await Promise.all([
    prisma.user.count({ where: memberFilter }),
    prisma.user.count({ where: { ...memberFilter, createdAt: { gte: startOfToday } } }),
    // Sessions actives des rôles staff (hors super admin), par utilisateur distinct
    prisma.session.findMany({
      where: {
        expiresAt: { gte: now },
        user: { role: { in: [...staffRoles] } },
      },
      distinct: ['userId'],
      select: { user: { select: { role: true } } },
    }),
    prisma.user.count({ where: { ...memberFilter, emailVerified: true } }),
    prisma.user.findMany({
      where: { ...memberFilter, createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ])

  // Grouper les collaborateurs actifs par rôle
  const activeStaff: Record<string, number> = {}
  for (const s of activeStaffSessions) {
    const r = s.user.role
    activeStaff[r] = (activeStaff[r] || 0) + 1
  }

  // Grouper les inscriptions par jour
  const signupsByDay: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().split("T")[0]
    signupsByDay[key] = 0
  }
  for (const u of recentSignups) {
    const key = u.createdAt.toISOString().split("T")[0]
    if (key in signupsByDay) signupsByDay[key]++
  }
  const chartData = Object.entries(signupsByDay).map(([date, count]) => ({ date, count }))

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <AutoRefresh intervalMs={30000} />
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-2xl font-semibold">Administration</h1>
          <p className="text-muted-foreground text-sm">Vue d'ensemble des utilisateurs et de l'activité</p>
        </div>
        <SectionCardsAdmin
          totalUsers={totalUsers}
          newToday={newToday}
          activeStaff={activeStaff}
          verifiedUsers={verifiedUsers}
        />
        <div className="px-4 lg:px-6">
          <AdminChartSignups data={chartData} />
        </div>
      </div>
    </div>
  )
}
