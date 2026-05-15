"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useConversationStore } from "@/hooks/useConversation";
import { useTTSWithSubtitle } from "@/hooks/useTTSWithSubtitle";
import { getVoicePresetKey, VOICE_PRESETS } from "@/lib/supertone";
import ChatBubble from "@/components/ChatBubble";
import VoiceWaveform from "@/components/VoiceWaveform";
import { CustomerResponse, EmotionState } from "@/types";

export default function TrainingPage() {
  const router = useRouter();
  const {
    persona,
    messages,
    manualContent,
    addMessage,
    setPhase,
    isLoading,
    setLoading,
    elapsedSeconds,
    setElapsedSeconds,
  } = useConversationStore();

  const [inputText, setInputText] = useState("");
  const [waitingForAI, setWaitingForAI] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionState>(
    persona.emotionTone
  );
  const { currentText, isPlaying, playWithSubtitle } = useTTSWithSubtitle();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(elapsedSeconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [elapsedSeconds, setElapsedSeconds]);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const sendToAI = useCallback(
    async (currentMessages: { role: string; content: string }[]) => {
      setWaitingForAI(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            persona,
            messages: currentMessages,
            manualContent,
          }),
        });
        const data: CustomerResponse = await res.json();

        setCurrentEmotion(data.emotion);
        addMessage({
          role: "customer",
          content: data.message,
          emotion: data.emotion,
          timestamp: Date.now(),
        });

        // TTS 재생
        try {
          const presetKey = getVoicePresetKey(persona.age, persona.gender);
          const preset = VOICE_PRESETS[presetKey];
          const ttsRes = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: data.message,
              voiceId: preset.voiceId,
              emotion: data.emotion,
              speed: persona.voiceSpeed,
              pitch: persona.voicePitch,
            }),
          });
          if (ttsRes.ok) {
            const audioBuffer = await ttsRes.arrayBuffer();
            await playWithSubtitle(data.message, audioBuffer);
          }
        } catch {
          // TTS 실패 시 무시 (텍스트는 이미 표시됨)
        }

        if (data.isConversationEnd) {
          setTimeout(() => {
            setPhase("evaluation");
            router.push("/evaluation");
          }, 2000);
        }
      } catch (error) {
        console.error("AI 응답 오류:", error);
      } finally {
        setWaitingForAI(false);
      }
    },
    [
      persona,
      manualContent,
      addMessage,
      playWithSubtitle,
      setPhase,
      router,
    ]
  );

  useEffect(() => {
    if (!initialized.current && messages.length === 0) {
      initialized.current = true;
      sendToAI([]);
    }
  }, [messages.length, sendToAI]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentText]);

  const handleSend = async () => {
    if (!inputText.trim() || waitingForAI || isPlaying) return;

    const employeeMsg = inputText.trim();
    setInputText("");

    addMessage({
      role: "employee",
      content: employeeMsg,
      timestamp: Date.now(),
    });

    const allMsgs = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "employee", content: employeeMsg },
    ];

    await sendToAI(allMsgs);
  };

  const handleEnd = () => {
    setPhase("evaluation");
    router.push("/evaluation");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">
          🏦 AI 롤플레잉 훈련 중
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-mono text-gray-500">
            ⏱ {formatTime(elapsedSeconds)}
          </span>
          <button
            onClick={handleEnd}
            className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
          >
            종료
          </button>
        </div>
      </div>

      {/* Persona Info */}
      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
            👤
          </div>
          <div>
            <span className="font-semibold text-gray-800 text-sm">
              {persona.name}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              {persona.age}세 {persona.gender === "male" ? "남성" : "여성"} |{" "}
              {
                { angry: "😠 화남", calm: "😐 차분", friendly: "😊 친절", anxious: "😰 불안" }[
                  currentEmotion as string
                ] || currentEmotion
              }
            </span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.map((msg, i) => (
          <ChatBubble
            key={i}
            role={msg.role}
            content={msg.content}
            emotion={msg.emotion}
          />
        ))}

        {/* 현재 TTS 재생 중인 텍스트 (아직 messages에 없는 경우) */}
        {isPlaying && currentText && (
          <VoiceWaveform isPlaying={isPlaying} />
        )}

        {waitingForAI && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-500">
              고객이 생각 중
              <span className="animate-pulse">...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="여기에 응대 내용을 입력..."
            disabled={waitingForAI || isPlaying}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || waitingForAI || isPlaying}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
