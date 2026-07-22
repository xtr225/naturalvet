export default function NavGroup({ title, children }) {
  return (
    <div>
      {title && (
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-slate-500">
          {title}
        </p>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
}
