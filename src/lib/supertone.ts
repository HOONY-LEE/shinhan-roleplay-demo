import { EmotionState, VoicePreset } from "@/types";

export const VOICE_PRESETS: Record<string, VoicePreset> = {
  elderly_male: { voiceId: "kr_elderly_male_01", pitch: -3, speed: 0.85 },
  elderly_female: { voiceId: "kr_elderly_female_01", pitch: 2, speed: 0.8 },
  middle_male: { voiceId: "kr_adult_male_01", pitch: 0, speed: 1.0 },
  middle_female: { voiceId: "kr_adult_female_01", pitch: 1, speed: 1.0 },
  young_male: { voiceId: "kr_young_male_01", pitch: 1, speed: 1.1 },
  young_female: { voiceId: "kr_young_female_01", pitch: 3, speed: 1.1 },
  child: { voiceId: "kr_child_01", pitch: 5, speed: 1.2 },
};

export const EMOTION_MODIFIERS: Record<
  EmotionState,
  { speed: number; pitch: number; emphasis: number }
> = {
  angry: { speed: 1.15, pitch: 2, emphasis: 1.3 },
  calm: { speed: 0.9, pitch: -1, emphasis: 0.8 },
  friendly: { speed: 1.0, pitch: 1, emphasis: 1.0 },
  anxious: { speed: 1.1, pitch: 1, emphasis: 1.1 },
  satisfied: { speed: 0.95, pitch: 0, emphasis: 0.9 },
};

export function getVoicePresetKey(
  age: number,
  gender: "male" | "female"
): string {
  if (age < 15) return "child";
  if (age < 35) return gender === "male" ? "young_male" : "young_female";
  if (age < 55) return gender === "male" ? "middle_male" : "middle_female";
  return gender === "male" ? "elderly_male" : "elderly_female";
}

export async function generateSpeech(options: {
  text: string;
  voiceId: string;
  speed: number;
  pitch: number;
  emotion: string;
}): Promise<ArrayBuffer> {
  const response = await fetch("https://api.supertone.ai/v1/tts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SUPERTONE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: options.text,
      voice_id: options.voiceId,
      speed: options.speed,
      pitch: options.pitch,
      emotion: options.emotion,
      language: "ko",
      output_format: "mp3",
    }),
  });

  if (!response.ok) {
    throw new Error(`TTS API error: ${response.status}`);
  }

  return response.arrayBuffer();
}
