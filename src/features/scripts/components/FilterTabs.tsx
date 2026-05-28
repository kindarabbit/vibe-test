import type { ScriptStatus } from "../types";
import { SCRIPT_STATUS_LABELS } from "../types";

type StatusFilter = ScriptStatus | "all";

const filters: StatusFilter[] = ["all", "draft", "review", "done"];

type FilterTabsProps = {
  value: StatusFilter;
  onChange: (filter: StatusFilter) => void;
};

export function FilterTabs({ value, onChange }: FilterTabsProps) {
  return (
    <div aria-label="대본 상태 필터" className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          aria-pressed={value === filter}
          className={`rounded-md border px-3 py-2 text-[14px] transition hover:-translate-y-0.5 ${
            value === filter
              ? "border-ink bg-ink text-white shadow-sm"
              : "border-slate-200 bg-white text-slate-600 hover:border-sky hover:bg-sky/5"
          }`}
          key={filter}
          onClick={() => onChange(filter)}
          type="button"
        >
          {filter === "all" ? "전체" : SCRIPT_STATUS_LABELS[filter]}
        </button>
      ))}
    </div>
  );
}
