export interface Persona {
  name: string;
  age: number;
  gender: "male" | "female";
  situation: string;
  emotionTone: EmotionTone;
  voiceSpeed: number;
  voicePitch: number;
}

export type EmotionTone = "angry" | "calm" | "friendly" | "anxious";

export type EmotionState =
  | "angry"
  | "calm"
  | "friendly"
  | "anxious"
  | "satisfied";

export interface CustomerResponse {
  message: string;
  emotion: EmotionState;
  isConversationEnd: boolean;
}

export interface ChatMessage {
  role: "customer" | "employee";
  content: string;
  emotion?: EmotionState;
  timestamp: number;
}

export interface EvaluationItem {
  name: string;
  score: number;
  status: "pass" | "warning" | "fail";
  comment: string;
}

export interface EvaluationResult {
  totalScore: number;
  grade: string;
  items: EvaluationItem[];
  overallComment: string;
  missedItems: string[];
}

export interface VoicePreset {
  voiceId: string;
  pitch: number;
  speed: number;
}

export interface TTSOptions {
  text: string;
  voiceId: string;
  speed: number;
  pitch: number;
  emotion: string;
}

export type AppPhase = "setup" | "training" | "evaluation";

export interface UploadedManual {
  name: string;
  size: number;
  content: string;
}
