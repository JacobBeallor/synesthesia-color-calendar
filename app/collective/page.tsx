"use client";

import { useEffect, useState } from "react";
import {
  getColorFamilyLabel,
  getColorFamilyRepresentative,
  ColorFamily,
} from "@/lib/color";
import { getMonthName, getDayOfWeekName, computeColor3Days } from "@/lib/color3";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface FamilyCount {
  family: ColorFamily;
  count: number;
  percentage: number;
}

interface AggregateData {
  totalSubmissions: number;
  months: Record<number, FamilyCount[]>;
  daysOfWeek: Record<number, FamilyCount[]>;
  daysOfMonth: Record<number, FamilyCount[]>;
}

export default function CollectivePage() {
  const [data, setData] = useState<AggregateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/aggregate")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load aggregate data:", err);
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading community patterns...</p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || "Failed to load data"}</p>
        </div>
      </main>
    );
  }

  if (data.totalSubmissions === 0) {
    return (
      <main className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold mb-4">Community Patterns</h1>
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">
              No submissions yet. Be the first to share your color mapping!
            </p>
            <a
              href="/personal"
              className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Create Your Mapping →
            </a>
          </div>
        </div>
      </main>
    );
  }

  // Calculate community Color³ days
  const communityColor3Days = calculateCommunityColor3Days(data);

  return (
    <main className="min-h-screen pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section 1: Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            Community Patterns
          </h1>
          <p className="text-gray-600">
            Color associations from{" "}
            <span className="font-bold text-indigo-600">
              {data.totalSubmissions}
            </span>{" "}
            {data.totalSubmissions === 1 ? "submission" : "submissions"}
          </p>
        </div>

        {/* Section 2: Color Distribution Visualizations */}
        <section className="mb-12">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Column 1: Days of Week */}
            <div className="bg-white/70 p-6 rounded-xl border border-indigo-200/60">
              <h3 className="text-lg font-bold mb-4 text-indigo-700 text-center">
                Days of the Week
              </h3>
              <div className="grid grid-cols-2 gap-x-1 gap-y-2">
                {[0, 1, 2, 3, 4, 5, 6].map((dow) => (
                  <PieChartCell
                    key={dow}
                    label={getDayOfWeekName(dow).slice(0, 3)}
                    counts={data.daysOfWeek[dow] || []}
                    fullLabel={getDayOfWeekName(dow)}
                  />
                ))}
              </div>
            </div>

            {/* Column 2: Months */}
            <div className="bg-white/70 p-6 rounded-xl border border-indigo-200/60">
              <h3 className="text-lg font-bold mb-4 text-indigo-700 text-center">
                Months
              </h3>
              <div className="grid grid-cols-3 gap-x-3 gap-y-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => (
                  <PieChartCell
                    key={month}
                    label={getMonthName(month).slice(0, 3)}
                    counts={data.months[month] || []}
                    fullLabel={getMonthName(month)}
                  />
                ))}
              </div>
            </div>

            {/* Column 3: Days of Month */}
            <div className="bg-white/70 p-6 rounded-xl border border-indigo-200/60">
              <h3 className="text-lg font-bold mb-4 text-indigo-700 text-center">
                Days of the Month
              </h3>
              <div className="grid grid-cols-7 gap-x-2 gap-y-5">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <PieChartCell
                    key={day}
                    label={day.toString()}
                    counts={data.daysOfMonth[day] || []}
                    fullLabel={`Day ${day}`}
                    size="sm"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Community Color³ Days */}
        {communityColor3Days.length > 0 && (
          <section className="mb-12">
            <div className="bg-indigo-50 p-6 rounded-xl border-l-4 border-indigo-500">
              <h2 className="text-2xl font-bold mb-2 text-gray-900">
                ✨ Upcoming Community Color³ Days
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Based on the most popular color choices across all submissions
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {communityColor3Days.slice(0, 8).map((day) => (
                  <div
                    key={day.date}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex gap-2 flex-shrink-0">
                      <div
                        className="w-8 h-8 rounded-lg border-2 border-gray-300"
                        style={{
                          backgroundColor: getColorFamilyRepresentative(day.family),
                        }}
                        title={`Popular color family: ${day.family}`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {new Date(day.date + "T00:00:00").toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        Community consensus: {day.family}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 4: Consensus & Variation */}
        <section className="mb-12 border-t border-gray-200 pt-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Consensus & Variation
          </h2>
          <ConsensusAnalysis data={data} />
        </section>

        {/* Call to Action */}
        <section className="pt-8 border-t border-gray-200">
          <div className="text-center bg-indigo-50 rounded-lg p-8 border-l-4 border-indigo-500">
            <h2 className="text-2xl font-bold mb-3 text-gray-900">
              Add Your Perspective
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Every submission enriches our collective understanding of how
              people experience time through color.
            </p>
            <a
              href="/personal"
              className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
            >
              Create Your Mapping →
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

// Pie Chart Cell Component
function PieChartCell({
  label,
  fullLabel,
  counts,
  size = "md",
}: {
  label: string;
  fullLabel: string;
  counts: FamilyCount[];
  size?: "sm" | "md";
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const chartSize = size === "sm" ? 40 : 70;
  const hasData = counts.length > 0;

  // Prepare pie chart data
  const pieData = hasData
    ? counts.map((item) => ({
      name: item.family,
      value: item.count,
      color: getColorFamilyRepresentative(item.family),
    }))
    : [{ name: "none", value: 1, color: "#e5e7eb" }];

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="relative" style={{ width: chartSize, height: chartSize }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius="100%"
              dataKey="value"
              startAngle={90}
              endAngle={450}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <span className="text-xs text-gray-600 font-medium mt-1">{label}</span>

      {/* Tooltip */}
      {showTooltip && hasData && (
        <div className="absolute z-50 pointer-events-none"
          style={{
            top: size === "sm" ? "-120px" : "-140px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-[200px] relative">
            <h4 className="font-semibold mb-3 text-gray-900">{fullLabel} <span className="text-xs text-gray-500 font-normal">(top 3 colors)</span></h4>
            <div className="space-y-2">
              {counts.slice(0, 3).map((item) => (
                <div key={item.family}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm capitalize">{item.family}</span>
                    <span className="text-sm font-medium">{item.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: getColorFamilyRepresentative(item.family),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Notch pointing down with border */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                bottom: "-9px",
                borderLeft: "9px solid transparent",
                borderRight: "9px solid transparent",
                borderTop: "9px solid #e5e7eb",
                zIndex: -1,
              }}
            />
            <div
              className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                bottom: "-8px",
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid white",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Calculate Community Color³ Days
function calculateCommunityColor3Days(data: AggregateData) {
  // Get most popular family for each component
  const getMostPopular = (counts: FamilyCount[]): ColorFamily | null => {
    return counts.length > 0 ? counts[0].family : null;
  };

  const monthMapping: Record<number, ColorFamily> = {};
  const domMapping: Record<number, ColorFamily> = {};
  const dowMapping: Record<number, ColorFamily> = {};

  // Build mappings from most popular choices
  for (let i = 0; i < 12; i++) {
    const popular = getMostPopular(data.months[i] || []);
    if (popular) monthMapping[i] = popular;
  }

  for (let i = 1; i <= 31; i++) {
    const popular = getMostPopular(data.daysOfMonth[i] || []);
    if (popular) domMapping[i] = popular;
  }

  for (let i = 0; i < 7; i++) {
    const popular = getMostPopular(data.daysOfWeek[i] || []);
    if (popular) dowMapping[i] = popular;
  }

  // Compute Color³ days
  return computeColor3Days(
    {
      months: monthMapping,
      daysOfMonth: domMapping,
      daysOfWeek: dowMapping,
    },
    12
  );
}

function ConsensusAnalysis({ data }: { data: AggregateData }) {
  // Calculate consensus strength for days of week (most interesting)
  const dowConsensus = [0, 1, 2, 3, 4, 5, 6].map((dow) => {
    const counts = data.daysOfWeek[dow] || [];
    const topPercentage = counts[0]?.percentage || 0;
    return {
      name: getDayOfWeekName(dow),
      percentage: topPercentage,
      family: counts[0]?.family,
    };
  });

  const strongConsensus = dowConsensus.filter((d) => d.percentage >= 40);
  const weakConsensus = dowConsensus.filter((d) => d.percentage < 30);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-3">
            Strong Agreement
          </h3>
          {strongConsensus.length > 0 ? (
            <div className="space-y-2">
              {strongConsensus.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded flex-shrink-0"
                    style={{
                      backgroundColor: item.family
                        ? getColorFamilyRepresentative(item.family)
                        : "#ccc",
                    }}
                  />
                  <div>
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-gray-600">
                      {item.percentage}% see as{" "}
                      {item.family ? getColorFamilyLabel(item.family) : "N/A"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              No days show strong consensus yet.
            </p>
          )}
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <h3 className="font-semibold text-orange-800 mb-3">
            High Variation
          </h3>
          {weakConsensus.length > 0 ? (
            <div className="space-y-2">
              {weakConsensus.map((item) => (
                <div key={item.name} className="text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-600"> — diverse associations</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              All days show moderate to strong consensus.
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500 italic">
        Strong agreement = top color family chosen by 40%+ of submissions. High
        variation = top choice under 30%.
      </p>
    </div>
  );
}
