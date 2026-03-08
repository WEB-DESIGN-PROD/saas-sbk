import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"

export async function GET() {
  const plans = await prisma.plan.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  })
  return NextResponse.json(plans)
}
