import { cn } from "../../utils/cn";

const variants = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/15",
  danger: "bg-red-50 text-red-700 ring-red-600/15",
  info: "bg-[rgb(126_139_93_/_0.12)] text-[color:var(--color-olive-dark)] ring-[rgb(126_139_93_/_0.20)]",
  neutral: "bg-[rgb(245_242_234_/_0.95)] text-slate-700 ring-[rgb(126_139_93_/_0.12)]",
};

export default function StatusBadge({
  children,
  variant = "neutral",
  className,
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
