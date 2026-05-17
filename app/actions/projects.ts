"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: projects };
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return { success: false, error: "Erro ao carregar projetos.", data: [] };
  }
}

export async function getProjectById(id: string) {
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    return { success: true, data: project };
  } catch (error) {
    return {
      success: false,
      error: "Erro ao carregar o projeto." + error,
      data: null,
    };
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/cms/projects");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao apagar o projeto." + error };
  }
}

export async function saveProject(data: {
  id?: string;
  title: string;
  description: string;
  repositoryUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}) {
  try {
    if (data.id) {
      await prisma.project.update({
        where: { id: data.id },
        data,
      });
    } else {
      const maxOrderProject = await prisma.project.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      const nextOrder = (maxOrderProject?.order ?? -1) + 1;

      await prisma.project.create({
        data: { ...data, order: nextOrder },
      });
    }

    revalidatePath("/cms/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to save project:", error);
    return { success: false, error: "Erro ao guardar o projeto." };
  }
}
