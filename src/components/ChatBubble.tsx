"use client";

import { EmotionState } from "@/types";

const EMOTION_STYLES: Record<EmotionState, string> = {
  angry: "border-red-400 bg-red-50",
  calm: "border-gray-300 bg-gray-50",
  friendly: "border-blue-400 bg-blue-50",
  anxious: "border-orange-400 bg-orange-50",
  satisfied: "border-green-400 bg-green-50",
};

const EMOTION_EMOJI: Record<EmotionState, string> = {
  angry: "😠",
  calm: "😐",
  friendly: "😊",
  anxious: "😰",
  satisfied: "😌",
};

interface Props {
  role: "customer" | "employee";
  content: string;
  emotion?: EmotionState;
  isTyping?: boolean;
}

export default function ChatBubble({
  role,
  content,
  emotion,
  isTyping,
}: Props) {
  const isCustomer = role === "customer";

  return (
    <div
      className={`flex ${isCustomer ? "justify-start" : "justify-end"} mb-4`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 border-2 ${
          isCustomer
            ? EMOTION_STYLES[emotion || "calm"]
            : "border-indigo-300 bg-indigo-50"
        }`}
      >
        {isCustomer && emotion && (
          <span className="text-xs text-gray-500 mb-1 block">
            {EMOTION_EMOJI[emotion]} 고객
          </span>
        )}
        {!isCustomer && (
          <span className="text-xs text-indigo-500 mb-1 block">🏦 직원</span>
        )}
        <p className="text-gray-800 text-sm leading-relaxed">
          {content}
          {isTyping && (
            <span className="inline-block ml-1 animate-pulse">▌</span>
          )}
        </p>
      </div>
    </div>
  );
}
