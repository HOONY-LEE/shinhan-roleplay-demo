"use client";

interface Props {
  isPlaying: boolean;
}

export default function VoiceWaveform({ isPlaying }: Props) {
  if (!isPlaying) return null;

  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-blue-500 rounded-full animate-pulse"
          style={{
            height: `${Math.random() * 20 + 8}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${0.4 + Math.random() * 0.4}s`,
          }}
        />
      ))}
      <span className="text-xs text-gray-500 ml-2">TTS 재생 중...</span>
    </div>
  );
}
