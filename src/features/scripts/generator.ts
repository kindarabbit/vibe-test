import type {
  AttachedPresentationFile,
  PresentationScript,
  ScriptDuration,
  ScriptTone,
} from "./types";

type CreateScriptInput = {
  title: string;
  sourceText: string;
  tone: ScriptTone;
  duration: ScriptDuration;
  attachedFile: AttachedPresentationFile | null;
};

export function createMockScript(input: CreateScriptInput): PresentationScript {
  const now = new Date().toISOString();

  return {
    id: createId(),
    title: input.title,
    sourceText: input.sourceText || "첨부한 PPT 파일을 기반으로 발표 흐름을 준비합니다.",
    tone: input.tone,
    duration: input.duration,
    status: "draft",
    content: buildPlaceholderContent(input),
    createdAt: now,
    updatedAt: now,
    attachedFileName: input.attachedFile?.name,
    attachedFileSize: input.attachedFile?.size,
  };
}

function buildPlaceholderContent(input: CreateScriptInput) {
  const toneIntro = {
    natural: "편안하게 흐름을 따라가며",
    formal: "명확하고 정돈된 표현으로",
    friendly: "듣는 사람이 쉽게 따라올 수 있도록",
  }[input.tone];

  const durationGuide = {
    5: "핵심만 간결하게 전달하겠습니다.",
    10: "핵심 개념과 예시를 균형 있게 설명하겠습니다.",
    15: "배경, 핵심 내용, 시사점까지 차례로 설명하겠습니다.",
  }[input.duration];

  const fileLine = input.attachedFile
    ? `첨부한 PPT 파일은 "${input.attachedFile.name}"입니다. 이 자료의 흐름을 기준으로 발표 대본을 다듬겠습니다.`
    : "별도 PPT 파일 첨부 없이 입력한 키워드를 기준으로 발표 흐름을 구성하겠습니다.";

  return [
    `안녕하세요. 오늘은 ${input.title}에 대해 발표하겠습니다.`,
    fileLine,
    `먼저 발표의 핵심 내용은 ${input.sourceText || "첨부 자료의 주요 슬라이드"}입니다. ${toneIntro} 이 내용을 하나씩 풀어보겠습니다.`,
    durationGuide,
    "마지막으로 오늘 다룬 내용을 정리하고, 발표 주제가 왜 중요한지 다시 짚으며 마무리하겠습니다.",
  ].join("\n\n");
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `script-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
