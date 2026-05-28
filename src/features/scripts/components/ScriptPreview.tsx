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
    <Card className="animate-fade-up border-sky/30 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{script.duration}분</Badge>
        <Badge>{SCRIPT_TONE_LABELS[script.tone]}</Badge>
        <Badge>{SCRIPT_STATUS_LABELS[script.status]}</Badge>
        {script.attachedFileName ? <Badge>PPT 첨부</Badge> : null}
      </div>
      <h2 className="mt-4 text-2xl font-medium text-slate-950">{script.title}</h2>
      {script.attachedFileName ? (
        <p className="mt-2 rounded-md bg-sky/10 px-3 py-2 text-[14px] font-medium text-slate-700">
          첨부 파일: {script.attachedFileName}
        </p>
      ) : null}
      <div
        aria-live="polite"
        className="mt-4 whitespace-pre-line rounded-md bg-gradient-to-br from-slate-50 via-white to-mint/5 p-4 text-[15px] leading-8 text-slate-700"
      >
        {script.content}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="rounded-md border border-slate-300 px-3 py-2 text-[15px] font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-mint hover:bg-mint/5"
          onClick={() => onCopy(script)}
          type="button"
        >
          {copied ? "복사 완료" : "대본 복사"}
        </button>
        <button
          className="rounded-md border border-slate-300 px-3 py-2 text-[15px] font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-coral hover:bg-coral/5"
          onClick={() => onStatusChange(script)}
          type="button"
        >
          상태 변경
        </button>
      </div>
    </Card>
  );
}
