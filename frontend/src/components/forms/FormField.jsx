import { cn } from "../../utils/cn";
import FormError from "./FormError";
import FormLabel from "./FormLabel";

export default function FormField({
  id,
  label,
  error,
  children,
  className,
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
      {children}
      <FormError message={error} />
    </div>
  );
}
