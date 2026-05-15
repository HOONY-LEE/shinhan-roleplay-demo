"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConversationStore } from "@/hooks/useConversation";
import EvaluationReport from "@/components/EvaluationReport";
import { EvaluationResult } from "@/types";

export default function EvaluationPage() {
  const router = useRouter();
  const { persona, messages, manualContent, evaluation, setEvaluation, reset } =
    useConversationStore();
  const [loading, setLoading] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    if (evaluation || loading || messages.length === 0) return;

    const runEvaluation = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationHistory: messages,
            manualContent: manualContent || "매뉴얼이 업로드되지 않았습니다.",
            persona,
          }),
        });
        const data: EvaluationResult = await res.json();
        setEvaluation(data);
      } catch (error) {
        console.error("평가 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    runEvaluation();
  }, [evaluation, loading, messages, manualContent, persona, setEvaluation]);

  const handleRetry = () => {
    reset();
    router.push("/training");
  };

  const handleHome = () => {
    reset();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          📊 응대 평가 결과
        </h1>

        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">AI가 응대 내용을 평가하고 있습니다...</p>
          </div>
        )}

        {evaluation && <EvaluationReport result={evaluation} />}

        {/* Transcript Toggle */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-700">
              📝 대화 전문 보기
            </span>
            <span className="text-gray-400">
              {showTranscript ? "▲" : "▼"}
            </span>
          </button>
          {showTranscript && (
            <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3 max-h-96 overflow-y-auto">
              {messages.map((msg, i) => (
                <div key={i} className="text-sm">
                  <span
                    className={`font-medium ${
                      msg.role === "customer"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    [{msg.role === "customer" ? "고객" : "직원"}]
                  </span>{" "}
                  <span className="text-gray-700">{msg.content}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleRetry}
            className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            🔄 다시 훈련하기
          </button>
          <button
            onClick={handleHome}
            className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
          >
            🏠 처음으로
          </button>
        </div>
      </div>
    </div>
  );
}
