import type { PresentationScript } from "../types";
import { EmptyState } from "./EmptyState";
import { ScriptCard } from "./ScriptCard";

type ScriptListProps = {
  scripts: PresentationScript[];
  activeScriptId: string | null;
  emptyTitle?: string;
  emptyDescription?: string;
  onSelectScript: (scriptId: string) => void;
  onStatusChange: (script: PresentationScript) => void;
};

export function ScriptList({
  scripts,
  activeScriptId,
  emptyTitle,
  emptyDescription,
  onSelectScript,
  onStatusChange,
}: ScriptListProps) {
  if (scripts.length === 0) {
    return <EmptyState description={emptyDescription} title={emptyTitle} />;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {scripts.map((script) => (
        <ScriptCard
          isActive={activeScriptId === script.id}
          key={script.id}
          onSelect={() => onSelectScript(script.id)}
          onStatusChange={() => onStatusChange(script)}
          script={script}
        />
      ))}
    </div>
  );
}
