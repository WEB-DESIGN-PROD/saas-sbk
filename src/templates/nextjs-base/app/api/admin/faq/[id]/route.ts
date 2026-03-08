import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"
import { verifySession } from "@/lib/dal"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { role } = await verifySession()
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await params
  const data = await req.json()
  const faq = await prisma.faq.update({ where: { id }, data })
  return NextResponse.json(faq)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { role } = await verifySession()
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await params
  await prisma.faq.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
