"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getExperiences() {
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
  try {
    const experience = await prisma.workExperience.findUnique({
      where: { id },
    });
    return { success: true, data: experience };
  } catch (error) {
    return {
      success: false,
      error: "Erro ao carregar a experiência." + error,
      data: null,
    };
  }
}

export async function deleteExperience(id: string) {
  try {
    await prisma.workExperience.delete({ where: { id } });
    revalidatePath("/cms/experiences");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao apagar a experiência." + error };
  }
}

export async function saveExperience(data: {
  id?: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description?: string;
  logoUrl?: string;
}) {
  try {
    if (data.id) {
      await prisma.workExperience.update({
        where: { id: data.id },
        data,
      });
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
    return { success: true };
  } catch (error) {
    console.error("Failed to save experience:", error);
    return { success: false, error: "Erro ao guardar a experiência." };
  }
}
