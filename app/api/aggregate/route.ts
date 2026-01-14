import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ColorFamily } from "@/lib/color";

interface FamilyCount {
  family: ColorFamily;
  count: number;
  percentage: number;
}

interface AggregateData {
  totalSubmissions: number;
  months: Record<number, FamilyCount[]>; // 0-11
  daysOfWeek: Record<number, FamilyCount[]>; // 0-6
  daysOfMonth: Record<number, FamilyCount[]>; // 1-31
}

export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      select: {
        monthsJson: true,
        daysOfMonthJson: true,
        daysOfWeekJson: true,
      },
    });

    if (submissions.length === 0) {
      return NextResponse.json({
        totalSubmissions: 0,
        months: {},
        daysOfWeek: {},
        daysOfMonth: {},
      });
    }

    // Initialize counters
    const monthCounts: Record<number, Record<string, number>> = {};
    const dowCounts: Record<number, Record<string, number>> = {};
    const domCounts: Record<number, Record<string, number>> = {};

    // Initialize all counters
    for (let i = 0; i < 12; i++) monthCounts[i] = {};
    for (let i = 0; i < 7; i++) dowCounts[i] = {};
    for (let i = 1; i <= 31; i++) domCounts[i] = {};

    // Process each submission
    submissions.forEach((submission) => {
      const months = JSON.parse(submission.monthsJson);
      const daysOfMonth = JSON.parse(submission.daysOfMonthJson);
      const daysOfWeek = JSON.parse(submission.daysOfWeekJson);

      // Count months (skip null values)
      months.forEach((cv: { family: string } | null, index: number) => {
        if (cv && cv.family) {
          monthCounts[index][cv.family] = (monthCounts[index][cv.family] || 0) + 1;
        }
      });

      // Count days of week (skip null values)
      daysOfWeek.forEach((cv: { family: string } | null, index: number) => {
        if (cv && cv.family) {
          dowCounts[index][cv.family] = (dowCounts[index][cv.family] || 0) + 1;
        }
      });

      // Count days of month (skip null values)
      daysOfMonth.forEach((cv: { family: string } | null, index: number) => {
        if (cv && cv.family) {
          const day = index + 1;
          domCounts[day][cv.family] = (domCounts[day][cv.family] || 0) + 1;
        }
      });
    });

    const total = submissions.length;

    // Convert counts to sorted arrays with percentages
    const convertToFamilyCount = (
      counts: Record<string, number>
    ): FamilyCount[] => {
      const totalForThisItem = Object.values(counts).reduce((sum, count) => sum + count, 0);
      
      return Object.entries(counts)
        .map(([family, count]) => ({
          family: family as ColorFamily,
          count,
          percentage: totalForThisItem > 0 ? Math.round((count / totalForThisItem) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count);
    };

    const result: AggregateData = {
      totalSubmissions: total,
      months: Object.fromEntries(
        Object.entries(monthCounts).map(([key, counts]) => [
          parseInt(key),
          convertToFamilyCount(counts),
        ])
      ),
      daysOfWeek: Object.fromEntries(
        Object.entries(dowCounts).map(([key, counts]) => [
          parseInt(key),
          convertToFamilyCount(counts),
        ])
      ),
      daysOfMonth: Object.fromEntries(
        Object.entries(domCounts).map(([key, counts]) => [
          parseInt(key),
          convertToFamilyCount(counts),
        ])
      ),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Aggregate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

