import { cn } from "../../utils/cn";

export function Card({
  children,
  className,
  hover = true,
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[rgb(126_139_93_/_0.14)] bg-[color:var(--color-surface)] shadow-[var(--shadow-soft)] transition-all duration-300",
        hover &&
          "hover:-translate-y-1 hover:shadow-[0_22px_54px_rgb(83_97_59_/_0.16)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}) {
  return (
    <div
      className={cn(
        "border-b border-[rgb(126_139_93_/_0.12)] px-6 py-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold text-[#27331f]",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function CardContent({
  children,
  className,
}) {
  return (
    <div
      className={cn(
        "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className,
}) {
  return (
    <div
      className={cn(
        "px-6 py-4 border-t border-slate-100",
        className
      )}
    >
      {children}
    </div>
  );
}
