"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
