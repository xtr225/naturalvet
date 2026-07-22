import { cn } from "../../utils/cn";

export default function Avatar({ name = "Usuario", src, className }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("h-10 w-10 rounded-xl object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white",
        className
      )}
    >
      {initials}
    </div>
  );
}
