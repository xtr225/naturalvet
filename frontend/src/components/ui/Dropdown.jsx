import { useState } from "react";
import Button from "./Button";

export default function Dropdown({ label, items }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <Button variant="outline" onClick={() => setOpen((current) => !current)}>
        {label}
      </Button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 min-w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
              onClick={() => {
                item.onClick?.();
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
