import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY가 서버에 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { destination, startDate, endDate, companion, occupation } = body;

    // 파라미터 유효성 검사
    if (!destination || !startDate || !endDate || !companion || !occupation) {
      return NextResponse.json(
        { error: "여행지, 날짜, 동행, 직무 정보가 모두 필요합니다." },
        { status: 400 }
      );
    }

    // 모델 초기화
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // AI 프롬프트 구성
    const prompt = `
당신은 최고 수준의 시니어 통찰력을 지닌 여행 일정 기획 전문가입니다.
사용자 정보를 기반으로 타겟(바쁜 직장인들)에게 완벽하게 맞춤화된 여행 일정을 JSON 형식으로 계획해 주세요.

[사용자 입력 정보]
- 여행지: ${destination}
- 여행 날짜: ${startDate} ~ ${endDate}
- 동행: ${companion}
- 사용자의 직무: ${occupation} (직장에 다니는 타겟)

[반드시 포함되어야 할 필수 요구사항]
1. 단순한 방문지가 아닌 타겟층(특히 ${occupation})의 스트레스를 해소할 수 있는 맞춤형 호텔 추천.
2. 해당 여행 기간(${startDate}~${endDate})의 예상 평균 날씨 정보 및 여행 옷차림/준비물.
3. 만족도 높은 쇼핑 스팟 및 현지인과 여행객 모두에게 인정받는 맛집 정보.
4. 모든 상세 항목은 사용자의 동행(${companion})을 철저히 고려하여 작성할 것.

[응답 포맷 (반드시 JSON 형식을 지킬 것)]
출력은 아래 JSON 구조로만 반환하고 다른 텍스트는 출력하지 마세요:
{
  "summary": "이번 여행의 전체 컨셉과 방향성을 나타내는 매력적인 한 줄 소개",
  "tips": [
    "동행과 직업에 맞춘 구체적인 힐링 팁 1",
    "날씨/옷차림 및 현지 준비물 관련 팁 2",
    "미식(맛집) 또는 쇼핑 관련 팁 3"
  ],
  "items": [
    {
      "day": "n일차 (또는 카테고리명: 호텔, 날씨, 쇼핑 등 다양하게 분류 가능)",
      "time": "오전/오후/저녁 등 시간대 (해당 없을 시 공백 문자열)",
      "title": "방문 장소 (숙소 이름, 맛집 이름, 관광지 등)",
      "description": "자세한 설명 (추천 이유, 꿀팁, 매력 포인트 등 최소 2~3문장)",
      "category": "hotel | weather | shopping | food | flight | activity 중 택 1"
    }
  ]
}
`;

    // Gemini API 호출
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });

    const responseText = result.response.text();
    
    // 정상적으로 반환된 JSON 그대로 클라이언트에게 응답
    return new NextResponse(responseText, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error?.message || "AI 일정을 생성하는 중 서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
