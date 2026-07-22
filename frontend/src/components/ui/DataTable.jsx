import { cn } from "../../utils/cn";

export default function DataTable({
  columns,
  data,
  keyField = "id",
  emptyMessage = "No hay datos disponibles",
  className,
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-[rgb(126_139_93_/_0.14)] bg-white shadow-[var(--shadow-soft)]", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-[color:var(--color-background)]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-left font-medium text-[color:var(--color-primary)]",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[rgb(126_139_93_/_0.10)] bg-white">
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {data.map((row) => (
              <tr key={row[keyField]} className="transition-colors hover:bg-[rgb(126_139_93_/_0.06)]">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn("px-4 py-3 text-slate-700", column.cellClassName)}
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
