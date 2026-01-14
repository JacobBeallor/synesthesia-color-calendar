"use client";

import { useState, useMemo, useEffect } from "react";
import { ColorValue, createColorValue, getColorFamilyRepresentative } from "@/lib/color";
import { computeColor3Days, Color3Day } from "@/lib/color3";

const DAYS_OF_WEEK_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const STORAGE_KEY = "color3_selections";

export default function PersonalPage() {
  const [monthColors, setMonthColors] = useState<(ColorValue | null)[]>(Array(12).fill(null));
  const [dayOfMonthColors, setDayOfMonthColors] = useState<(ColorValue | null)[]>(Array(31).fill(null));
  const [dayOfWeekColors, setDayOfWeekColors] = useState<(ColorValue | null)[]>(Array(7).fill(null));
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [color3Days, setColor3Days] = useState<Color3Day[]>([]);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.monthColors) setMonthColors(data.monthColors);
        if (data.dayOfMonthColors) setDayOfMonthColors(data.dayOfMonthColors);
        if (data.dayOfWeekColors) setDayOfWeekColors(data.dayOfWeekColors);
        if (data.submissionId) setSubmissionId(data.submissionId);
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever colors change
  useEffect(() => {
    if (!isLoaded) return; // Don't save on initial load

    try {
      const data = {
        monthColors,
        dayOfMonthColors,
        dayOfWeekColors,
        submissionId,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [monthColors, dayOfMonthColors, dayOfWeekColors, submissionId, isLoaded]);

  const unselectedCount = useMemo(() => {
    const monthNull = monthColors.filter(c => c === null).length;
    const domNull = dayOfMonthColors.filter(c => c === null).length;
    const dowNull = dayOfWeekColors.filter(c => c === null).length;
    return monthNull + domNull + dowNull;
  }, [monthColors, dayOfMonthColors, dayOfWeekColors]);

  const handleSubmit = async () => {
    if (unselectedCount > 0) {
      const confirmed = window.confirm(
        `You have ${unselectedCount} unselected color${unselectedCount === 1 ? '' : 's'}. ` +
        `Color³ days can only be computed for complete mappings. ` +
        `Do you want to submit this incomplete mapping anyway?`
      );
      if (!confirmed) return;
    }

    setSubmitting(true);
    try {
      // Compute Color³ days
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
      const computedDays = computeColor3Days(mapping, 12);
      setColor3Days(computedDays);

      // Submit to API (update if resubmitting)
      const url = submissionId
        ? `/api/submissions/${submissionId}`
        : "/api/submissions";

      const method = submissionId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          months: monthColors,
          daysOfMonth: dayOfMonthColors,
          daysOfWeek: dayOfWeekColors,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissionId(data.id);
        setShowModal(true);
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

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleClearAll = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all color selections? This cannot be undone."
    );
    if (confirmed) {
      setMonthColors(Array(12).fill(null));
      setDayOfMonthColors(Array(31).fill(null));
      setDayOfWeekColors(Array(7).fill(null));
      setSubmissionId(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Your Color Mapping</h1>
          <p className="text-gray-600 text-sm">
            Click each item to assign colors
          </p>
        </div>

        {/* Three Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* First Column: Days of Week Grid */}
          <div className="bg-white/70 p-6 rounded-xl border border-indigo-200/60">
            <h2 className="text-lg font-bold mb-4 text-indigo-700 text-center">Days of the Week</h2>
            <DaysOfWeekGrid
              dayOfWeekColors={dayOfWeekColors}
              onChange={(index, hex) => {
                const newColors = [...dayOfWeekColors];
                newColors[index] = createColorValue(hex);
                setDayOfWeekColors(newColors);
              }}
            />
          </div>

          {/* Second Column: Months Grid */}
          <div className="bg-white/70 p-6 rounded-xl border border-indigo-200/60">
            <h2 className="text-lg font-bold mb-4 text-indigo-700 text-center">Months</h2>
            <MonthsGrid
              monthColors={monthColors}
              onChange={(index, hex) => {
                const newColors = [...monthColors];
                newColors[index] = createColorValue(hex);
                setMonthColors(newColors);
              }}
            />
          </div>

          {/* Third Column: Calendar (Days of Month) */}
          <div className="bg-white/70 p-6 rounded-xl border border-indigo-200/60">
            <h2 className="text-lg font-bold mb-4 text-indigo-700 text-center">Days of the Month</h2>
            <div className="grid grid-cols-7 gap-3">
              {/* Days 1-31 */}
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                return (
                  <div key={day} className="flex flex-col items-center gap-1">
                    <div className="text-xs text-gray-600 font-medium">{day}</div>
                    <ColorCircle
                      value={dayOfMonthColors[i]}
                      onChange={(hex) => {
                        const newColors = [...dayOfMonthColors];
                        newColors[i] = createColorValue(hex);
                        setDayOfMonthColors(newColors);
                      }}
                      size="sm"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleClearAll}
              disabled={submitting}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear All
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
          {unselectedCount > 0 && (
            <div className="mt-4">
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-lg text-sm">
                <span>⚠️</span>
                <span className="font-medium">{unselectedCount} color{unselectedCount === 1 ? '' : 's'} not yet selected</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Modal */}
      {showModal && (
        <Color3Modal
          color3Days={color3Days}
          monthColors={monthColors}
          dayOfMonthColors={dayOfMonthColors}
          dayOfWeekColors={dayOfWeekColors}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
}

// Color³ Results Modal
function Color3Modal({ color3Days, monthColors, dayOfMonthColors, dayOfWeekColors, onClose }: {
  color3Days: Color3Day[];
  monthColors: (ColorValue | null)[];
  dayOfMonthColors: (ColorValue | null)[];
  dayOfWeekColors: (ColorValue | null)[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            {color3Days.length > 0
              ? `✨ ${color3Days.length} Color³ Day${color3Days.length === 1 ? '' : 's'} Found!`
              : "No Color³ Days Found"}
          </h2>
          <p className="text-indigo-100 text-sm">
            {color3Days.length > 0
              ? "Here are some special days to look forward to, when your colors perfectly align!"
              : "Your color mappings don't create any matching Color³ days in the next year"}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {color3Days.length > 0 ? (
            <div className="space-y-3">
              {color3Days.map((day) => {
                const monthColor = monthColors[day.month];
                const domColor = dayOfMonthColors[day.dayOfMonth - 1];
                const dowColor = dayOfWeekColors[day.dayOfWeek];

                return (
                  <div
                    key={day.date}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                  >
                    {/* Three color swatches */}
                    <div className="flex gap-1 flex-shrink-0">
                      <div
                        className="w-8 h-8 rounded-lg border-2 border-gray-300"
                        style={{ backgroundColor: dowColor?.hex || '#e5e7eb' }}
                        title={`Day of week: ${dowColor?.hex || 'N/A'}`}
                      />
                      <div
                        className="w-8 h-8 rounded-lg border-2 border-gray-300"
                        style={{ backgroundColor: monthColor?.hex || '#e5e7eb' }}
                        title={`Month: ${monthColor?.hex || 'N/A'}`}
                      />
                      <div
                        className="w-8 h-8 rounded-lg border-2 border-gray-300"
                        style={{ backgroundColor: domColor?.hex || '#e5e7eb' }}
                        title={`Day of month: ${domColor?.hex || 'N/A'}`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-gray-900">
                          {new Date(day.date + "T00:00:00").toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="text-sm text-gray-600">
                          is a {day.family.charAt(0).toUpperCase() + day.family.slice(1)}³ day!
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">😔</div>
              <p className="text-gray-600 mb-2">
                No Color³ days were found in the next 12 months.
              </p>
              <p className="text-sm text-gray-500">
                Try adjusting your color selections to create more matching patterns!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Adjust My Colors
          </button>
          <a
            href="/collective"
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-center"
          >
            Explore Community Patterns →
          </a>
        </div>
      </div>
    </div>
  );
}

// Color Rectangle Component (for months and days of week)
function ColorRectangle({ value, onChange, label }: {
  value: ColorValue | null;
  onChange: (hex: string) => void;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-gray-600 font-medium text-center">{label}</span>
      <div className="relative">
        <input
          type="color"
          value={value?.hex ?? "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-11 rounded-lg cursor-pointer border-2 ${value ? "border-gray-300 hover:border-indigo-400" : "border-gray-400 hover:border-indigo-300"
            } transition-colors appearance-none`}
          style={{
            backgroundColor: value?.hex ?? "#ffffff",
            WebkitAppearance: 'none',
            MozAppearance: 'none'
          }}
        />
        {!value && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-gray-400 font-medium">?</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Color Circle Component
function ColorCircle({ value, onChange, size = "md" }: {
  value: ColorValue | null;
  onChange: (hex: string) => void;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base"
  };

  return (
    <div className="relative">
      <input
        type="color"
        value={value?.hex ?? "#ffffff"}
        onChange={(e) => onChange(e.target.value)}
        className={`${sizeClasses[size]} rounded-full cursor-pointer border-2 ${value ? "border-gray-300 hover:border-indigo-400" : "border-gray-400 hover:border-indigo-300"
          } transition-colors appearance-none`}
        style={{
          backgroundColor: value?.hex ?? "#ffffff",
          WebkitAppearance: 'none',
          MozAppearance: 'none'
        }}
      />
      {!value && (
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-gray-400 font-medium">
          ?
        </div>
      )}
    </div>
  );
}

// Months Grid Component
function MonthsGrid({ monthColors, onChange }: {
  monthColors: (ColorValue | null)[];
  onChange: (index: number, hex: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {MONTHS_SHORT.map((month, index) => (
        <ColorRectangle
          key={month}
          value={monthColors[index]}
          onChange={(hex) => onChange(index, hex)}
          label={month}
        />
      ))}
    </div>
  );
}

// Days of Week Grid Component
function DaysOfWeekGrid({ dayOfWeekColors, onChange }: {
  dayOfWeekColors: (ColorValue | null)[];
  onChange: (index: number, hex: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-3 max-w-xs mx-auto">
      {DAYS_OF_WEEK_SHORT.map((day, index) => (
        <ColorRectangle
          key={day}
          value={dayOfWeekColors[index]}
          onChange={(hex) => onChange(index, hex)}
          label={day}
        />
      ))}
    </div>
  );
}
