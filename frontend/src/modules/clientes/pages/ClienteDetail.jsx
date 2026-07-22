import { useCallback } from "react";
import { FiEdit2 } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import ErrorState from "../../../components/feedback/ErrorState";
import Loader from "../../../components/feedback/Loader";
import PageContainer from "../../../components/layout/PageContainer";
import PageHeader from "../../../components/layout/PageHeader";
import Button from "../../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import StatusBadge from "../../../components/ui/StatusBadge";
import { clientsApi } from "../../../api/api";
import { useFetch } from "../../../hooks/useFetch";
import { formatDate } from "../../../utils/formatDate";
import { formatPhone } from "../../../utils/formatPhone";

export default function ClienteDetail() {
  const { id } = useParams();
  const fetchClient = useCallback(() => clientsApi.find(id), [id]);
  const { data: client, error, isLoading, reload } = useFetch(fetchClient);

  return (
    <PageContainer>
      <PageHeader
        title="Detalle de cliente"
        description="Perfil del propietario y relacion con sus mascotas."
        actions={
          client && (
            <Link to={`/clientes/${client.id}/editar`}>
              <Button>
                <FiEdit2 size={16} />
                Editar
              </Button>
            </Link>
          )
        }
      />

      {isLoading && (
        <div className="rounded-xl border border-slate-200 bg-white py-16">
          <Loader label="Cargando cliente" />
        </div>
      )}

      {error && (
        <ErrorState
          title="No se pudo cargar el cliente"
          description="Verifica que el registro exista."
          onRetry={reload}
        />
      )}

      {!isLoading && !error && client && (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>{client.fullName}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Info label="Documento" value={client.document} />
              <Info label="Telefono" value={formatPhone(client.phone)} />
              <Info label="Correo" value={client.email} />
              <Info
                label="Estado"
                value={
                  <StatusBadge variant={client.status === "active" ? "success" : "neutral"}>
                    {client.status === "active" ? "Activo" : "Inactivo"}
                  </StatusBadge>
                }
              />
              <Info label="Direccion" value={client.address} className="md:col-span-2" />
              <Info
                label="Observaciones"
                value={client.notes || "Sin observaciones"}
                className="md:col-span-2"
              />
            </CardContent>
          </Card>

          <Card hover={false}>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Info label="Mascotas asociadas" value={client.pets} />
              <Info
                label="Ultima visita"
                value={client.lastVisit ? formatDate(client.lastVisit) : "Sin visitas"}
              />
              <Info label="Cliente desde" value={formatDate(client.createdAt)} />
            </CardContent>
          </Card>
        </div>
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
