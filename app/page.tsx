"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DESTINATIONS = [
  { id: "tokyo", emoji: "🗼", name: "도쿄, 일본", desc: "주말 활용 짧은 도심 휴가" },
  { id: "bangkok", emoji: "🌴", name: "방콕, 태국", desc: "럭셔리 호캉스와 나이트라이프" },
  { id: "danang", emoji: "🏖️", name: "다낭, 베트남", desc: "피로를 녹이는 마사지와 휴양" },
  { id: "osaka", emoji: "🍣", name: "오사카, 일본", desc: "스트레스 푸는 완벽한 식도락" },
  { id: "bali", emoji: "🧘‍♀️", name: "발리, 인니", desc: "대자연 속 완벽한 힐링" },
  { id: "taipei", emoji: "🥟", name: "타이베이, 대만", desc: "퇴근 후 떠나는 미식과 온천" },
  { id: "singapore", emoji: "🏙️", name: "싱가포르", desc: "세련된 도시 인프라와 야경" },
  { id: "guam", emoji: "🏄‍♂️", name: "괌, 미국", desc: "짧은 비행, 에메랄드빛 바다" }
];

const COMPANIONS = ["혼자 훌쩍", "친구와 함께", "연인과 오붓하게", "가족과 다같이", "동료들과"];
const OCCUPATIONS = ["IT 개발자", "디자이너", "기획/PM", "마케터", "영업/관리직", "자유로운 프리랜서"];

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedDest, setSelectedDest] = useState<string | null>(null);

  // 2단계 폼 상태
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [companion, setCompanion] = useState<string | null>(null);
  const [occupation, setOccupation] = useState<string | null>(null);

  const handleNextStep1 = () => {
    if (selectedDest) setStep(2);
  };

  const handlePrev = () => setStep(1);

  const handleSubmit = () => {
    if (!startDate || !endDate || !companion || !occupation || !selectedDest) return;
    
    const qs = new URLSearchParams({
      destination: selectedDest,
      startDate,
      endDate,
      companion,
      occupation
    });
    router.push(`/result?${qs.toString()}`);
  };

  const getDestName = () => DESTINATIONS.find((d) => d.id === selectedDest)?.name || "";

  // 모든 정보가 입력되었는지 확인하는 플래그
  const isFormComplete = Boolean(startDate && endDate && companion && occupation);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 flex flex-col font-sans">
      
      {/* Step 1: 여행지 선택 */}
      {step === 1 && (
        <div className="flex-1 mt-6 mb-12 flex flex-col max-w-5xl mx-auto w-full">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            어디로 떠나고 싶으신가요?
          </h1>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-10 leading-relaxed max-w-2xl break-keep">
            쉼이 필요한 직장인들을 위해 엄선했습니다. 가고 싶은 여행지를 선택하시면 완벽한 맞춤 일정을 준비해 드릴게요.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {DESTINATIONS.map((dest) => {
              const isSelected = selectedDest === dest.id;
              return (
                <button
                  key={dest.id}
                  onClick={() => setSelectedDest(dest.id)}
                  className={`flex flex-col items-start p-4 sm:p-5 rounded-2xl border transition-all duration-300 text-left cursor-pointer transform hover:-translate-y-1 ${
                    isSelected
                      ? "border-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                      : "border-white/10 bg-transparent hover:border-white/30 hover:bg-white/5"
                  }`}
                >
                  <span className="text-3xl sm:text-4xl mb-3 sm:mb-4">{dest.emoji}</span>
                  <h3 className="font-semibold text-base sm:text-lg mb-1.5 sm:mb-2 text-white">{dest.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-snug break-keep">{dest.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: 세부 정보 입력 */}
      {step === 2 && (
        <div className="flex-1 mt-6 mb-12 flex flex-col max-w-2xl mx-auto w-full">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
            조금 더 자세히 알려주세요
          </h1>
          <p className="text-gray-400 mb-10 text-sm sm:text-base leading-relaxed break-keep">
            [{getDestName()}] 여행을 위한 완벽한 맞춤 일정을 생성하기 위해 구체적인 정보가 필요해요.
          </p>

          <div className="space-y-12">
            
            {/* 1. 날짜 설정 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-200">언제 떠나시나요?</h2>
              <div className="flex items-center gap-3 sm:gap-4">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/50 w-full transition-all"
                  style={{ colorScheme: "dark" }}
                />
                <span className="text-gray-500 font-bold">~</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/50 w-full transition-all"
                  style={{ colorScheme: "dark" }}
                />
              </div>
            </section>

            {/* 2. 동행 설정 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-200">누구와 함께 가시나요?</h2>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {COMPANIONS.map((comp) => (
                  <button
                    key={comp}
                    onClick={() => setCompanion(comp)}
                    className={`px-5 py-2.5 rounded-full border transition-all text-sm sm:text-base ${
                      companion === comp
                        ? "bg-white text-black font-semibold border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        : "bg-transparent text-gray-300 border-white/20 hover:border-white/60 hover:bg-white/5"
                    }`}
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </section>

            {/* 3. 직업 설정 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-200">어떤 일을 하시나요? <span className="text-sm font-normal text-gray-500 ml-2">(직무별 맞춤 휴식 및 쇼핑 추천용)</span></h2>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {OCCUPATIONS.map((job) => (
                  <button
                    key={job}
                    onClick={() => setOccupation(job)}
                    className={`px-5 py-2.5 rounded-full border transition-all text-sm sm:text-base ${
                      occupation === job
                        ? "bg-white text-black font-semibold border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        : "bg-transparent text-gray-300 border-white/20 hover:border-white/60 hover:bg-white/5"
                    }`}
                  >
                    {job}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* 하단 고정 액션 버튼 영역 */}
      <div className="sticky bottom-0 pb-6 pt-6 bg-gradient-to-t from-black via-black to-transparent w-full">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          
          {/* Step 2 버튼 상단의 선택 현황 작은 뱃지 */}
          {step === 2 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <span className="bg-white/10 text-[11px] sm:text-xs px-3 py-1.5 rounded-full text-gray-300 border border-white/5">
                📍 {getDestName() || "여행지 미제공"}
              </span>
              {startDate && endDate && (
                <span className="bg-white/10 text-[11px] sm:text-xs px-3 py-1.5 rounded-full text-gray-300 border border-white/5">
                  📅 {startDate.replace("-", ".").slice(5)} ~ {endDate.replace("-", ".").slice(5)}
                </span>
              )}
              {companion && (
                <span className="bg-white/10 text-[11px] sm:text-xs px-3 py-1.5 rounded-full text-gray-300 border border-white/5">
                  👥 {companion}
                </span>
              )}
              {occupation && (
                <span className="bg-white/10 text-[11px] sm:text-xs px-3 py-1.5 rounded-full text-gray-300 border border-white/5">
                  💼 {occupation}
                </span>
              )}
            </div>
          )}

          {/* 버튼 컨트롤 */}
          {step === 1 ? (
            <button
              onClick={handleNextStep1}
              disabled={!selectedDest}
              className={`w-full py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all max-w-md block ${
                selectedDest
                  ? "bg-white text-black hover:bg-gray-200 active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  : "bg-white/10 text-white/30 border-white/10 cursor-not-allowed"
              }`}
            >
              다음 단계로
            </button>
          ) : (
            <div className="flex gap-3 w-full max-w-md">
              <button
                onClick={handlePrev}
                className="flex-1 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base border border-white/30 text-white hover:bg-white/10 transition-all active:scale-[0.98]"
              >
                이전
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isFormComplete}
                className={`flex-[2.5] py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all ${
                  isFormComplete
                    ? "bg-white text-black hover:bg-gray-200 active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    : "bg-white/10 text-white/30 cursor-not-allowed border-white/5 border"
                }`}
              >
                결과 만들기
              </button>
            </div>
          )}
        </div>
      </div>
      
    </main>
  );
}
