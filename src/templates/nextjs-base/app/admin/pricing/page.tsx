import { verifyStaff } from "@/lib/dal"
import { prisma } from "@/lib/db/client"
import { PricingManager } from "@/components/admin/pricing-manager"

export default async function AdminPricingPage() {
  const { role } = await verifyStaff()

  const [plans, creditPacks] = await Promise.all([
    prisma.plan.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.creditPack.findMany({ orderBy: { sortOrder: "asc" } }),
  ])

  const serializedPlans = plans.map(p => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  const serializedPacks = creditPacks.map(p => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Tarifs</h1>
              <p className="text-muted-foreground text-sm">
                Plans et packs de crédits affichés sur la page publique /pricing
                {role !== "admin" && " — lecture seule"}
              </p>
            </div>
          </div>
        </div>
        <div className="px-4 lg:px-6">
          <PricingManager
            initialPlans={serializedPlans}
            initialCreditPacks={serializedPacks}
            isAdmin={role === "admin"}
          />
        </div>
      </div>
    </div>
  )
}
