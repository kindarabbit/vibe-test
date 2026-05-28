# Presentation Script Maker

대학생 발표 준비를 위한 Micro SaaS MVP입니다. PPT 내용이나 발표 키워드를 입력하면 말투와 발표 시간에 맞는 발표 대본을 생성하고, 생성된 대본을 목록에서 관리할 수 있습니다.

## MVP Features

- 발표 제목과 PPT 내용 또는 발표 키워드 입력
- 말투 선택: 자연스럽게, 공식적으로, 친근하게
- 발표 시간 선택: 5분, 10분, 15분
- mock generator 기반 발표 대본 생성
- 생성 대본 미리보기와 목록 표시
- 상태 변경: 작성 중, 검토 중, 완료
- 검색, 상태 필터, 말투 필터, 발표 시간 필터
- 대본 복사
- localStorage 기반 단일 사용자 저장
- Playwright E2E 테스트

## Non-goals

이번 MVP에는 아래 기능을 포함하지 않습니다.

- 로그인
- 결제
- 실시간 협업
- 서버 DB 저장
- 대용량 PPT 파일 업로드
- 외부 AI API 연동
- 복잡한 관리자 권한

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js App Router |
| UI | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Test | Playwright |
| Spec Workflow | OpenSpec |

## Project Structure

```text
src/
  app/
    page.tsx
    app/
      page.tsx
  components/
    layout/
    ui/
  features/
    scripts/
      components/
      generator.ts
      mock-data.ts
      storage.ts
      types.ts
openspec/
  specs/
  changes/
tests/
  e2e/
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:3000
http://127.0.0.1:3000/app
```

If port `3000` is busy, run Next.js manually with another port:

```bash
npx next dev --hostname 127.0.0.1 --port 4181
```

## Verification

Build the app:

```bash
npm run build
```

Run E2E tests:

```bash
npm run test:e2e
```

The E2E suite covers:

- script creation
- required input validation
- status update
- filtering
- search
- copy confirmation
- localStorage persistence after reload

## Deployment Notes

This is a standard Next.js app and is ready for Vercel-style deployment.

Recommended deployment settings:

```text
Install command: npm install
Build command: npm run build
Output: Next.js default
```

No environment variables are required for the current MVP because it does not call an external AI API or backend service.

Future AI integration should keep API keys on the server side only, using environment variables such as:

```text
OPENAI_API_KEY
```

## Planning Docs

- [Product Brief](./01.%20Product%20Brief.md)
- [Requirements Spec](./02.%20Requirements%20Spec.md)
- [UX UI Spec](./03.%20UX%20UI%20Spec.md)
- [Technical Design](./04.%20Technical%20Design.md)
- [Delivery Plan](./05.%20Delivery%20Plan.md)

## OpenSpec

The core MVP change has been archived into OpenSpec specs:

- `openspec/specs/presentation-script-generation/spec.md`
- `openspec/specs/presentation-script-management/spec.md`

Current and future changes can be managed with:

```bash
openspec.cmd list
openspec.cmd validate <change-name>
openspec.cmd archive <change-name>
```
