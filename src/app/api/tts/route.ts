import { NextRequest, NextResponse } from "next/server";
import { generateSpeech, EMOTION_MODIFIERS } from "@/lib/supertone";
import { EmotionState } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId, emotion, speed, pitch } = (await req.json()) as {
      text: string;
      voiceId: string;
      emotion: EmotionState;
      speed: number;
      pitch: number;
    };

    const mod = EMOTION_MODIFIERS[emotion] || EMOTION_MODIFIERS.calm;

    const audioBuffer = await generateSpeech({
      text,
      voiceId,
      speed: speed * mod.speed,
      pitch: pitch + mod.pitch,
      emotion,
    });

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("TTS API error:", error);
    return NextResponse.json(
      { error: "음성 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
