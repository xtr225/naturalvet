import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import StatusBadge from "../../../components/ui/StatusBadge";

export default function InventoryAlertsWidget({ alerts }) {
  return (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Alertas de inventario</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {alerts.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-[rgb(126_139_93_/_0.12)] bg-[color:var(--color-background)]/60 px-3 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {item.name}
              </p>
              <p className="text-xs text-slate-500">
                Stock actual: {item.stock} / minimo: {item.minStock}
              </p>
            </div>

            <StatusBadge variant={item.stock === 0 ? "danger" : "warning"}>
              {item.stock === 0 ? "Agotado" : "Bajo"}
            </StatusBadge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
