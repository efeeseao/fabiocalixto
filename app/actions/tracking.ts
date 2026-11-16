"use server";

import prisma from "@/lib/prisma";

// Apenas caminhos públicos conhecidos podem ser registados — impede que
// pedidos forjados encham a tabela com lixo arbitrário.
const TRACKABLE_PATH = /^\/(artigos(\/[a-z0-9-]{1,180})?|projetos|sobre)?$/;

export async function trackPageView(path: string) {
  try {
    if (process.env.NODE_ENV !== "production") {
      return { success: true };
    }

    if (typeof path !== "string" || !TRACKABLE_PATH.test(path)) {
      return { success: false };
    }

    await prisma.pageView.create({ data: { path } });

    return { success: true };
  } catch (error) {
    console.error("Failed to track view:", error);
    return { success: false };
  }
}
