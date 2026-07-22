import { FiCheckCircle, FiDollarSign } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import StatusBadge from "../../../components/ui/StatusBadge";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatNumber } from "../../../utils/formatNumber";

export default function OperationalSummaryWidget({ stats, serviceMix }) {
  return (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Resumen operativo</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[rgb(126_139_93_/_0.14)] bg-[color:var(--color-background)] p-4">
            <div className="flex items-center gap-2 text-sm text-[color:var(--color-primary)]">
              <FiDollarSign size={16} />
              Ingresos del mes
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {formatCurrency(stats.revenue)}
            </p>
          </div>

          <div className="rounded-xl border border-[rgb(126_139_93_/_0.14)] bg-[color:var(--color-background)] p-4">
            <div className="flex items-center gap-2 text-sm text-[color:var(--color-primary)]">
              <FiCheckCircle size={16} />
              Citas atendidas
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {formatNumber(stats.completedAppointments)}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {serviceMix.map((item) => (
            <div key={item.id}>
              <div className="mb-1 flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-700">{item.name}</p>
                <StatusBadge variant={item.variant}>{item.value}%</StatusBadge>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[rgb(126_139_93_/_0.12)]">
                <div
                  className="h-full rounded-full bg-[color:var(--color-secondary)]"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
