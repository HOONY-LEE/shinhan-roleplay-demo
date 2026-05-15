"use client";

import { useRouter } from "next/navigation";
import { useConversationStore } from "@/hooks/useConversation";
import PersonaSetup from "@/components/PersonaSetup";
import ManualUploader from "@/components/ManualUploader";

export default function SetupPage() {
  const router = useRouter();
  const {
    persona,
    setPersona,
    manuals,
    addManual,
    removeManual,
    setManualContent,
    setPhase,
  } = useConversationStore();

  const handleStart = () => {
    const combinedManual = manuals.map((m) => m.content).join("\n\n---\n\n");
    setManualContent(combinedManual);
    setPhase("training");
    router.push("/training");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            🏦 AI 롤플레잉 교육 시스템
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            신한은행 창구 직원 응대 훈련 시뮬레이터
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            📋 페르소나 설정
          </h2>
          <PersonaSetup persona={persona} onChange={setPersona} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            📄 매뉴얼 업로드
          </h2>
          <ManualUploader
            manuals={manuals}
            onAdd={addManual}
            onRemove={removeManual}
          />
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 text-lg"
        >
          🎯 훈련 시작하기
        </button>
      </div>
    </div>
  );
}
