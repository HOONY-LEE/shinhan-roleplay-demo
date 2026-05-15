"use client";

import { create } from "zustand";
import {
  Persona,
  ChatMessage,
  CustomerResponse,
  EvaluationResult,
  AppPhase,
  UploadedManual,
} from "@/types";

interface ConversationState {
  phase: AppPhase;
  persona: Persona;
  messages: ChatMessage[];
  manuals: UploadedManual[];
  manualContent: string;
  evaluation: EvaluationResult | null;
  isLoading: boolean;
  elapsedSeconds: number;

  setPhase: (phase: AppPhase) => void;
  setPersona: (persona: Partial<Persona>) => void;
  addManual: (manual: UploadedManual) => void;
  removeManual: (name: string) => void;
  setManualContent: (content: string) => void;
  addMessage: (message: ChatMessage) => void;
  setEvaluation: (result: EvaluationResult) => void;
  setLoading: (loading: boolean) => void;
  setElapsedSeconds: (seconds: number) => void;
  reset: () => void;
}

const defaultPersona: Persona = {
  name: "김민수",
  age: 64,
  gender: "male",
  situation:
    "집을 담보로 대출을 받아 주식 투자를 하려는 고객. 은퇴 후 여유자금 마련이 목적이며, 투자 경험은 거의 없음.",
  emotionTone: "angry",
  voiceSpeed: 1.0,
  voicePitch: 0,
};

export const useConversationStore = create<ConversationState>((set) => ({
  phase: "setup",
  persona: defaultPersona,
  messages: [],
  manuals: [],
  manualContent: "",
  evaluation: null,
  isLoading: false,
  elapsedSeconds: 0,

  setPhase: (phase) => set({ phase }),
  setPersona: (partial) =>
    set((state) => ({ persona: { ...state.persona, ...partial } })),
  addManual: (manual) =>
    set((state) => ({ manuals: [...state.manuals, manual] })),
  removeManual: (name) =>
    set((state) => ({
      manuals: state.manuals.filter((m) => m.name !== name),
    })),
  setManualContent: (content) => set({ manualContent: content }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setEvaluation: (result) => set({ evaluation: result }),
  setLoading: (loading) => set({ isLoading: loading }),
  setElapsedSeconds: (seconds) => set({ elapsedSeconds: seconds }),
  reset: () =>
    set({
      phase: "setup",
      messages: [],
      evaluation: null,
      isLoading: false,
      elapsedSeconds: 0,
    }),
}));
