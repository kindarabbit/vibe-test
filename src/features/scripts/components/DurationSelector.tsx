import type { ScriptDuration } from "../types";

const durations: ScriptDuration[] = [5, 10, 15];

type DurationSelectorProps = {
  value: ScriptDuration;
  onChange: (duration: ScriptDuration) => void;
};

export function DurationSelector({ value, onChange }: DurationSelectorProps) {
  return (
    <fieldset>
      <legend className="text-[15px] font-medium text-slate-900">발표 시간</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {durations.map((duration) => (
          <button
            aria-pressed={value === duration}
            className={`rounded-md border px-3 py-2 text-[15px] ${
              value === duration
                ? "border-coral bg-coral/10 text-slate-900"
                : "border-slate-200 bg-white text-slate-600"
            }`}
            key={duration}
            onClick={() => onChange(duration)}
            type="button"
          >
            {duration}분
          </button>
        ))}
      </div>
    </fieldset>
  );
}
