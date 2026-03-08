import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"
import { verifySession } from "@/lib/dal"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { role } = await verifySession()
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await params
  const data = await req.json()
  const page = await prisma.page.update({ where: { id }, data })
  return NextResponse.json(page)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { role } = await verifySession()
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await params
  const page = await prisma.page.findUnique({ where: { id } })
  if (page?.isDefault) return NextResponse.json({ error: "Cannot delete default page" }, { status: 400 })
  await prisma.page.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
