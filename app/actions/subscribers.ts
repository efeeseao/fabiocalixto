"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Por favor, insere um email válido."),
});

export async function subscribeToNewsletter(formData: FormData) {
  try {
    const email = formData.get("email");

    const parsed = subscribeSchema.safeParse({ email });
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const validEmail = parsed.data.email;

    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email: validEmail },
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return { success: false, error: "Este email já está subscrito!" };
      } else {
        await prisma.subscriber.update({
          where: { email: validEmail },
          data: { isActive: true },
        });
        revalidatePath("/cms/subscribers");
        return {
          success: true,
          message: "Bem-vindo de volta! Subscrição reativada.",
        };
      }
    }

    await prisma.subscriber.create({
      data: {
        email: validEmail,
        isActive: true,
      },
    });

    revalidatePath("/cms/subscribers");
    return {
      success: true,
      message: "Obrigado por subscreveres a newsletter!",
    };
  } catch (error) {
    console.error("Subscription error:", error);
    return {
      success: false,
      error: "Ocorreu um erro. Tenta novamente mais tarde.",
    };
  }
}

export async function getSubscribers() {
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
  try {
    await prisma.subscriber.update({
      where: { id },
      data: { isActive: !currentStatus },
    });
    revalidatePath("/cms/subscribers");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Erro ao alterar estado do subscritor." + error,
    };
  }
}

export async function deleteSubscriber(id: string) {
  try {
    await prisma.subscriber.delete({ where: { id } });
    revalidatePath("/cms/subscribers");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao apagar o subscritor." + error };
  }
}
