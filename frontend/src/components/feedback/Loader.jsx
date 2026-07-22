import { FiLoader } from "react-icons/fi";
import { cn } from "../../utils/cn";

export default function Loader({ label = "Cargando", className }) {
  return (
    <div className={cn("flex items-center justify-center gap-2 text-sm text-slate-500", className)}>
      <FiLoader className="animate-spin" size={18} />
      <span>{label}</span>
    </div>
  );
}
