"use client";

import { Color3Day, getMonthName } from "@/lib/color3";
import { getColorFamilyRepresentative } from "@/lib/color";

interface Color3CalendarProps {
  color3Days: Color3Day[];
}

export default function Color3Calendar({ color3Days }: Color3CalendarProps) {
  // Get unique months that have Color³ days
  const monthsWithDays = new Map<string, Color3Day[]>();

  color3Days.forEach((day) => {
    const date = new Date(day.date + "T00:00:00");
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!monthsWithDays.has(key)) {
      monthsWithDays.set(key, []);
    }
    monthsWithDays.get(key)!.push(day);
  });

  return (
    <div className="space-y-8">
      {Array.from(monthsWithDays.entries()).map(([key, days]) => {
        const [year, monthStr] = key.split("-");
        const month = parseInt(monthStr);
        return (
          <MonthCalendar
            key={key}
            year={parseInt(year)}
            month={month}
            color3Days={days}
          />
        );
      })}
    </div>
  );
}

function MonthCalendar({
  year,
  month,
  color3Days,
}: {
  year: number;
  month: number;
  color3Days: Color3Day[];
}) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

  // Create a map of day number to Color³ day
  const color3DayMap = new Map<number, Color3Day>();
  color3Days.forEach((day) => {
    const date = new Date(day.date + "T00:00:00");
    if (date.getMonth() === month && date.getFullYear() === year) {
      color3DayMap.set(date.getDate(), day);
    }
  });

  // Generate calendar grid
  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push(null);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Add empty cells for remaining days
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">
        {getMonthName(month)} {year}
      </h3>
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const isColor3Day = day ? color3DayMap.has(day) : false;
            const color3Day = day ? color3DayMap.get(day) : null;

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`
                  aspect-square flex items-center justify-center rounded-lg text-sm
                  ${
                    day === null
                      ? "bg-transparent"
                      : isColor3Day
                      ? "font-bold text-white"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }
                `}
                style={
                  isColor3Day && color3Day
                    ? {
                        backgroundColor: getColorFamilyRepresentative(
                          color3Day.family
                        ),
                      }
                    : undefined
                }
                title={
                  isColor3Day && color3Day
                    ? `Color³ day: ${color3Day.family}`
                    : undefined
                }
              >
                {day}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

