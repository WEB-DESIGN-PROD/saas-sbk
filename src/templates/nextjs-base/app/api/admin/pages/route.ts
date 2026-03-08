import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"
import { verifySession } from "@/lib/dal"

export async function GET() {
  const { role } = await verifySession()
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const pages = await prisma.page.findMany({ orderBy: { sortOrder: "asc" } })
  return NextResponse.json(pages)
}

export async function POST(req: NextRequest) {
  const { role } = await verifySession()
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const data = await req.json()
  const page = await prisma.page.create({ data })
  return NextResponse.json(page, { status: 201 })
}
