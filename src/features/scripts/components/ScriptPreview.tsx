import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SCRIPT_STATUS_LABELS, SCRIPT_TONE_LABELS } from "../types";
import type { PresentationScript } from "../types";

type ScriptPreviewProps = {
  script: PresentationScript;
  copied: boolean;
  onCopy: (script: PresentationScript) => void;
  onStatusChange: (script: PresentationScript) => void;
};

export function ScriptPreview({
  script,
  copied,
  onCopy,
  onStatusChange,
}: ScriptPreviewProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{script.duration}분</Badge>
        <Badge>{SCRIPT_TONE_LABELS[script.tone]}</Badge>
        <Badge>{SCRIPT_STATUS_LABELS[script.status]}</Badge>
      </div>
      <h2 className="mt-4 text-2xl font-medium text-slate-950">{script.title}</h2>
      <div
        aria-live="polite"
        className="mt-4 whitespace-pre-line rounded-md bg-slate-50 p-4 text-[15px] leading-8 text-slate-700"
      >
        {script.content}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="rounded-md border border-slate-300 px-3 py-2 text-[15px] font-medium text-slate-700"
          onClick={() => onCopy(script)}
          type="button"
        >
          {copied ? "복사 완료" : "대본 복사"}
        </button>
        <button
          className="rounded-md border border-slate-300 px-3 py-2 text-[15px] font-medium text-slate-700"
          onClick={() => onStatusChange(script)}
          type="button"
        >
          상태 변경
        </button>
      </div>
    </Card>
  );
}
