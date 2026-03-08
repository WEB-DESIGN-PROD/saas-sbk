import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"
import { verifySession, verifyAdmin } from "@/lib/dal"

export async function GET() {
  await verifySession()
  const packs = await prisma.creditPack.findMany({ orderBy: { sortOrder: "asc" } })
  return NextResponse.json(packs)
}

export async function POST(req: Request) {
  await verifyAdmin()
  const data = await req.json()
  const pack = await prisma.creditPack.create({ data })
  return NextResponse.json(pack)
}
