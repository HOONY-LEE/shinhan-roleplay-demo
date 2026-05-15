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

const EMOTION_TO_STYLE: Record<EmotionState, string> = {
  angry: "angry",
  calm: "neutral",
  friendly: "happy",
  anxious: "fearful",
  satisfied: "happy",
};

export const EMOTION_MODIFIERS: Record<
  EmotionState,
  { speed: number; pitch: number; pitchVariance: number }
> = {
  angry: { speed: 1.15, pitch: 2, pitchVariance: 1.4 },
  calm: { speed: 0.9, pitch: -1, pitchVariance: 0.7 },
  friendly: { speed: 1.0, pitch: 1, pitchVariance: 1.0 },
  anxious: { speed: 1.1, pitch: 1, pitchVariance: 1.3 },
  satisfied: { speed: 0.95, pitch: 0, pitchVariance: 0.9 },
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
  emotion: EmotionState;
}): Promise<{ audio: ArrayBuffer; durationSec: number }> {
  const style = EMOTION_TO_STYLE[options.emotion] || "neutral";
  const mod = EMOTION_MODIFIERS[options.emotion] || EMOTION_MODIFIERS.calm;

  const response = await fetch(
    `https://open-api.supertone.ai/v1/text-to-speech/${options.voiceId}?output_format=mp3`,
    {
      method: "POST",
      headers: {
        "x-sup-api-key": process.env.SUPERTONE_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: options.text,
        language: "ko",
        style,
        voice_settings: {
          pitch_shift: Math.max(-12, Math.min(12, options.pitch + mod.pitch)),
          speed: Math.max(0.5, Math.min(2, options.speed * mod.speed)),
          pitch_variance: mod.pitchVariance,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`TTS API error: ${response.status}`);
  }

  const durationSec = parseFloat(
    response.headers.get("X-Audio-Length") || "0"
  );
  const audio = await response.arrayBuffer();

  return { audio, durationSec };
}
