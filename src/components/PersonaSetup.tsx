"use client";

import { Persona, EmotionTone } from "@/types";
import EmotionSelector from "./EmotionSelector";
import SpeedPitchSlider from "./SpeedPitchSlider";

interface Props {
  persona: Persona;
  onChange: (partial: Partial<Persona>) => void;
}

export default function PersonaSetup({ persona, onChange }: Props) {
  const speedLabel = () => {
    if (persona.voiceSpeed <= 0.7) return "매우 느림";
    if (persona.voiceSpeed <= 0.9) return "느림";
    if (persona.voiceSpeed <= 1.1) return "보통";
    if (persona.voiceSpeed <= 1.3) return "빠름";
    return "매우 빠름";
  };

  const pitchLabel = () => {
    if (persona.voicePitch <= -6) return "매우 낮음";
    if (persona.voicePitch <= -2) return "낮음";
    if (persona.voicePitch <= 2) return "보통";
    if (persona.voicePitch <= 6) return "높음";
    return "매우 높음";
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이름
          </label>
          <input
            type="text"
            value={persona.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            나이
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={persona.age}
              onChange={(e) => onChange({ age: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <span className="text-sm text-gray-500 shrink-0">세</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          성별
        </label>
        <div className="flex gap-4">
          {(["male", "female"] as const).map((g) => (
            <label key={g} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                checked={persona.gender === g}
                onChange={() => onChange({ gender: g })}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">
                {g === "male" ? "남성" : "여성"}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          상황 설명
        </label>
        <textarea
          value={persona.situation}
          onChange={(e) => onChange({ situation: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          감정 톤
        </label>
        <EmotionSelector
          value={persona.emotionTone}
          onChange={(emotionTone: EmotionTone) => onChange({ emotionTone })}
        />
      </div>

      <div className="space-y-3">
        <SpeedPitchSlider
          label="말하기 속도"
          value={persona.voiceSpeed}
          min={0.5}
          max={1.5}
          step={0.1}
          displayValue={speedLabel()}
          onChange={(voiceSpeed: number) => onChange({ voiceSpeed })}
        />
        <SpeedPitchSlider
          label="음성 높낮이"
          value={persona.voicePitch}
          min={-12}
          max={12}
          step={1}
          displayValue={pitchLabel()}
          onChange={(voicePitch: number) => onChange({ voicePitch })}
        />
      </div>
    </div>
  );
}
