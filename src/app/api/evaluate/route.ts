import { NextRequest, NextResponse } from "next/server";
import { evaluateConversation } from "@/lib/claude";
import { buildEvaluationPrompt } from "@/lib/prompts";
import { ChatMessage, Persona, EvaluationResult } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { conversationHistory, manualContent, persona } =
      (await req.json()) as {
        conversationHistory: ChatMessage[];
        manualContent: string;
        persona: Persona;
      };

    const systemPrompt = buildEvaluationPrompt(manualContent);

    const userMessage = `## 고객 페르소나
${JSON.stringify(persona, null, 2)}

## 전체 대화 내용
${conversationHistory
  .map(
    (m) =>
      `[${m.role === "customer" ? "고객" : "직원"}] ${m.content}`
  )
  .join("\n")}

위 대화를 평가해주세요.`;

    const responseText = await evaluateConversation(systemPrompt, userMessage);
    const parsed: EvaluationResult = JSON.parse(responseText);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Evaluation API error:", error);
    return NextResponse.json(
      { error: "평가 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
