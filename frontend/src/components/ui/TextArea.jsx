import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const TextArea = forwardRef(({ className, error, rows = 4, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "w-full resize-none rounded-xl border border-[rgb(126_139_93_/_0.22)] bg-white px-3 py-2 text-sm text-slate-950 outline-none transition duration-200 placeholder:text-slate-400 focus:border-[color:var(--color-primary)] focus:ring-4 focus:ring-[rgb(126_139_93_/_0.16)]",
        error && "border-red-400 focus:border-red-500 focus:ring-red-500/10",
        className
      )}
      {...props}
    />
  );
});

TextArea.displayName = "TextArea";

export default TextArea;
