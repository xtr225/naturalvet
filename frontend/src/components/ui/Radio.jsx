import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Radio = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="radio"
      className={cn("h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500", className)}
      {...props}
    />
  );
});

Radio.displayName = "Radio";

export default Radio;
