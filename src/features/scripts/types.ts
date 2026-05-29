export type ScriptTone = "natural" | "formal" | "friendly";

export type ScriptDuration = 5 | 10 | 15;

export type ScriptStatus = "draft" | "review" | "done";

export type PresentationScript = {
  id: string;
  title: string;
  sourceText: string;
  tone: ScriptTone;
  duration: ScriptDuration;
  status: ScriptStatus;
  content: string;
  createdAt: string;
  updatedAt: string;
  attachedFileName?: string;
  attachedFileSize?: number;
};

export type AttachedPresentationFile = {
  name: string;
  size: number;
};

export const SCRIPT_TONE_OPTIONS: ScriptTone[] = ["natural", "formal", "friendly"];

export const SCRIPT_DURATION_OPTIONS: ScriptDuration[] = [5, 10, 15];

export const SCRIPT_TONE_LABELS: Record<ScriptTone, string> = {
  natural: "자연스럽게",
  formal: "공식적으로",
  friendly: "친근하게",
};

export const SCRIPT_STATUS_LABELS: Record<ScriptStatus, string> = {
  draft: "작성 중",
  review: "검토 중",
  done: "완료",
};
