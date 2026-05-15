import { NextRequest, NextResponse } from "next/server";
import { chatWithCustomer } from "@/lib/claude";
import { buildCustomerPrompt } from "@/lib/prompts";
import { Persona, CustomerResponse } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { persona, messages, manualContext } = (await req.json()) as {
      persona: Persona;
      messages: { role: string; content: string }[];
      manualContext?: string;
    };

    const systemPrompt = buildCustomerPrompt(persona, manualContext);

    const apiMessages = messages.map((m) => ({
      role: m.role === "customer" ? ("assistant" as const) : ("user" as const),
      content: m.content,
    }));

    const responseText = await chatWithCustomer(systemPrompt, apiMessages);
    const parsed: CustomerResponse = JSON.parse(responseText);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "대화 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
