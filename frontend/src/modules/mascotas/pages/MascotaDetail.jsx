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
import { petsApi } from "../../../api/api";
import { useFetch } from "../../../hooks/useFetch";
import { formatDate } from "../../../utils/formatDate";

export default function MascotaDetail() {
  const { id } = useParams();
  const fetchPet = useCallback(() => petsApi.find(id), [id]);
  const { data: pet, error, isLoading, reload } = useFetch(fetchPet);

  return (
    <PageContainer>
      <PageHeader
        title="Perfil de mascota"
        description="Datos del paciente, propietario e historial reciente."
        actions={
          pet && (
            <Link to={`/mascotas/${pet.id}/editar`}>
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
          <Loader label="Cargando mascota" />
        </div>
      )}

      {error && (
        <ErrorState
          title="No se pudo cargar la mascota"
          description="Verifica que el registro exista."
          onRetry={reload}
        />
      )}

      {!isLoading && !error && pet && (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>{pet.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Info label="Especie" value={pet.species} />
              <Info label="Raza" value={pet.breed} />
              <Info label="Sexo" value={pet.sex === "female" ? "Hembra" : "Macho"} />
              <Info label="Nacimiento" value={formatDate(pet.birthDate)} />
              <Info label="Peso" value={`${pet.weight} kg`} />
              <Info label="Color" value={pet.color} />
              <Info
                label="Estado"
                value={
                  <StatusBadge variant={pet.status === "active" ? "success" : "neutral"}>
                    {pet.status === "active" ? "Activo" : "Inactivo"}
                  </StatusBadge>
                }
              />
              <Info label="Propietario" value={pet.client?.fullName ?? "Sin cliente"} />
              <Info label="Observaciones" value={pet.notes || "Sin observaciones"} className="md:col-span-2" />
            </CardContent>
          </Card>

          <Card hover={false}>
            <CardHeader>
              <CardTitle>Historial reciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pet.history.length === 0 && (
                <p className="text-sm text-slate-500">Sin registros clinicos.</p>
              )}
              {pet.history.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-100 p-3">
                  <p className="text-sm font-medium text-slate-950">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatDate(item.date)}</p>
                  <p className="mt-2 text-sm text-slate-500">{item.description}</p>
                </div>
              ))}
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
