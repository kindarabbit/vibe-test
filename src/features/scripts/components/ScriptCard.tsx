import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SCRIPT_STATUS_LABELS, SCRIPT_TONE_LABELS } from "../types";
import type { PresentationScript } from "../types";

type ScriptCardProps = {
  script: PresentationScript;
  isActive: boolean;
  onSelect: () => void;
  onStatusChange: () => void;
};

export function ScriptCard({
  script,
  isActive,
  onSelect,
  onStatusChange,
}: ScriptCardProps) {
  return (
    <Card className={`p-4 ${isActive ? "ring-2 ring-mint/40" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            className="text-left text-base font-medium text-slate-950 hover:text-mint"
            onClick={onSelect}
            type="button"
          >
            {script.title}
          </button>
          <p className="mt-2 line-clamp-2 text-[15px] leading-7 text-slate-600">
            {script.sourceText}
          </p>
        </div>
        <Badge>{SCRIPT_STATUS_LABELS[script.status]}</Badge>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{script.duration}분</Badge>
        <Badge>{SCRIPT_TONE_LABELS[script.tone]}</Badge>
      </div>
      <button
        className="mt-4 rounded-md border border-slate-300 px-3 py-2 text-[14px] font-medium text-slate-700"
        onClick={onStatusChange}
        type="button"
      >
        상태 변경
      </button>
    </Card>
  );
}
