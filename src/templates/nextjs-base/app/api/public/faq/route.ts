import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"

export async function GET() {
  const faqs = await prisma.faq.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  })
  return NextResponse.json(faqs)
}
