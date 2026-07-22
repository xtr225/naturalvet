import { FiLoader } from "react-icons/fi";
import Button from "./Button";
import { cn } from "../../utils/cn";

export default function LoaderButton({
  isLoading = false,
  loadingText = "Procesando",
  children,
  disabled,
  className,
  ...props
}) {
  return (
    <Button
      disabled={disabled || isLoading}
      className={cn("relative", className)}
      {...props}
    >
      {isLoading && <FiLoader className="animate-spin" size={16} />}
      {isLoading ? loadingText : children}
    </Button>
  );
}
