import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import type { AttachedPresentationFile, ScriptDuration, ScriptTone } from "../types";
import { DurationSelector } from "./DurationSelector";
import { ToneSelector } from "./ToneSelector";

type ScriptFormProps = {
  title: string;
  sourceText: string;
  tone: ScriptTone;
  duration: ScriptDuration;
  attachedFile: AttachedPresentationFile | null;
  validationError: string | null;
  onTitleChange: (title: string) => void;
  onSourceTextChange: (sourceText: string) => void;
  onToneChange: (tone: ScriptTone) => void;
  onDurationChange: (duration: ScriptDuration) => void;
  onFileChange: (file: AttachedPresentationFile | null) => void;
  onSubmit: () => void;
};

export function ScriptForm({
  title,
  sourceText,
  tone,
  duration,
  attachedFile,
  validationError,
  onTitleChange,
  onSourceTextChange,
  onToneChange,
  onDurationChange,
  onFileChange,
  onSubmit,
}: ScriptFormProps) {
  return (
    <Card className="animate-fade-up hover:-translate-y-0.5 hover:shadow-md">
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

        <div>
          <label className="text-[15px] font-medium text-slate-900" htmlFor="ppt-file">
            PPT 파일 첨부
          </label>
          <label
            className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-sky bg-sky/5 px-4 py-5 text-center transition hover:-translate-y-0.5 hover:bg-sky/10"
            htmlFor="ppt-file"
          >
            <span className="text-[15px] font-medium text-slate-900">
              {attachedFile ? attachedFile.name : ".ppt 또는 .pptx 파일 선택"}
            </span>
            <span className="mt-1 text-[14px] text-slate-600">
              {attachedFile
                ? `${Math.max(1, Math.round(attachedFile.size / 1024))}KB 첨부됨`
                : "파일 첨부는 선택 사항이며, 입력한 키워드와 함께 대본에 반영됩니다."}
            </span>
          </label>
          <input
            accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            className="sr-only"
            id="ppt-file"
            onChange={(event) => {
              const file = event.target.files?.[0];
              onFileChange(file ? { name: file.name, size: file.size } : null);
            }}
            type="file"
          />
          {attachedFile ? (
            <button
              className="mt-2 text-[14px] font-medium text-coral transition hover:text-rose-600"
              onClick={() => onFileChange(null)}
              type="button"
            >
              첨부 제거
            </button>
          ) : null}
        </div>

        <ToneSelector onChange={onToneChange} value={tone} />
        <DurationSelector onChange={onDurationChange} value={duration} />

        {validationError ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-[15px] font-medium text-red-700">
            {validationError}
          </p>
        ) : null}

        <Button className="w-full shadow-sm hover:-translate-y-0.5" type="submit">
          대본 생성
        </Button>
      </form>
    </Card>
  );
}
