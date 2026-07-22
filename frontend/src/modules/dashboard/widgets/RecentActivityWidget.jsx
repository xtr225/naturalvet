import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import StatusBadge from "../../../components/ui/StatusBadge";
import { formatTime } from "../../../utils/formatDate";

export default function RecentActivityWidget({ items }) {
  return (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Actividad reciente</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4 rounded-xl border border-[rgb(126_139_93_/_0.10)] px-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {item.title}
              </p>
              <p className="mt-1 text-sm text-slate-500">{item.description}</p>
            </div>

            <div className="shrink-0 text-right">
              <StatusBadge variant={item.variant}>{item.status}</StatusBadge>
              <p className="mt-2 text-xs text-slate-400">{formatTime(item.date)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
