import logo from "../../assets/branding/logo.png";
import { cn } from "../../utils/cn";

const sizes = {
  small: {
    image: "h-10 w-10",
    title: "text-sm",
    subtitle: "text-[11px]",
    gap: "gap-3",
  },
  medium: {
    image: "h-14 w-14",
    title: "text-lg",
    subtitle: "text-xs",
    gap: "gap-3",
  },
  large: {
    image: "h-24 w-24",
    title: "text-3xl",
    subtitle: "text-sm",
    gap: "gap-4",
  },
};

export default function Logo({
  size = "medium",
  stacked = false,
  showLocation = false,
  className,
}) {
  const currentSize = sizes[size] ?? sizes.medium;

  return (
    <div
      className={cn(
        "flex items-center",
        stacked && "flex-col text-center",
        currentSize.gap,
        className
      )}
    >
      <img
        src={logo}
        alt="Natural Vet"
        className={cn("shrink-0 object-contain", currentSize.image)}
      />

      <div className="min-w-0">
        <p className={cn("font-semibold tracking-normal", currentSize.title)}>
          Natural Vet
        </p>
        <p className={cn("font-medium text-[color:var(--color-primary)]", currentSize.subtitle)}>
          Clínica Veterinaria
        </p>
        {showLocation && (
          <p className="mt-1 text-xs text-slate-500">Puno - Perú</p>
        )}
      </div>
    </div>
  );
}
