type AppHeaderProps = {
  title: string;
  description: string;
};

export function AppHeader({ title, description }: AppHeaderProps) {
  return (
    <header className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[14px] font-medium text-mint">Script Studio</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 text-[15px] leading-7 text-slate-600">{description}</p>
    </header>
  );
}
