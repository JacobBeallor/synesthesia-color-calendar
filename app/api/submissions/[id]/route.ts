import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ColorValue } from "@/lib/color";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { months, daysOfMonth, daysOfWeek } = body;

    // Validate payload
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

    if (months.length !== 12 || daysOfMonth.length !== 31 || daysOfWeek.length !== 7) {
      return NextResponse.json(
        { error: "Invalid array lengths" },
        { status: 400 }
      );
    }

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

    // Update existing submission
    const submission = await prisma.submission.update({
      where: { id: params.id },
      data: {
        monthsJson: JSON.stringify(months),
        daysOfMonthJson: JSON.stringify(daysOfMonth),
        daysOfWeekJson: JSON.stringify(daysOfWeek),
      },
    });

    return NextResponse.json({
      success: true,
      id: submission.id,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

