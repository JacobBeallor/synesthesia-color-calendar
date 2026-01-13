"use client";

import { getColorFamilyLabel, ColorFamily } from "@/lib/color";

interface ColorPickerProps {
  label: string;
  value: string | null;
  family: ColorFamily | null;
  onChange: (hex: string) => void;
}

export default function ColorPicker({
  label,
  value,
  family,
  onChange,
}: ColorPickerProps) {
  const isSelected = value !== null;
  
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          type="color"
          value={value ?? "#888888"}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-20 rounded-lg cursor-pointer border-2 ${
            isSelected 
              ? "border-gray-300" 
              : "border-dashed border-gray-400"
          }`}
          style={{
            backgroundColor: value ?? "#e5e7eb",
          }}
        />
        {!isSelected && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xs text-gray-500 font-medium bg-white/80 px-2 py-1 rounded">
              Not selected
            </span>
          </div>
        )}
        <div className="mt-2 text-xs text-center text-gray-500">
          {family ? getColorFamilyLabel(family) : "—"}
        </div>
      </div>
    </div>
  );
}

