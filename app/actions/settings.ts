"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { sanitizeRichText } from "@/lib/sanitize";
import { revalidatePublic } from "@/lib/revalidate";
import { firstIssue, optionalHttpUrl } from "@/lib/validation";

const settingsSchema = z.object({
  heroTitle: z.string().trim().max(500).optional(),
  heroDescription: z.string().trim().max(2000).optional(),
  aboutText: z.string().max(100_000).optional(),
  avatarUrl: optionalHttpUrl,
  githubUrl: optionalHttpUrl,
  linkedinUrl: optionalHttpUrl,
  twitterUrl: optionalHttpUrl,
  resumeUrl: optionalHttpUrl,
  emailAddress: z
    .union([z.literal(""), z.string().trim().email("Email inválido").max(191)])
    .optional()
    .transform((v) => (v ? v : null)),
});

export type SiteSettingsInput = z.input<typeof settingsSchema>;

export async function updateSiteSettings(input: SiteSettingsInput) {
  await requireAdmin();

  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const data = {
    ...parsed.data,
    aboutText: parsed.data.aboutText
      ? sanitizeRichText(parsed.data.aboutText)
      : null,
  };

  try {
    await prisma.siteSettings.upsert({
      where: { id: "global" },
      update: data,
      create: { id: "global", ...data },
    });

    revalidatePublic();
    revalidatePath("/cms/settings");

    return { success: true };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { success: false, error: "Erro ao guardar as definições." };
  }
}
