"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type SiteSettingsInput = {
  heroTitle: string;
  heroDescription: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
};

export async function updateSiteSettings(data: SiteSettingsInput) {
  try {
    await prisma.siteSettings.upsert({
      where: { id: "global" },
      update: {
        heroTitle: data.heroTitle,
        heroDescription: data.heroDescription,
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
        twitterUrl: data.twitterUrl,
      },
      create: {
        id: "global",
        heroTitle: data.heroTitle,
        heroDescription: data.heroDescription,
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
        twitterUrl: data.twitterUrl,
      },
    });

    revalidatePath("/");
    revalidatePath("/cms/settings");

    return { success: true };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { success: false, error: "Erro ao guardar as definições." };
  }
}
