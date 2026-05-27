import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-ink px-4 py-2.5 text-[15px] font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300 ${className}`}
      type={type}
      {...props}
    />
  );
}
