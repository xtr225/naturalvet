import { useCallback } from "react";
import Logo from "../../../components/branding/Logo";
import ErrorState from "../../../components/feedback/ErrorState";
import Loader from "../../../components/feedback/Loader";
import PageContainer from "../../../components/layout/PageContainer";
import PageHeader from "../../../components/layout/PageHeader";
import { dashboardApi } from "../../../api/api";
import { useFetch } from "../../../hooks/useFetch";
import { DashboardOverview } from "../widgets";

export default function Dashboard() {
  const fetchOverview = useCallback(() => dashboardApi.getOverview(), []);
  const { data, error, isLoading, reload } = useFetch(fetchOverview);

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Resumen operativo de clientes, mascotas, citas e inventario."
        actions={<Logo size="small" />}
      />

      {isLoading && (
        <div className="rounded-xl border border-[rgb(126_139_93_/_0.14)] bg-white py-16 shadow-[var(--shadow-soft)]">
          <Loader label="Cargando indicadores" />
        </div>
      )}

      {error && (
        <ErrorState
          title="No se pudo cargar el dashboard"
          description="Intenta nuevamente para recuperar los indicadores."
          onRetry={reload}
        />
      )}

      {!isLoading && !error && data && <DashboardOverview data={data} />}
    </PageContainer>
  );
}
