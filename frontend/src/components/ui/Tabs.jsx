import { cn } from "../../utils/cn";

export default function Tabs({ items, value, onChange }) {
  return (
    <div className="inline-flex rounded-xl bg-slate-100 p-1">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={cn(
            "rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition",
            value === item.value && "bg-white text-slate-950 shadow-sm"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
