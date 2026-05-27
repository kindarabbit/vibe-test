import type { ScriptTone } from "../types";
import { SCRIPT_TONE_LABELS } from "../types";

const tones: ScriptTone[] = ["natural", "formal", "friendly"];

type ToneSelectorProps = {
  value: ScriptTone;
  onChange: (tone: ScriptTone) => void;
};

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
  return (
    <fieldset>
      <legend className="text-[15px] font-medium text-slate-900">말투</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {tones.map((tone) => (
          <button
            aria-pressed={value === tone}
            className={`rounded-md border px-3 py-2 text-[15px] ${
              value === tone
                ? "border-mint bg-mint/10 text-slate-900"
                : "border-slate-200 bg-white text-slate-600"
            }`}
            key={tone}
            onClick={() => onChange(tone)}
            type="button"
          >
            {SCRIPT_TONE_LABELS[tone]}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
