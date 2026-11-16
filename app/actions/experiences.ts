"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { sanitizeRichText } from "@/lib/sanitize";
import { revalidatePublic } from "@/lib/revalidate";
import { firstIssue, idSchema, optionalHttpUrl } from "@/lib/validation";

const experienceSchema = z.object({
  id: idSchema.optional(),
  company: z.string().trim().min(1, "A empresa é obrigatória.").max(191),
  role: z.string().trim().min(1, "O cargo é obrigatório.").max(191),
  startDate: z
    .string()
    .trim()
    .min(1, "A data de início é obrigatória.")
    .max(191),
  endDate: z.string().trim().max(191).optional(),
  description: z.string().max(50_000).optional(),
  logoUrl: optionalHttpUrl,
});

export async function getExperiences() {
  await requireAdmin();
  try {
    const experiences = await prisma.workExperience.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return { success: true, data: experiences };
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    return {
      success: false,
      error: "Erro ao carregar experiências.",
      data: [],
    };
  }
}

export async function getExperienceById(id: string) {
  await requireAdmin();
  try {
    const experience = await prisma.workExperience.findUnique({
      where: { id },
    });
    return { success: true, data: experience };
  } catch (error) {
    console.error("Failed to fetch experience:", error);
    return {
      success: false,
      error: "Erro ao carregar a experiência.",
      data: null,
    };
  }
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  try {
    await prisma.workExperience.delete({ where: { id: idSchema.parse(id) } });
    revalidatePath("/cms/experiences");
    revalidatePublic();
    return { success: true };
  } catch (error) {
    console.error("Failed to delete experience:", error);
    return { success: false, error: "Erro ao apagar a experiência." };
  }
}

export async function saveExperience(input: z.input<typeof experienceSchema>) {
  await requireAdmin();

  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const { id, ...rest } = parsed.data;
  const data = {
    ...rest,
    endDate: rest.endDate || null,
    description: rest.description ? sanitizeRichText(rest.description) : null,
  };

  try {
    if (id) {
      await prisma.workExperience.update({ where: { id }, data });
    } else {
      const maxOrderExp = await prisma.workExperience.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      const nextOrder = (maxOrderExp?.order ?? -1) + 1;

      await prisma.workExperience.create({
        data: { ...data, order: nextOrder },
      });
    }

    revalidatePath("/cms/experiences");
    revalidatePublic();
    return { success: true };
  } catch (error) {
    console.error("Failed to save experience:", error);
    return { success: false, error: "Erro ao guardar a experiência." };
  }
}
