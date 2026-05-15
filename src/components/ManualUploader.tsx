"use client";

import { useCallback } from "react";
import { UploadedManual } from "@/types";

interface Props {
  manuals: UploadedManual[];
  onAdd: (manual: UploadedManual) => void;
  onRemove: (name: string) => void;
}

export default function ManualUploader({ manuals, onAdd, onRemove }: Props) {
  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (!["pdf", "txt", "docx"].includes(ext || "")) {
          alert("PDF, TXT, DOCX 파일만 지원합니다.");
          continue;
        }
        const content = await file.text();
        onAdd({
          name: file.name,
          size: file.size,
          content,
        });
      }
    },
    [onAdd]
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="space-y-3">
      <label
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <div className="text-center">
          <p className="text-2xl mb-1">📁</p>
          <p className="text-sm text-gray-500">
            파일을 드래그하거나 클릭하세요
          </p>
          <p className="text-xs text-gray-400 mt-1">PDF, TXT, DOCX 지원</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".pdf,.txt,.docx"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {manuals.map((m) => (
        <div
          key={m.name}
          className="flex items-center justify-between px-3 py-2 bg-green-50 rounded-lg text-sm"
        >
          <span className="text-green-700">
            ✅ {m.name} ({formatSize(m.size)})
          </span>
          <button
            type="button"
            onClick={() => onRemove(m.name)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
