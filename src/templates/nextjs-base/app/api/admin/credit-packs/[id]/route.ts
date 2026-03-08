import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"
import { verifyAdmin } from "@/lib/dal"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await verifyAdmin()
  const { id } = await params
  const data = await req.json()
  const pack = await prisma.creditPack.update({ where: { id }, data })
  return NextResponse.json(pack)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await verifyAdmin()
  const { id } = await params
  await prisma.creditPack.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
