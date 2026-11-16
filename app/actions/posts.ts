"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { sanitizeRichText } from "@/lib/sanitize";
import { revalidatePublic } from "@/lib/revalidate";
import { firstIssue, idSchema } from "@/lib/validation";

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 180);
};

const postSchema = z.object({
  id: idSchema.optional(),
  title: z.string().trim().min(1, "O título é obrigatório.").max(191),
  content: z.string().min(1, "O conteúdo é obrigatório.").max(500_000),
  excerpt: z.string().trim().max(1000).optional(),
  coverImage: z
    .string()
    .trim()
    .max(2048)
    .refine((v) => v === "" || /^https:\/\//i.test(v), "URL de imagem inválido")
    .optional(),
  published: z.boolean(),
});

export async function getPosts() {
  await requireAdmin();
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: posts };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return { success: false, error: "Erro ao carregar artigos.", data: [] };
  }
}

export async function getPostById(id: string) {
  await requireAdmin();
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    return { success: true, data: post };
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return { success: false, error: "Erro ao carregar o artigo.", data: null };
  }
}

export async function deletePost(id: string) {
  await requireAdmin();
  try {
    const post = await prisma.post.delete({ where: { id: idSchema.parse(id) } });
    revalidatePath("/cms/posts");
    revalidatePublic(`/artigos/${post.slug}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { success: false, error: "Erro ao apagar o artigo." };
  }
}

export async function togglePostStatus(id: string, currentStatus: boolean) {
  await requireAdmin();
  try {
    const post = await prisma.post.update({
      where: { id: idSchema.parse(id) },
      data: { published: !currentStatus },
    });
    revalidatePath("/cms/posts");
    revalidatePublic(`/artigos/${post.slug}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle post:", error);
    return { success: false, error: "Erro ao alterar o estado do artigo." };
  }
}

export async function savePost(input: z.input<typeof postSchema>) {
  await requireAdmin();

  const parsed = postSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const { id, ...rest } = parsed.data;
  const data = {
    title: rest.title,
    content: sanitizeRichText(rest.content),
    excerpt: rest.excerpt || null,
    coverImage: rest.coverImage || null,
    published: rest.published,
  };

  try {
    let slug: string;

    if (id) {
      // O slug é mantido ao editar para não partir links já indexados.
      const existing = await prisma.post.findUnique({
        where: { id },
        select: { slug: true },
      });
      if (!existing) {
        return { success: false, error: "Artigo não encontrado." };
      }
      slug = existing.slug;
      await prisma.post.update({ where: { id }, data });
    } else {
      slug = generateSlug(data.title);
      if (!slug) {
        return { success: false, error: "O título não gera um slug válido." };
      }
      await prisma.post.create({ data: { ...data, slug } });
    }

    revalidatePath("/cms/posts");
    revalidatePublic(`/artigos/${slug}`);
    return { success: true };
  } catch (error: unknown) {
    const err = error as { code?: string } | undefined;
    if (err?.code === "P2002") {
      return {
        success: false,
        error: "Já existe um artigo com este título/slug.",
      };
    }
    console.error("Failed to save post:", error);
    return { success: false, error: "Erro ao guardar o artigo." };
  }
}
