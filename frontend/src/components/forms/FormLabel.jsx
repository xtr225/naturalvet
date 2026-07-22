import { cn } from "../../utils/cn";

export default function FormLabel({ children, className, ...props }) {
  return (
    <label
      className={cn("text-sm font-medium text-slate-700", className)}
      {...props}
    >
      {children}
    </label>
  );
}
