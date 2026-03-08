import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"

export async function GET() {
  const features = await prisma.feature.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  })
  return NextResponse.json(features)
}
