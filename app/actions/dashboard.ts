"use server";

import prisma from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    const [postsCount, projectsCount, subscribersCount] = await Promise.all([
      prisma.post.count(),
      prisma.project.count(),
      prisma.subscriber.count({ where: { isActive: true } }),
    ]);

    return {
      success: true,
      data: {
        posts: postsCount,
        projects: projectsCount,
        subscribers: subscribersCount,
      },
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      success: false,
      error: "Erro ao carregar estatísticas do dashboard.",
      data: { posts: 0, projects: 0, subscribers: 0 },
    };
  }
}
