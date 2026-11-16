"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth-guard";
import { idSchema } from "@/lib/validation";

const subscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(191, "Email demasiado longo.")
    .email("Por favor, insere um email válido."),
  // Campo "honeypot": invisível para humanos, preenchido por bots.
  website: z.string().max(0).optional(),
});

const SUCCESS_MESSAGE = "Obrigado por subscreveres a newsletter!";

export async function subscribeToNewsletter(formData: FormData) {
  try {
    const parsed = subscribeSchema.safeParse({
      email: formData.get("email") ?? "",
      website: formData.get("website") ?? "",
    });

    if (!parsed.success) {
      // Bots que preenchem o honeypot recebem uma resposta de sucesso falsa.
      if (parsed.error.issues.some((i) => i.path[0] === "website")) {
        return { success: true, message: SUCCESS_MESSAGE };
      }
      return { success: false, error: parsed.error.issues[0].message };
    }

    const { email } = parsed.data;

    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      if (!existingSubscriber.isActive) {
        await prisma.subscriber.update({
          where: { email },
          data: { isActive: true },
        });
        revalidatePath("/cms/subscribers");
      }
      // Resposta idêntica para não revelar se o email já está registado.
      return { success: true, message: SUCCESS_MESSAGE };
    }

    await prisma.subscriber.create({
      data: { email, isActive: true },
    });

    revalidatePath("/cms/subscribers");
    return { success: true, message: SUCCESS_MESSAGE };
  } catch (error) {
    console.error("Subscription error:", error);
    return {
      success: false,
      error: "Ocorreu um erro. Tenta novamente mais tarde.",
    };
  }
}

export async function getSubscribers() {
  await requireAdmin();
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { subscribedAt: "desc" },
    });
    return { success: true, data: subscribers };
  } catch (error) {
    console.error("Failed to fetch subscribers:", error);
    return {
      success: false,
      error: "Erro ao carregar subscritores.",
      data: [],
    };
  }
}

export async function toggleSubscriberStatus(
  id: string,
  currentStatus: boolean,
) {
  await requireAdmin();
  try {
    await prisma.subscriber.update({
      where: { id: idSchema.parse(id) },
      data: { isActive: !currentStatus },
    });
    revalidatePath("/cms/subscribers");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle subscriber:", error);
    return { success: false, error: "Erro ao alterar estado do subscritor." };
  }
}

export async function deleteSubscriber(id: string) {
  await requireAdmin();
  try {
    await prisma.subscriber.delete({ where: { id: idSchema.parse(id) } });
    revalidatePath("/cms/subscribers");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete subscriber:", error);
    return { success: false, error: "Erro ao apagar o subscritor." };
  }
}
