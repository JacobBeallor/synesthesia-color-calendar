import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ColorFamily } from "@/lib/color";

interface FamilyCount {
  family: ColorFamily;
  count: number;
  percentage: number;
}

type ConsensusStatus = "Strong agreement" | "Mixed" | "No consensus" | "Not enough data";

interface ConsensusMetrics {
  status: ConsensusStatus;
  topShare: number;
  entropy: number;
  totalCount: number;
}

interface UnitData {
  counts: FamilyCount[];
  consensus: ConsensusMetrics;
}

interface AggregateData {
  totalSubmissions: number;
  months: Record<number, UnitData>; // 0-11
  daysOfWeek: Record<number, UnitData>; // 0-6
  daysOfMonth: Record<number, UnitData>; // 1-31
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

    // Calculate consensus metrics for a unit
    const calculateConsensus = (counts: Record<string, number>): ConsensusMetrics => {
      const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);
      
      // Not enough data
      if (totalCount < 10) {
        return {
          status: "Not enough data",
          topShare: 0,
          entropy: 0,
          totalCount,
        };
      }

      // Calculate top share
      const maxCount = Math.max(...Object.values(counts));
      const topShare = maxCount / totalCount;

      // Calculate normalized Shannon entropy
      const NUM_COLOR_FAMILIES = 11;
      let entropy = 0;
      for (const count of Object.values(counts)) {
        if (count > 0) {
          const p = count / totalCount;
          entropy -= p * Math.log(p);
        }
      }
      const normalizedEntropy = entropy / Math.log(NUM_COLOR_FAMILIES);

      // Classify based on rules
      let status: ConsensusStatus;
      if (normalizedEntropy <= 0.35 && topShare > 0.50) {
        status = "Strong agreement";
      } else if (normalizedEntropy >= 0.50 && topShare < 0.50) {
        status = "No consensus";
      } else {
        status = "Mixed";
      }

      return {
        status,
        topShare: Math.round(topShare * 100) / 100,
        entropy: Math.round(normalizedEntropy * 100) / 100,
        totalCount,
      };
    };

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

    // Convert to unit data with consensus
    const convertToUnitData = (counts: Record<string, number>): UnitData => ({
      counts: convertToFamilyCount(counts),
      consensus: calculateConsensus(counts),
    });

    const result: AggregateData = {
      totalSubmissions: total,
      months: Object.fromEntries(
        Object.entries(monthCounts).map(([key, counts]) => [
          parseInt(key),
          convertToUnitData(counts),
        ])
      ),
      daysOfWeek: Object.fromEntries(
        Object.entries(dowCounts).map(([key, counts]) => [
          parseInt(key),
          convertToUnitData(counts),
        ])
      ),
      daysOfMonth: Object.fromEntries(
        Object.entries(domCounts).map(([key, counts]) => [
          parseInt(key),
          convertToUnitData(counts),
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

