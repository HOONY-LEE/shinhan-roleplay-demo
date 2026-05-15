"use client";

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (value: number) => void;
}

export default function SpeedPitchSlider({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
}: Props) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600 w-24 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <span className="text-sm text-gray-500 w-12 text-right">
        {displayValue}
      </span>
    </div>
  );
}
