# Architecture

## 목표

대학생 과제 관련 서비스는 과제 입력, 요구사항 분석, 일정 관리, 자료 정리, 초안 피드백을 하나의 흐름으로 제공하는 웹 애플리케이션이다.

초기 버전은 빠르게 만들고 검증할 수 있는 단일 웹 앱 구조로 시작한다. 이후 사용자 계정, 팀 협업, 캘린더 연동, LMS 연동이 필요해지면 서버 기능을 단계적으로 확장한다.

## 전체 구조

```text
Client App
  - Dashboard
  - Assignment List
  - Assignment Detail
  - Assignment Analyzer
  - Calendar

Application Layer
  - Assignment Service
  - Checklist Service
  - Schedule Service
  - Analysis Service
  - Feedback Service

Data Layer
  - Assignments
  - Tasks
  - Notes
  - Sources
  - Feedback
```

## MVP 아키텍처

초기 MVP는 프론트엔드 중심 구조로 시작한다.

- 과제 데이터는 로컬 상태 또는 브라우저 저장소에 보관한다.
- 분석 결과는 사용자가 입력한 과제 설명을 기반으로 생성한다.
- 서버가 필요한 기능은 나중에 API로 분리할 수 있도록 서비스 함수 단위로 작성한다.
- 화면 컴포넌트와 비즈니스 로직은 분리한다.

추천 구조:

```text
src/
  app/
    dashboard/
    assignments/
    calendar/
  components/
    assignment-card/
    checklist/
    feedback-panel/
    priority-badge/
  features/
    assignments/
    analysis/
    schedule/
    sources/
  lib/
    date/
    storage/
    validation/
  types/
```

## 주요 도메인

### Assignment

과제의 핵심 단위다.

필드 후보:

- id
- title
- courseName
- description
- dueDate
- submissionType
- priority
- status
- progress
- rubric
- createdAt
- updatedAt

### Task

과제를 완료하기 위한 세부 작업이다.

필드 후보:

- id
- assignmentId
- title
- description
- status
- dueDate
- order

### Source

자료 조사 과정에서 저장하는 참고자료다.

필드 후보:

- id
- assignmentId
- title
- url
- type
- memo
- credibilityNote
- citation

### Feedback

초안이나 계획에 대한 피드백 결과다.

필드 후보:

- id
- assignmentId
- targetType
- targetText
- strengths
- improvements
- missingRequirements
- nextActions
- createdAt

## 주요 기능 흐름

### 과제 추가

```text
사용자 입력
  -> 과제 제목, 과목명, 마감일, 설명 저장
  -> 과제 요구사항 분석
  -> 체크리스트 생성
  -> 대시보드에 표시
```

### 과제 분석

```text
과제 설명 입력
  -> 핵심 목적 추출
  -> 제출 형식 추출
  -> 평가 기준 추출
  -> 필수 작업 목록 생성
  -> 사용자가 확인해야 할 질문 생성
```

### 일정 생성

```text
마감일 확인
  -> 남은 기간 계산
  -> 조사, 개요, 초안, 수정, 제출 단계 분리
  -> 단계별 작업 생성
  -> 오늘 할 일과 마감 임박 과제 갱신
```

### 제출 전 점검

```text
과제 상세 정보 확인
  -> 완료되지 않은 체크리스트 확인
  -> 평가 기준 누락 여부 확인
  -> 참고자료와 인용 상태 확인
  -> 최종 수정 제안 표시
```

## 화면과 데이터 연결

### Dashboard

사용 데이터:

- assignments
- tasks

주요 계산:

- 오늘 할 일
- 마감 임박 과제
- 진행률
- 우선순위

### Assignment Detail

사용 데이터:

- assignment
- tasks
- sources
- feedback

주요 기능:

- 체크리스트 수정
- 자료 메모 추가
- 초안 피드백 확인
- 제출 전 점검

### Analyzer

사용 데이터:

- assignment.description
- assignment.rubric

주요 출력:

- 요약
- 요구사항
- 평가 기준
- 체크리스트 후보
- 확인 질문

## API 확장 후보

초기에는 로컬 함수로 구현하고, 사용자 계정과 동기화가 필요해지면 API로 분리한다.

```text
GET    /api/assignments
POST   /api/assignments
GET    /api/assignments/:id
PATCH  /api/assignments/:id
DELETE /api/assignments/:id

POST   /api/assignments/:id/analyze
POST   /api/assignments/:id/schedule
POST   /api/assignments/:id/feedback

GET    /api/assignments/:id/sources
POST   /api/assignments/:id/sources
```

## 상태 관리 원칙

- 과제 목록과 상세 데이터는 단일 출처에서 관리한다.
- 화면 전용 상태와 저장해야 하는 도메인 상태를 분리한다.
- 날짜 계산은 별도 유틸리티로 분리한다.
- 분석 결과는 사용자가 수정할 수 있는 초안 데이터로 취급한다.

## 저장 전략

### MVP

- 브라우저 로컬 저장소
- JSON 직렬화
- 파일 업로드 없이 텍스트 입력 중심

### 확장 버전

- 사용자 계정 기반 데이터베이스
- 과제 파일 업로드
- 팀 과제 공유 권한
- 캘린더와 LMS 외부 연동

## AI 기능 경계

AI 기능은 사용자의 학습을 돕는 보조 기능으로 제한한다.

허용:

- 요구사항 요약
- 체크리스트 생성
- 일정 분해
- 자료 조사 방향 제안
- 글의 논리와 구조 피드백

지양:

- 과제 전체 대리 작성
- 출처 없는 사실 생성
- 학교 정책을 우회하는 답변
- 표절을 유도하는 문장 생성

## 우선 구현 순서

1. 과제 데이터 모델 정의
2. 과제 추가 및 목록 화면
3. 과제 상세 화면
4. 체크리스트 생성 및 수정
5. 마감일 기반 대시보드
6. 과제 설명 분석 화면
7. 초안 피드백 패널
8. 자료 조사 메모

## 리스크

- 과제 대리 작성으로 오해될 수 있으므로 UX 문구와 기능 경계를 명확히 해야 한다.
- 분석 결과가 항상 정확하지 않을 수 있으므로 사용자가 수정하고 확인하는 흐름이 필요하다.
- 마감일과 일정 계산은 시간대와 날짜 형식을 일관되게 처리해야 한다.
- 팀 협업 기능은 권한과 동기화 복잡도가 높으므로 MVP 이후로 미루는 것이 좋다.

