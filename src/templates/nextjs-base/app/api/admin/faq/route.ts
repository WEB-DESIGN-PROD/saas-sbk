import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"
import { verifySession } from "@/lib/dal"

export async function GET() {
  await verifySession()
  const faqs = await prisma.faq.findMany({ orderBy: { sortOrder: "asc" } })
  return NextResponse.json(faqs)
}

export async function POST(req: NextRequest) {
  const { role } = await verifySession()
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const data = await req.json()
  const faq = await prisma.faq.create({ data })
  return NextResponse.json(faq, { status: 201 })
}
