type EmptyStateProps = {
  title?: string;
  description?: string;
};

export function EmptyState({
  title = "아직 생성된 대본이 없습니다.",
  description = "발표 제목과 키워드 또는 PPT 파일을 입력하면 선택한 말투와 발표 시간에 맞춘 대본이 여기에 표시됩니다.",
}: EmptyStateProps) {
  return (
    <div className="animate-fade-up rounded-lg border border-dashed border-sky/70 bg-white/90 p-8 text-center shadow-sm">
      <h2 className="text-xl font-medium text-slate-950">{title}</h2>
      <p className="mt-2 text-[15px] leading-7 text-slate-600">{description}</p>
    </div>
  );
}
