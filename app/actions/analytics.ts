"use server";

import prisma from "@/lib/prisma";
import { startOfMonth, subMonths, format } from "date-fns";
import { pt } from "date-fns/locale";

export async function getAnalyticsData() {
  try {
    const today = new Date();
    const sixMonthsAgo = startOfMonth(subMonths(today, 5));

    const views = await prisma.pageView.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
      },
      select: { createdAt: true },
    });

    const monthsData = Array.from({ length: 6 }).map((_, i) => {
      const date = subMonths(today, 5 - i);
      return {
        month: format(date, "MMM", { locale: pt }),
        yearMonth: format(date, "yyyy-MM"),
        views: 0,
      };
    });

    views.forEach((view) => {
      const yearMonth = format(view.createdAt, "yyyy-MM");
      const targetMonth = monthsData.find((m) => m.yearMonth === yearMonth);
      if (targetMonth) {
        targetMonth.views += 1;
      }
    });

    const currentMonthStr = format(today, "yyyy-MM");
    const prevMonthStr = format(subMonths(today, 1), "yyyy-MM");

    const currentViews =
      monthsData.find((m) => m.yearMonth === currentMonthStr)?.views || 0;
    const prevViews =
      monthsData.find((m) => m.yearMonth === prevMonthStr)?.views || 0;

    let percentageChange = 0;
    if (prevViews > 0) {
      percentageChange = ((currentViews - prevViews) / prevViews) * 100;
    } else if (currentViews > 0) {
      percentageChange = 100;
    }

    return {
      success: true,
      data: {
        chartData: monthsData.map((m) => ({
          month: m.month.charAt(0).toUpperCase() + m.month.slice(1),
          views: m.views,
        })),
        currentViews,
        percentageChange: Math.round(percentageChange),
      },
    };
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return {
      success: false,
      data: { chartData: [], currentViews: 0, percentageChange: 0 },
    };
  }
}
