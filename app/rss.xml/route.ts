import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fabiocalixto.com";

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Fábio Calixto</title>
      <link>${baseUrl}</link>
      <description>Artigos sobre engenharia de software, design e construção de produtos.</description>
      <language>pt-PT</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      ${posts
        .map(
          (post) => `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <link>${baseUrl}/artigos/${post.slug}</link>
          <guid>${baseUrl}/artigos/${post.slug}</guid>
          <pubDate>${post.createdAt.toUTCString()}</pubDate>
          <description><![CDATA[${post.excerpt || ""}]]></description>
        </item>`,
        )
        .join("")}
    </channel>
  </rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
