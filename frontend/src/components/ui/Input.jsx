import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Input = forwardRef(({ className, error, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-xl border border-[rgb(126_139_93_/_0.22)] bg-white px-3 text-sm text-slate-950 outline-none transition duration-200 placeholder:text-slate-400 focus:border-[color:var(--color-primary)] focus:ring-4 focus:ring-[rgb(126_139_93_/_0.16)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
        error && "border-red-400 focus:border-red-500 focus:ring-red-500/10",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
