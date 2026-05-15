# 신한은행 AI 롤플레잉 교육 시스템

> Akron Corps. | AI Omni 솔루션 시연용 데모

신한은행 창구 직원의 고객 응대 역량을 훈련하기 위한 AI 롤플레잉 시뮬레이터.

## 주요 기능

- **AI 고객 롤플레잉**: Claude API 기반 다양한 페르소나 고객 시뮬레이션
- **음성 합성(TTS)**: Supertone API 기반 실시간 음성 변환 + 자막 동기화
- **RAG 기반 자동 평가**: 업로드된 매뉴얼 대조를 통한 응대 품질 평가

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 14+ (App Router), React, TypeScript, Tailwind CSS |
| AI 대화 | Claude API (claude-sonnet-4-20250514) |
| TTS 음성 | Supertone API |
| 상태관리 | Zustand |

## 실행 방법

```bash
npm install
cp .env.example .env.local
# .env.local에 API 키 입력
npm run dev
```

## 화면 구성 (3단계 플로우)

1. **설정 화면** — 페르소나 설정 + 매뉴얼 업로드
2. **훈련 화면** — AI 고객과 실시간 롤플레잉 대화 (TTS 음성 포함)
3. **평가 화면** — 항목별 채점 + AI 코멘트 + 누락 절차 안내
