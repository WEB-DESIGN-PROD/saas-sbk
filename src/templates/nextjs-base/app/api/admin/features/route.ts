import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"
import { verifySession } from "@/lib/dal"

export async function GET() {
  await verifySession()
  const features = await prisma.feature.findMany({ orderBy: { sortOrder: "asc" } })
  return NextResponse.json(features)
}

export async function POST(req: NextRequest) {
  const { role } = await verifySession()
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const data = await req.json()
  const feature = await prisma.feature.create({ data })
  return NextResponse.json(feature, { status: 201 })
}
