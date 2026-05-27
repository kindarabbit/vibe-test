import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`min-h-40 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-[15px] leading-7 outline-none transition placeholder:text-slate-400 focus:border-mint focus:ring-2 focus:ring-mint/20 ${className}`}
      {...props}
    />
  );
}
