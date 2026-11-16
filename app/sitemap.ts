import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  const [posts, latestProject, settings] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true, coverImage: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.project.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
    prisma.siteSettings.findUnique({
      where: { id: "global" },
      select: { updatedAt: true },
    }),
  ]);

  const latestPost = posts[0]?.updatedAt;

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/artigos/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
    ...(post.coverImage && { images: [post.coverImage] }),
  }));

  return [
    {
      url: baseUrl,
      lastModified: latestPost ?? settings?.updatedAt,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: settings?.updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/artigos`,
      lastModified: latestPost,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projetos`,
      lastModified: latestProject?.updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...postUrls,
  ];
}
