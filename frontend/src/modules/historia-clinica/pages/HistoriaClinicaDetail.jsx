import { useCallback } from "react";
import { useParams } from "react-router-dom";
import ErrorState from "../../../components/feedback/ErrorState";
import Loader from "../../../components/feedback/Loader";
import PageContainer from "../../../components/layout/PageContainer";
import PageHeader from "../../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { medicalRecordsApi } from "../../../api/api";
import { useFetch } from "../../../hooks/useFetch";
import { formatDate } from "../../../utils/formatDate";

export default function HistoriaClinicaDetail() {
  const { id } = useParams();
  const fetchRecord = useCallback(() => medicalRecordsApi.find(id), [id]);
  const { data: record, error, isLoading, reload } = useFetch(fetchRecord);

  return (
    <PageContainer>
      <PageHeader
        title="Detalle clinico"
        description="Consulta, diagnostico, tratamiento y observaciones."
      />

      {isLoading && (
        <div className="rounded-xl border border-slate-200 bg-white py-16">
          <Loader label="Cargando historia" />
        </div>
      )}

      {error && (
        <ErrorState
          title="No se pudo cargar la historia"
          description="Verifica que el registro exista."
          onRetry={reload}
        />
      )}

      {!isLoading && !error && record && (
        <Card hover={false}>
          <CardHeader>
            <CardTitle>{record.reason}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <Info label="Paciente" value={record.pet?.name} />
            <Info label="Propietario" value={record.pet?.client?.fullName} />
            <Info label="Fecha" value={formatDate(record.date)} />
            <Info label="Responsable" value={record.veterinarian} />
            <Info label="Diagnostico" value={record.diagnosis} className="md:col-span-2" />
            <Info label="Tratamiento" value={record.treatment} className="md:col-span-2" />
            <Info label="Vacunas" value={record.vaccines || "Sin vacunas"} />
            <Info label="Archivos" value={record.attachments || "Sin archivos"} />
            <Info label="Observaciones" value={record.observations || "Sin observaciones"} className="md:col-span-2" />
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}

function Info({ label, value, className }) {
  return (
    <div className={className}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="mt-1 text-sm font-medium text-slate-900">{value}</div>
    </div>
  );
}
