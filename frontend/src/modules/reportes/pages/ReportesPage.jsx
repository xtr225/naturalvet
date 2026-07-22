import { useCallback, useMemo } from "react";
import { FiCalendar, FiDownload, FiDollarSign, FiPackage, FiUsers } from "react-icons/fi";
import ErrorState from "../../../components/feedback/ErrorState";
import Loader from "../../../components/feedback/Loader";
import { showToast } from "../../../components/feedback/Toast";
import StatCard from "../../../components/cards/StatCard";
import PageContainer from "../../../components/layout/PageContainer";
import PageHeader from "../../../components/layout/PageHeader";
import Button from "../../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import DataTable from "../../../components/ui/DataTable";
import StatusBadge from "../../../components/ui/StatusBadge";
import { reportsApi } from "../../../api/api";
import { useFetch } from "../../../hooks/useFetch";
import { formatCurrency } from "../../../utils/formatCurrency";

const appointmentStatusLabels = {
  scheduled: "Programadas",
  confirmed: "Confirmadas",
  pending: "Pendientes",
  completed: "Atendidas",
  cancelled: "Canceladas",
};

export default function ReportesPage() {
  const reportsState = useFetch(useCallback(() => reportsApi.summary(), []));

  const productColumns = useMemo(
    () => [
      { key: "name", header: "Producto" },
      { key: "category", header: "Categoria" },
      { key: "stock", header: "Stock" },
      { key: "minStock", header: "Minimo" },
      {
        key: "status",
        header: "Estado",
        render: (product) => (
          <StatusBadge variant={product.stock <= product.minStock ? "warning" : "success"}>
            {product.stock <= product.minStock ? "Alerta" : "Correcto"}
          </StatusBadge>
        ),
      },
    ],
    []
  );

  const exportReport = () => {
    showToast({ title: "Reporte CSV generado" });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Reportes"
        description="Indicadores, estadisticas y exportacion operativa."
        actions={
          <Button onClick={exportReport}>
            <FiDownload size={16} />
            Exportar CSV
          </Button>
        }
      />

      {reportsState.isLoading && (
        <div className="rounded-xl border border-slate-200 bg-white py-16">
          <Loader label="Generando reportes" />
        </div>
      )}

      {reportsState.error && (
        <ErrorState
          title="No se pudo cargar reportes"
          description="Intenta nuevamente."
          onRetry={reportsState.reload}
        />
      )}

      {!reportsState.isLoading && !reportsState.error && reportsState.data && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            <StatCard title="Clientes" value={reportsState.data.totals.clients} icon={FiUsers} />
            <StatCard title="Mascotas" value={reportsState.data.totals.pets} icon={FiUsers} color="emerald" />
            <StatCard title="Citas" value={reportsState.data.totals.appointments} icon={FiCalendar} color="amber" />
            <StatCard title="Stock bajo" value={reportsState.data.totals.lowStock} icon={FiPackage} color="red" />
            <StatCard title="Ingresos" value={reportsState.data.totals.revenue} icon={FiDollarSign} color="violet" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Estado de citas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reportsState.data.appointmentStatus.map((item) => (
                  <div key={item.status} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-3">
                    <span className="text-sm text-slate-600">
                      {appointmentStatusLabels[item.status]}
                    </span>
                    <StatusBadge variant="info">{item.total}</StatusBadge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card hover={false}>
              <CardHeader>
                <CardTitle>Productos sensibles</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={productColumns}
                  data={reportsState.data.topProducts}
                  emptyMessage="Sin productos"
                />
              </CardContent>
            </Card>
          </div>

          <Card hover={false}>
            <CardHeader>
              <CardTitle>Resumen financiero</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Ingresos confirmados:{" "}
                <span className="font-semibold text-slate-950">
                  {formatCurrency(reportsState.data.totals.revenue)}
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
