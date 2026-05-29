import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  SCRIPT_DURATION_OPTIONS,
  SCRIPT_STATUS_LABELS,
  SCRIPT_TONE_LABELS,
  SCRIPT_TONE_OPTIONS,
} from "../types";
import type { PresentationScript, ScriptDuration, ScriptTone } from "../types";

type ScriptPreviewProps = {
  script: PresentationScript;
  copied: boolean;
  onCopy: (script: PresentationScript) => void;
  onDurationChange: (duration: ScriptDuration) => void;
  onStatusChange: (script: PresentationScript) => void;
  onToneChange: (tone: ScriptTone) => void;
};

export function ScriptPreview({
  script,
  copied,
  onCopy,
  onDurationChange,
  onStatusChange,
  onToneChange,
}: ScriptPreviewProps) {
  return (
    <Card className="animate-fade-up border-sky/30 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{script.duration}분</Badge>
        <Badge>{SCRIPT_TONE_LABELS[script.tone]}</Badge>
        <Badge>{SCRIPT_STATUS_LABELS[script.status]}</Badge>
        {script.attachedFileName ? <Badge>파일 첨부</Badge> : null}
      </div>
      <h2 className="mt-4 text-2xl font-medium text-slate-950">{script.title}</h2>
      {script.attachedFileName ? (
        <p className="mt-2 rounded-md bg-sky/10 px-3 py-2 text-[14px] font-medium text-slate-700">
          첨부 파일: {script.attachedFileName}
        </p>
      ) : null}

      <div className="mt-4 grid gap-3 rounded-lg border border-slate-200 bg-white/80 p-3 sm:grid-cols-2">
        <div>
          <p className="text-[14px] font-medium text-slate-900">말투 다시 선택</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SCRIPT_TONE_OPTIONS.map((tone) => {
              const isSelected = script.tone === tone;

              return (
                <button
                  aria-label={`생성된 대본 말투를 ${SCRIPT_TONE_LABELS[tone]}로 변경`}
                  aria-pressed={isSelected}
                  className={`rounded-md border px-3 py-2 text-[14px] font-medium transition hover:-translate-y-0.5 ${
                    isSelected
                      ? "border-mint bg-mint/10 text-slate-950"
                      : "border-slate-300 text-slate-700 hover:border-mint"
                  }`}
                  key={tone}
                  onClick={() => onToneChange(tone)}
                  type="button"
                >
                  {SCRIPT_TONE_LABELS[tone]}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-[14px] font-medium text-slate-900">발표 시간 다시 선택</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SCRIPT_DURATION_OPTIONS.map((duration) => {
              const isSelected = script.duration === duration;

              return (
                <button
                  aria-label={`생성된 대본 발표 시간을 ${duration}분으로 변경`}
                  aria-pressed={isSelected}
                  className={`rounded-md border px-3 py-2 text-[14px] font-medium transition hover:-translate-y-0.5 ${
                    isSelected
                      ? "border-coral bg-coral/10 text-slate-950"
                      : "border-slate-300 text-slate-700 hover:border-coral"
                  }`}
                  key={duration}
                  onClick={() => onDurationChange(duration)}
                  type="button"
                >
                  {duration}분
                </button>
              );
            })}
          </div>
        </div>
      </div>

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
