"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { sanitizeRichText } from "@/lib/sanitize";
import { revalidatePublic } from "@/lib/revalidate";
import { firstIssue, idSchema, optionalHttpUrl } from "@/lib/validation";

const projectSchema = z.object({
  id: idSchema.optional(),
  title: z.string().trim().min(1, "O título é obrigatório.").max(191),
  description: z.string().min(1, "A descrição é obrigatória.").max(50_000),
  repositoryUrl: optionalHttpUrl,
  liveUrl: optionalHttpUrl,
  imageUrl: optionalHttpUrl,
});

export async function getProjects() {
  await requireAdmin();
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
  await requireAdmin();
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    return { success: true, data: project };
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return { success: false, error: "Erro ao carregar o projeto.", data: null };
  }
}

export async function deleteProject(id: string) {
  await requireAdmin();
  try {
    await prisma.project.delete({ where: { id: idSchema.parse(id) } });
    revalidatePath("/cms/projects");
    revalidatePublic();
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Erro ao apagar o projeto." };
  }
}

export async function saveProject(input: z.input<typeof projectSchema>) {
  await requireAdmin();

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const { id, ...rest } = parsed.data;
  const data = { ...rest, description: sanitizeRichText(rest.description) };

  try {
    if (id) {
      await prisma.project.update({ where: { id }, data });
    } else {
      const maxOrderProject = await prisma.project.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      const nextOrder = (maxOrderProject?.order ?? -1) + 1;

      await prisma.project.create({ data: { ...data, order: nextOrder } });
    }

    revalidatePath("/cms/projects");
    revalidatePublic();
    return { success: true };
  } catch (error) {
    console.error("Failed to save project:", error);
    return { success: false, error: "Erro ao guardar o projeto." };
  }
}
