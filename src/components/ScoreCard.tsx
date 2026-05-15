"use client";

interface Props {
  totalScore: number;
  grade: string;
}

export default function ScoreCard({ totalScore, grade }: Props) {
  const getColor = () => {
    if (totalScore >= 90) return "text-green-600 border-green-300 bg-green-50";
    if (totalScore >= 70) return "text-blue-600 border-blue-300 bg-blue-50";
    if (totalScore >= 50)
      return "text-orange-600 border-orange-300 bg-orange-50";
    return "text-red-600 border-red-300 bg-red-50";
  };

  return (
    <div
      className={`inline-flex flex-col items-center justify-center w-32 h-32 rounded-2xl border-2 ${getColor()}`}
    >
      <span className="text-4xl font-bold">{totalScore}</span>
      <span className="text-sm opacity-70">/100</span>
      <span className="text-lg font-semibold mt-1">{grade}</span>
    </div>
  );
}
