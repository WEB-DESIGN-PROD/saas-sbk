import { verifyStaff } from "@/lib/dal"
import { prisma } from "@/lib/db/client"
import { FaqManager } from "@/components/admin/faq-manager"

export default async function AdminFaqPage() {
  const { role } = await verifyStaff()

  const faqs = await prisma.faq.findMany({ orderBy: { sortOrder: "asc" } })
  const serialized = faqs.map(f => ({
    ...f,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  }))

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-2xl font-semibold">FAQ</h1>
          <p className="text-muted-foreground text-sm">
            Questions fréquentes affichées sur la homepage
            {role !== "admin" && " — lecture seule"}
          </p>
        </div>
        <div className="px-4 lg:px-6">
          <FaqManager initialFaqs={serialized} isAdmin={role === "admin"} />
        </div>
      </div>
    </div>
  )
}
