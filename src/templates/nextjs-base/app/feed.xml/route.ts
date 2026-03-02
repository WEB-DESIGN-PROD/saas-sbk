import { prisma } from "@/lib/db/client"
import { NextResponse } from "next/server"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Mon SaaS"

export async function GET() {
  const now = new Date()

  const posts = await prisma.post.findMany({
    where: { status: "Published", publishedAt: { lte: now } },
    orderBy: { publishedAt: "desc" },
    take: 20,
    select: {
      title: true, slug: true, excerpt: true,
      authorName: true, publishedAt: true,
    },
  })

  const items = posts
    .map((post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${APP_URL}/blog/${post.slug}</link>
      <guid>${APP_URL}/blog/${post.slug}</guid>
      ${post.excerpt ? `<description><![CDATA[${post.excerpt}]]></description>` : ""}
      <author>${post.authorName}</author>
      ${post.publishedAt ? `<pubDate>${post.publishedAt.toUTCString()}</pubDate>` : ""}
    </item>`)
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${APP_NAME} — Blog</title>
    <link>${APP_URL}/blog</link>
    <description>Derniers articles de ${APP_NAME}</description>
    <language>fr</language>
    <atom:link href="${APP_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
