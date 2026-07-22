import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Checkbox = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-[rgb(126_139_93_/_0.35)] text-[color:var(--color-secondary)] focus:ring-[color:var(--color-secondary)]",
        className
      )}
      {...props}
    />
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;
