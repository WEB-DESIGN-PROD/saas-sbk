import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"

export async function GET() {
  const packs = await prisma.creditPack.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  })
  return NextResponse.json(packs)
}
