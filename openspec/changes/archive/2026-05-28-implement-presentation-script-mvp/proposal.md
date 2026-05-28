## Why

대학생은 PPT 내용이나 발표 키워드를 준비한 뒤에도 실제 발표 대본을 작성하고 발표 시간에 맞추는 데 많은 시간을 쓴다. 이 change는 말투와 발표 시간을 선택해 발표 대본을 생성하고 관리하는 Micro SaaS MVP의 핵심 흐름을 구현하기 위해 필요하다.

## What Changes

- Add a landing page that explains the presentation script generator and routes users into the app.
- Add a main app page where users can enter a presentation title and source text.
- Add tone selection for natural, formal, and friendly presentation styles.
- Add duration selection for 5, 10, and 15 minute presentations.
- Generate a mock presentation script without external AI API integration.
- Display the generated script in a preview area and list.
- Allow script status changes, filtering, and copy interaction in the MVP flow.
- Persist generated scripts locally when localStorage is available.

## Capabilities

### New Capabilities

- `presentation-script-generation`: Covers user input, tone selection, duration selection, mock script generation, and generated script preview.
- `presentation-script-management`: Covers script list display, status updates, filtering, copy action, empty states, and local persistence.

### Modified Capabilities

- None.

## Impact

- Affected routes: `src/app/page.tsx`, `src/app/app/page.tsx`
- Affected feature modules: `src/features/scripts/**`
- Affected shared UI: `src/components/ui/**`, `src/components/layout/**`
- Dependencies: Next.js, React, TypeScript, Tailwind CSS
- No server API, database, login, payment, real-time collaboration, large file upload, or external AI API integration in this MVP change.
