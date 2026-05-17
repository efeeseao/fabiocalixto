"use server";

import prisma from "@/lib/prisma";

export async function trackPageView(path: string) {
  try {
    if (process.env.NODE_ENV !== "production") {
      return { success: true, message: "Dev environment - view ignored." };
    }

    await prisma.pageView.create({
      data: { path },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to track view:", error);
    return { success: false };
  }
}
