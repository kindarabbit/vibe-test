type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition duration-200 ${className}`}
    >
      {children}
    </div>
  );
}
