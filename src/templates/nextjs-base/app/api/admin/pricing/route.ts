import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"
import { verifySession } from "@/lib/dal"

export async function GET() {
  await verifySession()
  const plans = await prisma.plan.findMany({ orderBy: { sortOrder: "asc" } })
  return NextResponse.json(plans)
}

export async function POST(req: NextRequest) {
  const { role } = await verifySession()
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const data = await req.json()
  const plan = await prisma.plan.create({ data })
  return NextResponse.json(plan, { status: 201 })
}
