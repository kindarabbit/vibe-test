"use client";

import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "./EmptyState";
import { FilterTabs } from "./FilterTabs";
import { ScriptForm } from "./ScriptForm";
import { ScriptList } from "./ScriptList";
import { ScriptPreview } from "./ScriptPreview";
import { SearchInput } from "./SearchInput";
import { createMockScript } from "../generator";
import { loadScripts, saveScripts } from "../storage";
import {
  SCRIPT_TONE_LABELS,
  type PresentationScript,
  type ScriptDuration,
  type ScriptStatus,
  type ScriptTone,
} from "../types";

type StatusFilter = ScriptStatus | "all";
type ToneFilter = ScriptTone | "all";
type DurationFilter = ScriptDuration | "all";

const STATUS_ORDER: ScriptStatus[] = ["draft", "review", "done"];
const TONE_OPTIONS: ScriptTone[] = ["natural", "formal", "friendly"];
const DURATION_OPTIONS: ScriptDuration[] = [5, 10, 15];

export function ScriptWorkspace() {
  const [scripts, setScripts] = useState<PresentationScript[]>([]);
  const [title, setTitle] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [selectedTone, setSelectedTone] = useState<ScriptTone>("natural");
  const [selectedDuration, setSelectedDuration] = useState<ScriptDuration>(5);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<StatusFilter>("all");
  const [selectedToneFilter, setSelectedToneFilter] = useState<ToneFilter>("all");
  const [selectedDurationFilter, setSelectedDurationFilter] =
    useState<DurationFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeScriptId, setActiveScriptId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  useEffect(() => {
    const storedScripts = loadScripts();
    setScripts(storedScripts);
    setActiveScriptId(storedScripts[0]?.id ?? null);
    setHasLoadedStorage(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage) {
      return;
    }

    const saved = saveScripts(scripts);
    setStorageError(saved ? null : "브라우저 저장소에 대본을 저장하지 못했습니다.");
  }, [hasLoadedStorage, scripts]);

  const activeScript = useMemo(
    () => scripts.find((script) => script.id === activeScriptId) ?? scripts[0] ?? null,
    [activeScriptId, scripts],
  );

  const filteredScripts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return scripts.filter((script) => {
      const matchesStatus =
        selectedStatusFilter === "all" || script.status === selectedStatusFilter;
      const matchesTone = selectedToneFilter === "all" || script.tone === selectedToneFilter;
      const matchesDuration =
        selectedDurationFilter === "all" || script.duration === selectedDurationFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        script.title.toLowerCase().includes(normalizedQuery) ||
        script.sourceText.toLowerCase().includes(normalizedQuery) ||
        script.content.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesTone && matchesDuration && matchesQuery;
    });
  }, [
    scripts,
    searchQuery,
    selectedDurationFilter,
    selectedStatusFilter,
    selectedToneFilter,
  ]);

  function handleCreateScript() {
    const trimmedTitle = title.trim();
    const trimmedSourceText = sourceText.trim();

    if (!trimmedTitle || !trimmedSourceText) {
      setValidationError("발표 제목과 PPT 내용 또는 발표 키워드를 모두 입력하세요.");
      return;
    }

    const script = createMockScript({
      title: trimmedTitle,
      sourceText: trimmedSourceText,
      tone: selectedTone,
      duration: selectedDuration,
    });

    setScripts((currentScripts) => [script, ...currentScripts]);
    setActiveScriptId(script.id);
    setTitle("");
    setSourceText("");
    setValidationError(null);
    setCopiedScriptId(null);
  }

  function handleStatusChange(script: PresentationScript) {
    const currentIndex = STATUS_ORDER.indexOf(script.status);
    const nextStatus = STATUS_ORDER[(currentIndex + 1) % STATUS_ORDER.length];
    const updatedAt = new Date().toISOString();

    setScripts((currentScripts) =>
      currentScripts.map((currentScript) =>
        currentScript.id === script.id
          ? { ...currentScript, status: nextStatus, updatedAt }
          : currentScript,
      ),
    );
  }

  async function handleCopy(script: PresentationScript) {
    try {
      await navigator.clipboard.writeText(script.content);
      setCopiedScriptId(script.id);
    } catch {
      setCopiedScriptId(null);
    }
  }

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ScriptForm
          duration={selectedDuration}
          onDurationChange={setSelectedDuration}
          onSourceTextChange={setSourceText}
          onSubmit={handleCreateScript}
          onTitleChange={setTitle}
          onToneChange={setSelectedTone}
          sourceText={sourceText}
          title={title}
          tone={selectedTone}
          validationError={validationError}
        />
        {activeScript ? (
          <ScriptPreview
            copied={copiedScriptId === activeScript.id}
            onCopy={handleCopy}
            onStatusChange={handleStatusChange}
            script={activeScript}
          />
        ) : (
          <EmptyState />
        )}
      </section>

      {storageError ? (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-[15px] font-medium text-amber-800">
          {storageError}
        </p>
      ) : null}

      <section aria-labelledby="script-list-title" className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-medium text-slate-950" id="script-list-title">
              생성된 대본
            </h2>
            <p className="mt-1 text-[15px] leading-7 text-slate-600">
              대본을 선택해 미리보고 상태를 변경할 수 있습니다.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput onChange={setSearchQuery} value={searchQuery} />
            <label className="sr-only" htmlFor="tone-filter">
              말투 필터
            </label>
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2.5 text-[15px]"
              id="tone-filter"
              onChange={(event) =>
                setSelectedToneFilter(event.target.value as ToneFilter)
              }
              value={selectedToneFilter}
            >
              <option value="all">모든 말투</option>
              {TONE_OPTIONS.map((tone) => (
                <option key={tone} value={tone}>
                  {SCRIPT_TONE_LABELS[tone]}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="duration-filter">
              발표 시간 필터
            </label>
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2.5 text-[15px]"
              id="duration-filter"
              onChange={(event) => {
                const value = event.target.value;
                setSelectedDurationFilter(
                  value === "all" ? "all" : (Number(value) as ScriptDuration),
                );
              }}
              value={selectedDurationFilter}
            >
              <option value="all">모든 시간</option>
              {DURATION_OPTIONS.map((duration) => (
                <option key={duration} value={duration}>
                  {duration}분
                </option>
              ))}
            </select>
            <FilterTabs
              onChange={setSelectedStatusFilter}
              value={selectedStatusFilter}
            />
          </div>
        </div>
        <ScriptList
          activeScriptId={activeScript?.id ?? null}
          emptyDescription={
            scripts.length === 0
              ? "첫 발표 대본을 만들면 목록에 표시됩니다."
              : "검색어나 필터 조건에 맞는 대본이 없습니다."
          }
          emptyTitle={scripts.length === 0 ? undefined : "조건에 맞는 대본이 없습니다."}
          onSelectScript={setActiveScriptId}
          onStatusChange={handleStatusChange}
          scripts={filteredScripts}
        />
      </section>
    </>
  );
}
