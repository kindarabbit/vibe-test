import { AppHeader } from "@/components/layout/AppHeader";
import { ScriptWorkspace } from "@/features/scripts/components/ScriptWorkspace";

export default function AppPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eefdfa_42%,#fff7ed_100%)] text-ink">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <AppHeader
          description="PPT/PDF 내용을 추출하거나 발표 키워드를 입력하고, 말투와 발표 시간을 선택하세요."
          title="발표 대본 만들기"
        />
        <ScriptWorkspace />
      </div>
    </main>
  );
}
