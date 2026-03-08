import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"
import { verifyAdmin } from "@/lib/dal"

export async function PATCH(req: Request) {
  await verifyAdmin()
  const { order } = await req.json() as { order: string[] }

  await Promise.all(
    order.map((id, index) =>
      prisma.faq.update({ where: { id }, data: { sortOrder: index } })
    )
  )

  return NextResponse.json({ ok: true })
}
