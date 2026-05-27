type BadgeProps = {
  children: React.ReactNode;
};

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[13px] font-medium leading-none text-slate-700">
      {children}
    </span>
  );
}
