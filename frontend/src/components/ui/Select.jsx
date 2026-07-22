import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Select = forwardRef(({ className, children, error, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-[rgb(126_139_93_/_0.22)] bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-[color:var(--color-primary)] focus:ring-4 focus:ring-[rgb(126_139_93_/_0.16)]",
        error && "border-red-400 focus:border-red-500 focus:ring-red-500/10",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;
