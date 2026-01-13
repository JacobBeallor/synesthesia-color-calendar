import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ColorValue } from "@/lib/color";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate payload structure
    const { months, daysOfMonth, daysOfWeek } = body;

    if (
      !Array.isArray(months) ||
      !Array.isArray(daysOfMonth) ||
      !Array.isArray(daysOfWeek)
    ) {
      return NextResponse.json(
        { error: "Invalid payload structure" },
        { status: 400 }
      );
    }

    // Validate array lengths
    if (months.length !== 12 || daysOfMonth.length !== 31 || daysOfWeek.length !== 7) {
      return NextResponse.json(
        { error: "Invalid array lengths" },
        { status: 400 }
      );
    }

    // Validate each color value is either null or has hex and family
    const isValidColorValue = (cv: ColorValue | null) =>
      cv === null || (cv && typeof cv.hex === "string" && typeof cv.family === "string");

    if (
      !months.every(isValidColorValue) ||
      !daysOfMonth.every(isValidColorValue) ||
      !daysOfWeek.every(isValidColorValue)
    ) {
      return NextResponse.json(
        { error: "Invalid color values" },
        { status: 400 }
      );
    }

    // Store in database
    const submission = await prisma.submission.create({
      data: {
        monthsJson: JSON.stringify(months),
        daysOfMonthJson: JSON.stringify(daysOfMonth),
        daysOfWeekJson: JSON.stringify(daysOfWeek),
      },
    });

    return NextResponse.json(
      {
        success: true,
        id: submission.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

