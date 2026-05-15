"use client";

import { useState, useCallback, useRef } from "react";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useTTSWithSubtitle() {
  const [currentText, setCurrentText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playWithSubtitle = useCallback(
    async (fullText: string, audioBuffer: ArrayBuffer) => {
      const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      const words = fullText.split(" ");

      const durationPromise = new Promise<number>((resolve) => {
        audio.addEventListener("loadedmetadata", () => {
          resolve(audio.duration * 1000);
        });
        // fallback: 평균 한국어 TTS 속도 기준 추정
        setTimeout(() => resolve(words.length * 300), 2000);
      });

      const audioDuration = await durationPromise;
      const avgWordDuration = audioDuration / words.length;

      setIsPlaying(true);
      setCurrentText("");
      audio.play();

      let displayedText = "";
      for (let i = 0; i < words.length; i++) {
        displayedText += (i > 0 ? " " : "") + words[i];
        setCurrentText(displayedText);
        await delay(avgWordDuration);
      }

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };
    },
    []
  );

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentText("");
  }, []);

  return { currentText, isPlaying, playWithSubtitle, stop };
}
