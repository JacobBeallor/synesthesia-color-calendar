/**
 * Shared TypeScript types for Color³
 */

import { ColorFamily } from "@/lib/color";

export interface FamilyCount {
  family: ColorFamily;
  count: number;
  percentage: number;
}

export interface AggregateData {
  totalSubmissions: number;
  months: Record<number, FamilyCount[]>;
  daysOfWeek: Record<number, FamilyCount[]>;
  daysOfMonth: Record<number, FamilyCount[]>;
}

export interface SubmissionPayload {
  months: Array<{ hex: string; family: ColorFamily }>;
  daysOfMonth: Array<{ hex: string; family: ColorFamily }>;
  daysOfWeek: Array<{ hex: string; family: ColorFamily }>;
}

