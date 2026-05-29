# Security Review

## 1. Review Scope

검토일: 2026-05-29

현재 MVP를 보안 관점에서 점검했다. 이 문서는 정적 코드 리뷰 기준이며, 침투 테스트나 외부 취약점 스캔은 포함하지 않는다.

## 2. Reviewed Files

- OpenSpec change/spec
  - `openspec/changes/archive/2026-05-28-implement-presentation-script-mvp`
  - `openspec/specs/presentation-script-generation/spec.md`
  - `openspec/specs/presentation-script-management/spec.md`
  - `openspec/changes/prepare-readme-and-deployment`
- Source code
  - `src/app`
  - `src/components`
  - `src/features/scripts`
- Project metadata
  - `package.json`
  - `package-lock.json`
  - `README.md`

## 3. Executive Summary

현재 MVP는 서버 API, 로그인, 결제, 외부 AI API 연동이 없고, 파일 파싱도 브라우저 내부에서만 수행된다. 따라서 서버 측 인증/권한/DB 노출 위험은 현재 범위에서는 낮다.

가장 중요한 보안 리스크는 사용자가 입력하거나 PPTX/PDF에서 추출한 발표 내용이 `localStorage`에 그대로 저장된다는 점이다. 또한 PPTX/PDF 파일을 브라우저에서 `arrayBuffer()`로 읽고 압축 해제하므로, 파일 크기와 압축 해제 결과에 대한 제한이 필요하다.

## 4. Findings

| ID | Severity | Area | Finding | Recommendation |
|---|---|---|---|---|
| SEC-001 | Medium | localStorage | 발표 제목, 원문/키워드, 생성 대본, 첨부 파일명이 `localStorage`에 저장된다. 사용자가 민감한 수업 자료, 개인정보, 기업 자료를 붙여넣으면 브라우저에 남을 수 있다. | 입력 영역 근처에 민감정보 저장 안내를 추가하고, 전체 삭제/개별 삭제 기능을 제공한다. 가능하면 저장 범위를 최소화한다. |
| SEC-002 | Medium | File parsing | PPTX/PDF 파일 크기 제한이 없다. 현재 구현은 파일 전체를 메모리로 읽고, PPTX/PDF 내부 압축 스트림도 브라우저에서 해제한다. 큰 파일이나 비정상 파일은 브라우저 멈춤을 유발할 수 있다. | 업로드 전 파일 크기 제한을 둔다. 예: 10MB 이하. PPTX zip entry 수, 압축 해제 결과 크기, 파싱 시간 제한도 추가한다. |
| SEC-003 | Low | Security headers | `next.config.ts`에 CSP, frame-ancestors, Referrer-Policy 등 배포용 보안 헤더가 정의되어 있지 않다. 현재 외부 스크립트는 없지만 배포 전 기본 헤더를 두는 것이 좋다. | Vercel/Next.js `headers()` 설정으로 기본 보안 헤더를 추가한다. |
| SEC-004 | Low | Dependency maintenance | `package-lock.json`은 버전을 고정하지만, README에는 `npm install` 중심으로 안내되어 있다. 팀/배포 환경에서는 lockfile 기준 설치가 더 재현 가능하다. | 배포/CI 문서에는 `npm ci`를 권장하고, 정기적으로 `npm audit` 또는 Dependabot을 사용한다. |

## 5. Checks

### 5.1 Sensitive Information Exposure

현재 저장소에서 실제 API key, token, password 값은 발견되지 않았다. README에는 미래 AI 연동용 예시로 `OPENAI_API_KEY`가 언급되어 있지만 실제 값은 포함되어 있지 않다.

주의할 점:

- `src/features/scripts/storage.ts`는 `presentation-scripts` 키로 대본 데이터를 저장한다.
- 저장 대상에는 발표 원문/키워드인 `sourceText`, 생성된 `content`, 첨부 파일명 `attachedFileName`이 포함된다.
- `04. Technical Design.md`에도 localStorage에는 민감 정보를 저장하지 말라는 원칙이 적혀 있으므로, UI와 README에서도 같은 안내가 필요하다.

판정: 부분 보완 필요

### 5.2 XSS Risk

검색 결과 `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function` 사용은 발견되지 않았다. 생성된 대본과 파일에서 추출한 텍스트는 React JSX 텍스트 노드로 렌더링되므로 기본적으로 이스케이프된다.

주의할 점:

- PPTX XML과 PDF에서 추출한 텍스트에는 `<script>` 같은 문자열이 포함될 수 있다.
- 현재 렌더링 방식에서는 실행되지 않지만, 향후 Markdown preview, rich text editor, HTML 렌더링을 추가하면 sanitize가 필요하다.

판정: 현재 MVP 기준 양호

### 5.3 External Link Security

현재 `src/app/page.tsx`에서 확인한 링크는 모두 내부 `/app` 경로다. `target="_blank"` 외부 링크가 없어 `rel="noopener noreferrer"` 누락 문제는 현재 발생하지 않는다.

향후 외부 링크를 추가할 경우:

- 새 탭 링크에는 `rel="noopener noreferrer"`를 함께 사용한다.
- 사용자 입력 기반 URL은 허용된 프로토콜만 통과시킨다.

판정: 현재 MVP 기준 양호

### 5.4 Local Storage Safety

OpenSpec의 `presentation-script-management` spec은 localStorage 저장을 요구한다. MVP 범위에서는 합리적이지만, localStorage는 다음 이유로 민감 데이터 저장소로 적합하지 않다.

- 같은 브라우저 프로필을 쓰는 사용자가 내용을 볼 수 있다.
- XSS가 발생하면 저장된 데이터가 노출될 수 있다.
- 자동 만료나 암호화가 없다.

4회차 안에 가능한 보완:

- 앱 화면에 "민감한 개인정보나 비공개 자료는 입력하지 마세요" 안내 추가
- 저장된 대본 전체 삭제 버튼 추가
- 개별 대본 삭제 기능 추가
- README에 localStorage 저장 범위와 주의사항 추가

판정: 보완 필요

### 5.5 File Upload and Parsing

현재 파일은 서버로 업로드되지 않고 브라우저에서 처리된다. 이는 개인정보와 서버 비용 측면에서는 장점이다.

확인된 구현:

- `.pptx`, `.pdf`만 파싱 대상으로 처리한다.
- `.ppt`는 지원하지 않는 파일로 안내한다.
- PPTX는 zip 구조를 읽고 `ppt/slides/slide*.xml`의 `<a:t>` 텍스트를 추출한다.
- PDF는 stream 내부 문자열을 best-effort 방식으로 추출한다.

위험:

- 파일 크기 제한이 없다.
- 압축 해제 결과 크기 제한이 없다.
- 비정상 PPTX/PDF가 브라우저 메모리와 CPU를 과도하게 사용할 수 있다.

4회차 안에 가능한 보완:

- `MAX_FILE_SIZE_BYTES` 상수 추가
- 파일 선택 직후 크기 검사
- PPTX zip entry 개수와 개별 entry 크기 제한
- 파싱 실패 메시지에 "파일을 줄이거나 키워드를 직접 입력" 안내 유지

판정: 보완 필요

### 5.6 Deployment Settings

README에는 현재 MVP가 외부 API나 서버 환경변수를 요구하지 않는다고 적혀 있다. 이는 현재 코드와 일치한다.

배포 전 확인할 것:

- Vercel 환경변수에 불필요한 secret이 없는지 확인
- GitHub 저장소에 `.env` 파일이 커밋되지 않았는지 확인
- Production build가 성공하는지 확인
- E2E 테스트가 성공하는지 확인
- 보안 헤더 적용 여부 확인

판정: 기본 설정은 단순하나, 배포용 헤더 보완 권장

## 6. Recommended Fixes for Session 4

| Priority | Task | Done When |
|---|---|---|
| P1 | 민감정보 입력/저장 주의 문구 추가 | 앱 화면과 README에 localStorage 저장 범위가 설명된다. |
| P1 | PPTX/PDF 파일 크기 제한 추가 | 제한 초과 파일 선택 시 파싱하지 않고 안내 메시지를 보여준다. |
| P2 | 저장된 대본 삭제 기능 추가 | 사용자가 localStorage에 남은 대본을 제거할 수 있다. |
| P2 | 보안 헤더 추가 | `next.config.ts`에 기본 보안 헤더가 적용된다. |
| P2 | dependency audit 절차 문서화 | README에 `npm ci`, `npm audit` 확인 절차가 추가된다. |

## 7. Suggested Security Headers

향후 `next.config.ts`에 아래와 같은 헤더를 추가할 수 있다.

```ts
const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none';",
  },
];
```

주의: Next.js와 Tailwind 환경에서 inline style이 필요한 경우가 있어 CSP는 실제 배포 화면에서 반드시 검증해야 한다.

## 8. Final Verdict

현재 MVP는 수업/발표용 데모로는 배포 가능한 수준에 가깝다. 다만 사용자가 실제 PPT/PDF 내용을 넣는 서비스 특성상, localStorage 저장 안내와 파일 크기 제한은 우선 적용하는 것이 좋다.

최소 배포 전 권장 기준:

- 민감정보 입력 금지 안내 추가
- PPTX/PDF 파일 크기 제한 추가
- production build 통과
- Playwright 핵심 E2E 통과
- Vercel 환경변수와 GitHub 커밋 내 secret 없음 확인
