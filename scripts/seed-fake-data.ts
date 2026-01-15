/**
 * Seed script to add fake submissions to the database
 * Run with: npx tsx scripts/seed-fake-data.ts
 */

import { PrismaClient } from "@prisma/client";
import { createColorValue, type ColorFamily } from "../lib/color";

const prisma = new PrismaClient();

// Representative colors for each family
const familyColors: Record<ColorFamily, string> = {
  red: "#DC2626",
  orange: "#EA580C",
  yellow: "#FACC15",
  green: "#16A34A",
  cyan: "#06B6D4",
  blue: "#2563EB",
  purple: "#9333EA",
  pink: "#EC4899",
  gray: "#6B7280",
  black: "#1F2937",
  white: "#F3F4F6",
};

const allFamilies: ColorFamily[] = [
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "blue",
  "purple",
  "pink",
  "gray",
  "black",
  "white",
];

// Weighted random selection (some colors more popular)
function getWeightedRandomFamily(weights?: Record<string, number>): ColorFamily {
  if (!weights) {
    return allFamilies[Math.floor(Math.random() * allFamilies.length)];
  }

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (const [family, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) {
      return family as ColorFamily;
    }
  }

  return allFamilies[0];
}

// Create some patterns for more interesting data
const monthPatterns = {
  // January tends towards blue/white (winter)
  0: { blue: 4, white: 3, cyan: 2, gray: 1 },
  // February - pink/red (Valentine's)
  1: { pink: 4, red: 3, purple: 2 },
  // March - green (spring)
  2: { green: 4, yellow: 2, cyan: 2 },
  // April - yellow/green (spring)
  3: { yellow: 3, green: 4, pink: 2 },
  // May - green (spring)
  4: { green: 5, yellow: 3 },
  // June - yellow (summer)
  5: { yellow: 4, orange: 3, green: 2 },
  // July - red (fireworks/heat)
  6: { red: 5, orange: 3, yellow: 2 },
  // August - orange/yellow (heat)
  7: { orange: 5, yellow: 3, red: 2 },
  // September - orange (fall)
  8: { orange: 5, red: 3, yellow: 2 },
  // October - orange (Halloween)
  9: { orange: 6, black: 3, purple: 2 },
  // November - brown/orange (fall)
  10: { orange: 4, red: 3, yellow: 2 },
  // December - red/green (holidays)
  11: { red: 4, green: 4, white: 2 },
};

const dowPatterns = {
  // Monday - blue (Monday blues)
  0: { blue: 5, gray: 3, black: 2 },
  // Tuesday - less consensus
  1: {},
  // Wednesday - green (middle, neutral)
  2: { green: 3, yellow: 2 },
  // Thursday - orange (almost Friday)
  3: { orange: 3, yellow: 2 },
  // Friday - yellow/gold (excitement)
  4: { yellow: 5, orange: 3, red: 2 },
  // Saturday - no strong pattern
  5: {},
  // Sunday - various (rest day)
  6: { white: 2, blue: 2, yellow: 2 },
};

async function generateFakeSubmissions(count: number) {
  console.log(`Generating ${count} fake submissions...`);

  for (let i = 0; i < count; i++) {
    // Generate months with some patterns
    const months = Array.from({ length: 12 }, (_, monthIndex) => {
      // 20% chance of null
      if (Math.random() < 0.2) return null;

      const family = getWeightedRandomFamily(monthPatterns[monthIndex as keyof typeof monthPatterns]);
      return createColorValue(familyColors[family]);
    });

    // Generate days of week with some patterns
    const daysOfWeek = Array.from({ length: 7 }, (_, dowIndex) => {
      // 15% chance of null
      if (Math.random() < 0.15) return null;

      const family = getWeightedRandomFamily(dowPatterns[dowIndex as keyof typeof dowPatterns]);
      return createColorValue(familyColors[family]);
    });

    // Generate days of month - more random, less pattern
    const daysOfMonth = Array.from({ length: 31 }, () => {
      // 30% chance of null (people less likely to fill all 31)
      if (Math.random() < 0.3) return null;

      const family = getWeightedRandomFamily();
      return createColorValue(familyColors[family]);
    });

    await prisma.submission.create({
      data: {
        monthsJson: JSON.stringify(months),
        daysOfWeekJson: JSON.stringify(daysOfWeek),
        daysOfMonthJson: JSON.stringify(daysOfMonth),
      },
    });

    if ((i + 1) % 10 === 0) {
      console.log(`Created ${i + 1}/${count} submissions...`);
    }
  }

  console.log(`✅ Successfully created ${count} fake submissions!`);
}

async function main() {
  const numSubmissions = parseInt(process.argv[2] || "50", 10);

  console.log("Starting database seed...");
  await generateFakeSubmissions(numSubmissions);

  const total = await prisma.submission.count();
  console.log(`Total submissions in database: ${total}`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

