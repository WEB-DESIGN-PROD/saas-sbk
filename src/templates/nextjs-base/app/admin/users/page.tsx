import { verifyRole } from "@/lib/dal"
import { prisma } from "@/lib/db/client"
import { UsersTable } from "@/components/admin/users-table"
import { InviteUserButton } from "@/components/admin/invite-user-button"
import { RolesPermissionsCard } from "@/components/admin/roles-permissions-card"

export default async function AdminUsersPage() {
  const { role, userId } = await verifyRole(['admin', 'co-admin'])

  const [users, invitations] = await Promise.all([
    prisma.user.findMany({
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
    }),
    prisma.invitation.findMany({
      where: { accepted: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const serializedUsers = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    sessions: u.sessions.map((s) => ({ updatedAt: s.updatedAt.toISOString() })),
  }))

  const serializedInvitations = invitations.map((inv) => ({
    ...inv,
    expiresAt: inv.expiresAt.toISOString(),
    createdAt: inv.createdAt.toISOString(),
  }))

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-2xl font-semibold">Utilisateurs</h1>
            <p className="text-muted-foreground text-sm">
              {users.length} compte{users.length !== 1 ? "s" : ""} enregistré{users.length !== 1 ? "s" : ""}
            </p>
          </div>
          {role === 'admin' && <InviteUserButton />}
        </div>
        {/* Rappel des rôles & permissions */}
        <div className="px-4 lg:px-6">
          <RolesPermissionsCard />
        </div>

        <div className="px-4 lg:px-6">
          <UsersTable users={serializedUsers} invitations={serializedInvitations} currentUserId={userId} currentUserRole={role} />
        </div>
      </div>
    </div>
  )
}
