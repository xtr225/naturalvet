import { cn } from "../../utils/cn";

export default function FormActions({ children, className }) {
  return (
    <div className={cn("flex items-center justify-end gap-2 pt-2", className)}>
      {children}
    </div>
  );
}
