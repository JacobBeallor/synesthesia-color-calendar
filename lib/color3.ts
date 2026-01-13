/**
 * Color³ day computation logic
 * Finds dates where month, day-of-month, and day-of-week color families all match
 */

import { ColorFamily } from "./color";

export interface ColorMapping {
  months: Record<number, ColorFamily>; // 0-11 (Jan=0)
  daysOfMonth: Record<number, ColorFamily>; // 1-31
  daysOfWeek: Record<number, ColorFamily>; // 0-6 (Sun=0)
}

export interface Color3Day {
  date: string; // ISO date string (YYYY-MM-DD)
  family: ColorFamily;
  month: number; // 0-11
  dayOfMonth: number; // 1-31
  dayOfWeek: number; // 0-6
}

/**
 * Computes Color³ days for the next N months
 * A Color³ day is one where all three color families match
 */
export function computeColor3Days(
  mapping: ColorMapping,
  monthsAhead: number = 12
): Color3Day[] {
  const results: Color3Day[] = [];
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);

  // Calculate end date
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + monthsAhead);

  // Iterate through each day in the range
  let currentDate = new Date(startDate);

  while (currentDate < endDate) {
    const month = currentDate.getMonth(); // 0-11
    const dayOfMonth = currentDate.getDate(); // 1-31
    const dayOfWeek = currentDate.getDay(); // 0-6

    const monthFamily = mapping.months[month];
    const domFamily = mapping.daysOfMonth[dayOfMonth];
    const dowFamily = mapping.daysOfWeek[dayOfWeek];

    // Check if all three families match
    if (
      monthFamily &&
      domFamily &&
      dowFamily &&
      monthFamily === domFamily &&
      monthFamily === dowFamily
    ) {
      results.push({
        date: currentDate.toISOString().split("T")[0],
        family: monthFamily,
        month,
        dayOfMonth,
        dayOfWeek,
      });
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return results;
}

/**
 * Gets the display name for a month (0-11)
 */
export function getMonthName(month: number): string {
  const names = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return names[month] || "";
}

/**
 * Gets the display name for a day of week (0-6)
 */
export function getDayOfWeekName(dow: number): string {
  const names = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return names[dow] || "";
}

/**
 * Formats a date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00"); // Add time to avoid timezone issues
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Validates a color mapping object
 */
export function isValidColorMapping(mapping: Partial<ColorMapping>): boolean {
  if (!mapping.months || !mapping.daysOfMonth || !mapping.daysOfWeek) {
    return false;
  }

  // Check months (0-11)
  for (let i = 0; i < 12; i++) {
    if (!mapping.months[i]) return false;
  }

  // Check days of month (1-31)
  for (let i = 1; i <= 31; i++) {
    if (!mapping.daysOfMonth[i]) return false;
  }

  // Check days of week (0-6)
  for (let i = 0; i < 7; i++) {
    if (!mapping.daysOfWeek[i]) return false;
  }

  return true;
}

/**
 * Gets all dates in a month that are Color³ days
 */
export function getColor3DaysInMonth(
  color3Days: Color3Day[],
  year: number,
  month: number
): Set<number> {
  const daysSet = new Set<number>();

  for (const day of color3Days) {
    const date = new Date(day.date + "T00:00:00");
    if (date.getFullYear() === year && date.getMonth() === month) {
      daysSet.add(date.getDate());
    }
  }

  return daysSet;
}

