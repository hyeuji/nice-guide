"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface ItineraryItem {
  day: string;
  time: string;
  title: string;
  description: string;
  category: string;
}

interface ItineraryResult {
  summary: string;
  tips: string[];
  items: ItineraryItem[];
}

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ItineraryResult | null>(null);

  useEffect(() => {
    const destination = searchParams.get("destination");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const companion = searchParams.get("companion");
    const occupation = searchParams.get("occupation");

    if (!destination || !startDate || !endDate || !companion || !occupation) {
      setError("입력 정보가 부족합니다. 처음부터 다시 시작해주세요.");
      setLoading(false);
      return;
    }

    const fetchItinerary = async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            destination,
            startDate,
            endDate,
            companion,
            occupation,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "일정을 생성하는 중 오류가 발생했습니다.");
        }

        setResult(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2">맞춤 일정을 생성하고 있습니다</h2>
        <p className="text-gray-400 text-sm sm:text-base">최적의 추천을 위해 AI가 꼼꼼히 고민중이에요 (약 5~15초 소요)</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-red-400 text-5xl mb-4">⚠️</div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-red-500">생성 실패</h2>
        <p className="text-red-400/80 mb-8">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="px-8 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all font-semibold"
        >
          처음으로 돌아가기
        </button>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="flex flex-col mt-6 mb-12 w-full">
      {/* 요약 컨셉 */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 mb-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">
          {result.summary}
        </h1>
        <p className="text-gray-400">당신만을 위한 성공적 휴식을 위한 맞춤 추천입니다.</p>
      </div>

      {/* 여행 팁 */}
      <div className="mb-10 w-full">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>💡</span> 일정 백배 즐기기 꿀팁
        </h2>
        <ul className="space-y-3 bg-black border border-white/10 rounded-2xl p-5 sm:p-6 w-full">
          {result.tips.map((tip, idx) => (
            <li key={idx} className="flex gap-3 items-start text-gray-300 leading-relaxed text-sm sm:text-base">
              <span className="text-white bg-white/10 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5 shrink-0">
                {idx + 1}
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 상세 일정 카드 리스트 */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>🗺️</span> 상세 추천 리스트
        </h2>
        <div className="space-y-4 mb-12">
          {result.items.map((item, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/30 transition-all flex flex-col sm:flex-row sm:items-start gap-4">
              
              <div className="w-full sm:w-28 shrink-0 flex sm:flex-col gap-2 sm:gap-1 items-baseline sm:items-start border-b border-white/10 sm:border-0 pb-3 sm:pb-0 mb-1 sm:mb-0">
                <span className="text-gray-300 font-medium text-sm sm:text-base bg-white/10 px-2.5 py-1 rounded-lg">
                  {item.day}
                </span>
                {item.time && (
                  <span className="text-xs text-gray-500 font-medium ml-1 sm:ml-0">
                    {item.time}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">
                  {item.category === "hotel" ? "🏨" : item.category === "food" ? "🍽️" : item.category === "shopping" ? "🛍️" : item.category === "weather" ? "☀️" : "📍"} {item.title}
                </h3>
                <p className="text-white/50 text-sm sm:text-base leading-relaxed break-keep">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 돌아가기 액션 */}
      <div className="flex justify-center mt-4 w-full">
        <button
          onClick={() => router.push("/")}
          className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 focus:scale-95 transition-all text-base sm:text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          다시 만들기
        </button>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 flex flex-col max-w-4xl mx-auto font-sans">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      }>
        <ResultContent />
      </Suspense>
    </div>
  );
}
