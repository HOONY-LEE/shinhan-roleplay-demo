"use client";

import { EvaluationResult } from "@/types";
import ScoreCard from "./ScoreCard";

const STATUS_ICON: Record<string, string> = {
  pass: "✅",
  warning: "⚠️",
  fail: "❌",
};

interface Props {
  result: EvaluationResult;
}

export default function EvaluationReport({ result }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <ScoreCard totalScore={result.totalScore} grade={result.grade} />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">종합 점수</h3>
          <p className="text-sm text-gray-500 mt-1">{result.grade} 등급</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700">점검 항목별 평가</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {result.items.map((item, i) => (
            <div key={i} className="px-4 py-3 flex items-start gap-3">
              <span className="text-lg">{STATUS_ICON[item.status]}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">
                    {item.name}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      item.score >= 8
                        ? "text-green-600"
                        : item.score >= 5
                          ? "text-orange-500"
                          : "text-red-500"
                    }`}
                  >
                    {item.score}/10
                  </span>
                </div>
                {item.comment && (
                  <p className="text-xs text-gray-500 mt-1">{item.comment}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
        <h3 className="font-semibold text-blue-800 mb-2">💡 AI 코멘트</h3>
        <p className="text-sm text-blue-700 leading-relaxed">
          {result.overallComment}
        </p>
      </div>

      {result.missedItems.length > 0 && (
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <h3 className="font-semibold text-red-800 mb-2">
            ⚠️ 누락된 필수 절차
          </h3>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {result.missedItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
