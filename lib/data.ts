import "server-only";

import { cache } from "react";
import prisma from "@/lib/prisma";

export const getSiteSettings = cache(async () => {
  return prisma.siteSettings.findUnique({ where: { id: "global" } });
});

export const getPublishedPostBySlug = cache(async (slug: string) => {
  return prisma.post.findUnique({ where: { slug, published: true } });
});
