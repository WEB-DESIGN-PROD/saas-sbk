import { verifyAdmin } from "@/lib/dal"
import { prisma } from "@/lib/db/client"
import { UsersTable } from "@/components/admin/users-table"

export default async function AdminUsersPage() {
  await verifyAdmin()

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      emailVerified: true,
      role: true,
      accountType: true,
      subscriptionPlan: true,
      extraCredits: true,
      createdAt: true,
      sessions: {
        orderBy: { updatedAt: "desc" },
        take: 1,
        select: { updatedAt: true },
      },
    },
  })

  // Sérialiser les dates pour le client
  const serialized = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    sessions: u.sessions.map((s) => ({ updatedAt: s.updatedAt.toISOString() })),
  }))

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-2xl font-semibold">Utilisateurs</h1>
          <p className="text-muted-foreground text-sm">
            {users.length} compte{users.length !== 1 ? "s" : ""} enregistré{users.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="px-4 lg:px-6">
          <UsersTable users={serialized} />
        </div>
      </div>
    </div>
  )
}
