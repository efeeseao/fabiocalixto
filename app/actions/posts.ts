"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export async function getPosts() {
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
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    return { success: true, data: post };
  } catch (error) {
    return {
      success: false,
      error: "Erro ao carregar o artigo." + error,
      data: null,
    };
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath("/cms/posts");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao apagar o artigo." + error };
  }
}

export async function togglePostStatus(id: string, currentStatus: boolean) {
  try {
    await prisma.post.update({
      where: { id },
      data: { published: !currentStatus },
    });
    revalidatePath("/cms/posts");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Erro ao alterar o estado do artigo." + error,
    };
  }
}

export async function savePost(data: {
  id?: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published: boolean;
}) {
  try {
    const slug = generateSlug(data.title);

    if (data.id) {
      await prisma.post.update({
        where: { id: data.id },
        data: { ...data, slug },
      });
    } else {
      await prisma.post.create({
        data: { ...data, slug },
      });
    }

    revalidatePath("/cms/posts");
    return { success: true };
  } catch (error: unknown) {
    const err = error as { code?: string } | undefined;
    if (err?.code === "P2002") {
      return {
        success: false,
        error: "Já existe um artigo com este título/slug.",
      };
    }
    return { success: false, error: "Erro ao guardar o artigo." };
  }
}
