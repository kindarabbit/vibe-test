import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import type { ScriptDuration, ScriptTone } from "../types";
import { DurationSelector } from "./DurationSelector";
import { ToneSelector } from "./ToneSelector";

type ScriptFormProps = {
  title: string;
  sourceText: string;
  tone: ScriptTone;
  duration: ScriptDuration;
  validationError: string | null;
  onTitleChange: (title: string) => void;
  onSourceTextChange: (sourceText: string) => void;
  onToneChange: (tone: ScriptTone) => void;
  onDurationChange: (duration: ScriptDuration) => void;
  onSubmit: () => void;
};

export function ScriptForm({
  title,
  sourceText,
  tone,
  duration,
  validationError,
  onTitleChange,
  onSourceTextChange,
  onToneChange,
  onDurationChange,
  onSubmit,
}: ScriptFormProps) {
  return (
    <Card>
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div>
          <label className="text-[15px] font-medium text-slate-900" htmlFor="script-title">
            발표 제목
          </label>
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-[15px] outline-none transition placeholder:text-slate-400 focus:border-mint focus:ring-2 focus:ring-mint/20"
            id="script-title"
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="예: AI 윤리 발표"
            type="text"
            value={title}
          />
        </div>

        <div>
          <label className="text-[15px] font-medium text-slate-900" htmlFor="script-source">
            PPT 내용 또는 발표 키워드
          </label>
          <Textarea
            id="script-source"
            onChange={(event) => onSourceTextChange(event.target.value)}
            placeholder="발표에 포함할 핵심 문장이나 키워드를 입력하세요."
            value={sourceText}
          />
        </div>

        <ToneSelector onChange={onToneChange} value={tone} />
        <DurationSelector onChange={onDurationChange} value={duration} />

        {validationError ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-[15px] font-medium text-red-700">
            {validationError}
          </p>
        ) : null}

        <Button type="submit">
          대본 생성
        </Button>
      </form>
    </Card>
  );
}
