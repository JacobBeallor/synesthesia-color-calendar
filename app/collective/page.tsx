"use client";

import { useEffect, useState } from "react";
import {
  getColorFamilyLabel,
  getColorFamilyRepresentative,
  ColorFamily,
} from "@/lib/color";
import { getMonthName, getDayOfWeekName } from "@/lib/color3";

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading collective patterns...
          </p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">
            {error || "Failed to load data"}
          </p>
        </div>
      </main>
    );
  }

  if (data.totalSubmissions === 0) {
    return (
      <main className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold mb-4">Collective Patterns</h1>
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No submissions yet. Be the first to share your color mapping!
            </p>
            <a
              href="/personal"
              className="inline-block mt-6 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Create Your Mapping →
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-16 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            Collective Patterns
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Aggregate color associations from <span className="font-bold text-indigo-600 dark:text-indigo-400">{data.totalSubmissions}</span>{" "}
            {data.totalSubmissions === 1 ? "submission" : "submissions"}
          </p>
        </div>

        {/* Days of Week */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Days of Week</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            How do people collectively associate colors with each day?
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5, 6].map((dow) => (
              <ColorDistribution
                key={dow}
                title={getDayOfWeekName(dow)}
                counts={data.daysOfWeek[dow] || []}
              />
            ))}
          </div>
        </section>

        {/* Months */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Months</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            What colors emerge for each month?
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => (
              <ColorDistribution
                key={month}
                title={getMonthName(month)}
                counts={data.months[month] || []}
              />
            ))}
          </div>
        </section>

        {/* Consensus Insight */}
        <section className="mb-12 border-t border-gray-200 dark:border-gray-800 pt-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Consensus & Variation
          </h2>
          <ConsensusAnalysis data={data} />
        </section>

        {/* Call to Action */}
        <section className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="text-center bg-indigo-50 dark:bg-indigo-950/30 rounded-lg p-8 border-l-4 border-indigo-500">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
              Add Your Perspective
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
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

function ColorDistribution({
  title,
  counts,
}: {
  title: string;
  counts: FamilyCount[];
}) {
  const topFamily = counts[0];

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
      <h3 className="font-semibold mb-3">{title}</h3>

      {counts.length === 0 ? (
        <p className="text-sm text-gray-500">No data yet</p>
      ) : (
        <div className="space-y-2">
          {counts.slice(0, 3).map((item) => (
            <div key={item.family}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">{getColorFamilyLabel(item.family)}</span>
                <span className="text-sm font-medium">{item.percentage}%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
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
          {counts.length > 3 && (
            <p className="text-xs text-gray-500 mt-2">
              +{counts.length - 3} more colors
            </p>
          )}
        </div>
      )}

      {topFamily && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded"
              style={{
                backgroundColor: getColorFamilyRepresentative(topFamily.family),
              }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Most common: {getColorFamilyLabel(topFamily.family)}
            </span>
          </div>
        </div>
      )}
    </div>
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
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3">
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
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {item.percentage}% see as{" "}
                      {item.family ? getColorFamilyLabel(item.family) : "N/A"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No days show strong consensus yet.
            </p>
          )}
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
          <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">
            High Variation
          </h3>
          {weakConsensus.length > 0 ? (
            <div className="space-y-2">
              {weakConsensus.map((item) => (
                <div key={item.name} className="text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {" "}
                    — diverse associations
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All days show moderate to strong consensus.
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-500 italic">
        Strong agreement = top color family chosen by 40%+ of submissions.
        High variation = top choice under 30%.
      </p>
    </div>
  );
}

