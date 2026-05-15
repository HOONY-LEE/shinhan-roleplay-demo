"use client";

import { EmotionTone } from "@/types";

const EMOTIONS: { value: EmotionTone; label: string; emoji: string }[] = [
  { value: "angry", label: "화남", emoji: "😠" },
  { value: "calm", label: "차분", emoji: "😐" },
  { value: "friendly", label: "친절", emoji: "😊" },
  { value: "anxious", label: "불안", emoji: "😰" },
];

interface Props {
  value: EmotionTone;
  onChange: (tone: EmotionTone) => void;
}

export default function EmotionSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {EMOTIONS.map((emo) => (
        <button
          key={emo.value}
          type="button"
          onClick={() => onChange(emo.value)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all
            ${
              value === emo.value
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
        >
          <span className="text-lg">{emo.emoji}</span>
          {emo.label}
        </button>
      ))}
    </div>
  );
}
