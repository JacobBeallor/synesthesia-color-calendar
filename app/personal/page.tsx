"use client";

import { useState, useMemo } from "react";
import { ColorValue, createColorValue, getColorFamilyLabel, getColorFamilyRepresentative } from "@/lib/color";
import { computeColor3Days, Color3Day, formatDate } from "@/lib/color3";
import ColorPicker from "@/components/ColorPicker";
import Color3Calendar from "@/components/Color3Calendar";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

export default function PersonalPage() {
  // Initialize with null colors (unselected)
  const [monthColors, setMonthColors] = useState<(ColorValue | null)[]>(
    Array(12).fill(null)
  );
  const [dayOfMonthColors, setDayOfMonthColors] = useState<(ColorValue | null)[]>(
    Array(31).fill(null)
  );
  const [dayOfWeekColors, setDayOfWeekColors] = useState<(ColorValue | null)[]>(
    Array(7).fill(null)
  );

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Compute Color³ days in real-time (only for selected colors)
  const color3Days = useMemo(() => {
    const mapping = {
      months: Object.fromEntries(
        monthColors.map((c, i) => [i, c?.family]).filter(([_, family]) => family != null)
      ),
      daysOfMonth: Object.fromEntries(
        dayOfMonthColors.map((c, i) => [i + 1, c?.family]).filter(([_, family]) => family != null)
      ),
      daysOfWeek: Object.fromEntries(
        dayOfWeekColors.map((c, i) => [i, c?.family]).filter(([_, family]) => family != null)
      ),
    };
    return computeColor3Days(mapping, 12);
  }, [monthColors, dayOfMonthColors, dayOfWeekColors]);

  // Count unselected colors
  const unselectedCount = useMemo(() => {
    const monthNull = monthColors.filter(c => c === null).length;
    const domNull = dayOfMonthColors.filter(c => c === null).length;
    const dowNull = dayOfWeekColors.filter(c => c === null).length;
    return monthNull + domNull + dowNull;
  }, [monthColors, dayOfMonthColors, dayOfWeekColors]);

  const handleSubmit = async () => {
    // Check for incomplete mapping
    if (unselectedCount > 0) {
      const confirmed = window.confirm(
        `You have ${unselectedCount} unselected color${unselectedCount === 1 ? '' : 's'}. ` +
        `Color³ days can only be computed for complete mappings. ` +
        `Do you want to submit this incomplete mapping anyway?`
      );
      if (!confirmed) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          months: monthColors,
          daysOfMonth: dayOfMonthColors,
          daysOfWeek: dayOfWeekColors,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pb-16 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            Personal Color Mapping
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Assign colors to each time component. Your Color³ days will appear
            automatically.
          </p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 italic mt-2">
            💡 Tip: Color³ days are based on color families, not exact shades. Different shades of the same
            color will still match!
          </p>
        </div>

        {/* Months */}
        <section className="mb-12 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Months</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {MONTHS.map((month, index) => (
              <ColorPicker
                key={month}
                label={month}
                value={monthColors[index]?.hex ?? null}
                family={monthColors[index]?.family ?? null}
                onChange={(hex) => {
                  const newColors = [...monthColors];
                  newColors[index] = createColorValue(hex);
                  setMonthColors(newColors);
                }}
              />
            ))}
          </div>
        </section>

        {/* Days of Week */}
        <section className="mb-12 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Days of Week</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {DAYS_OF_WEEK.map((day, index) => (
              <ColorPicker
                key={day}
                label={day}
                value={dayOfWeekColors[index]?.hex ?? null}
                family={dayOfWeekColors[index]?.family ?? null}
                onChange={(hex) => {
                  const newColors = [...dayOfWeekColors];
                  newColors[index] = createColorValue(hex);
                  setDayOfWeekColors(newColors);
                }}
              />
            ))}
          </div>
        </section>

        {/* Days of Month */}
        <section className="mb-12 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Days of Month</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <ColorPicker
                key={day}
                label={day.toString()}
                value={dayOfMonthColors[day - 1]?.hex ?? null}
                family={dayOfMonthColors[day - 1]?.family ?? null}
                onChange={(hex) => {
                  const newColors = [...dayOfMonthColors];
                  newColors[day - 1] = createColorValue(hex);
                  setDayOfMonthColors(newColors);
                }}
              />
            ))}
          </div>
        </section>

        {/* Color³ Days Results */}
        <section className="mb-12 bg-indigo-50 dark:bg-indigo-950/30 p-8 rounded-lg border-l-4 border-indigo-500">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Your Color³ Days
            {color3Days.length > 0 && (
              <span className="text-2xl font-normal text-indigo-600 dark:text-indigo-400 ml-3">
                ({color3Days.length} found)
              </span>
            )}
          </h2>

          {color3Days.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                No Color³ days found in the next 12 months.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Try adjusting your color mappings to discover matching days!
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Calendar View</h3>
                <Color3Calendar color3Days={color3Days} />
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">List View</h3>
                <div className="space-y-3">
                  {color3Days.map((day) => (
                    <Color3DayCard key={day.date} day={day} />
                  ))}
                </div>
              </div>
            </>
          )}
        </section>

        {/* Submit Section */}
        {!submitted ? (
          <section className="pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Share Your Mapping
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Submit your color associations anonymously to contribute to the
                collective patterns. No personal information is collected.
              </p>
              {unselectedCount > 0 && (
                <p className="text-sm text-amber-600 dark:text-amber-400 mb-4 flex items-center justify-center gap-2">
                  <span>⚠️</span>
                  <span>{unselectedCount} color{unselectedCount === 1 ? '' : 's'} not yet selected</span>
                </p>
              )}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Anonymously"}
              </button>
            </div>
          </section>
        ) : (
          <section className="pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-2xl mx-auto text-center bg-green-50 dark:bg-green-950/30 p-8 rounded-lg border-l-4 border-green-500">
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                Thank You!
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Your color mapping has been submitted successfully.
              </p>
              <a
                href="/collective"
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
              >
                Explore Collective Patterns →
              </a>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Color3DayCard({ day }: { day: Color3Day }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
      <div
        className="w-16 h-16 rounded-lg flex-shrink-0"
        style={{
          backgroundColor: getColorFamilyRepresentative(day.family),
        }}
      />
      <div className="flex-grow">
        <div className="font-semibold text-lg">{formatDate(day.date)}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          All three map to <strong>{getColorFamilyLabel(day.family)}</strong>
        </div>
      </div>
    </div>
  );
}

