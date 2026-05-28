type AppHeaderProps = {
  title: string;
  description: string;
};

export function AppHeader({ title, description }: AppHeaderProps) {
  return (
    <header className="animate-fade-up overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="animated-accent h-1 bg-gradient-to-r from-mint via-sky to-coral" />
      <div className="p-5">
        <p className="text-[14px] font-medium text-mint">Script Studio</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-[15px] leading-7 text-slate-600">{description}</p>
      </div>
    </header>
  );
}
