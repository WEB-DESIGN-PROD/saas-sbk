import { redirect } from "next/navigation"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { verifySession } from "@/lib/dal"

import data from "./data.json"

export default async function Page() {
  const { role, impersonatedBy } = await verifySession()

  // L'admin est redirigé vers /admin sauf s'il est en train d'impersonner un user
  if (role === "admin" && !impersonatedBy) {
    redirect("/admin")
  }
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable data={data} />
      </div>
    </div>
  )
}
