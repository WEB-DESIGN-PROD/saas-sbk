import { prisma } from "@/lib/db/client"
import { Navbar as NavbarClient } from "./navbar-client"

export async function Navbar() {
  const headerPages = await prisma.page.findMany({
    where: { inHeader: true, active: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, title: true, slug: true },
  })

  return <NavbarClient headerPages={headerPages} />
}
