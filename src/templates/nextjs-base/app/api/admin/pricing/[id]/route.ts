import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"
import { verifySession } from "@/lib/dal"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { role } = await verifySession()
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await params
  const data = await req.json()
  const plan = await prisma.plan.update({ where: { id }, data })
  return NextResponse.json(plan)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { role } = await verifySession()
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await params
  await prisma.plan.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
