import type { PresentationScript } from "./types";

export const mockScripts: PresentationScript[] = [
  {
    id: "script-001",
    title: "AI 윤리 발표",
    sourceText: "AI 활용 사례, 편향 문제, 책임 있는 사용",
    tone: "natural",
    duration: 5,
    status: "draft",
    content:
      "안녕하세요. 오늘은 AI 윤리에 대해 발표하겠습니다.\n\n먼저 AI가 우리 생활에서 어떻게 활용되고 있는지 살펴보고, 이어서 편향과 책임 있는 사용의 중요성을 이야기하겠습니다.\n\n마지막으로 대학생으로서 AI를 어떻게 바라보고 활용하면 좋을지 정리하며 발표를 마치겠습니다.",
    createdAt: "2026-05-27T09:00:00.000Z",
    updatedAt: "2026-05-27T09:00:00.000Z",
  },
];
