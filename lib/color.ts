/**
 * Color classification utilities for Color³
 * Converts HEX colors to HSL/HSV and maps them to color families
 */

export type ColorFamily =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "cyan"
  | "blue"
  | "purple"
  | "pink"
  | "gray"
  | "black"
  | "white";

export interface ColorValue {
  hex: string;
  family: ColorFamily;
}

/**
 * Converts HEX to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
}

/**
 * Converts RGB to HSL
 * Returns h in [0, 360], s and l in [0, 100]
 */
function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / delta + 2) / 6;
        break;
      case b:
        h = ((r - g) / delta + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Converts HEX to HSL
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

/**
 * Classifies a color into a color family based on HSL values
 * Uses deterministic ranges with special handling for low saturation (gray/black/white)
 */
export function classifyColorFamily(hex: string): ColorFamily {
  const { h, s, l } = hexToHsl(hex);

  // Handle achromatic colors (low saturation)
  if (s < 10) {
    if (l < 20) return "black";
    if (l > 85) return "white";
    return "gray";
  }

  // Handle very dark or very light colors
  if (l < 15) return "black";
  if (l > 90 && s < 20) return "white";

  // Classify by hue (0-360 degrees)
  // Red: 0-15, 345-360
  if (h >= 345 || h < 15) return "red";

  // Orange: 15-45
  if (h >= 15 && h < 45) return "orange";

  // Yellow: 45-70
  if (h >= 45 && h < 70) return "yellow";

  // Green: 70-160
  if (h >= 70 && h < 160) return "green";

  // Cyan: 160-200
  if (h >= 160 && h < 200) return "cyan";

  // Blue: 200-260
  if (h >= 200 && h < 260) return "blue";

  // Purple: 260-300
  if (h >= 260 && h < 300) return "purple";

  // Pink/Magenta: 300-345
  if (h >= 300 && h < 345) return "pink";

  // Fallback (shouldn't reach here)
  return "gray";
}

/**
 * Creates a ColorValue object from a HEX color
 */
export function createColorValue(hex: string): ColorValue {
  return {
    hex: hex.toUpperCase(),
    family: classifyColorFamily(hex),
  };
}

/**
 * Validates a HEX color string
 */
export function isValidHex(hex: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(hex);
}

/**
 * Returns a human-readable label for a color family
 */
export function getColorFamilyLabel(family: ColorFamily): string {
  const labels: Record<ColorFamily, string> = {
    red: "Red",
    orange: "Orange",
    yellow: "Yellow",
    green: "Green",
    cyan: "Cyan",
    blue: "Blue",
    purple: "Purple",
    pink: "Pink",
    gray: "Gray",
    black: "Black",
    white: "White",
  };
  return labels[family];
}

/**
 * Returns a representative color for a color family (for display purposes)
 */
export function getColorFamilyRepresentative(family: ColorFamily): string {
  const representatives: Record<ColorFamily, string> = {
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
  return representatives[family];
}

