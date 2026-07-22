import { useCallback, useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import ErrorState from "../../../components/feedback/ErrorState";
import Loader from "../../../components/feedback/Loader";
import { showToast } from "../../../components/feedback/Toast";
import PageContainer from "../../../components/layout/PageContainer";
import PageHeader from "../../../components/layout/PageHeader";
import { confirmAction } from "../../../components/modals/ConfirmModal";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";
import IconButton from "../../../components/ui/IconButton";
import SearchInput from "../../../components/ui/SearchInput";
import Select from "../../../components/ui/Select";
import StatusBadge from "../../../components/ui/StatusBadge";
import { appointmentsApi } from "../../../api/api";
import { useFetch } from "../../../hooks/useFetch";
import { formatDate } from "../../../utils/formatDate";

const statusMap = {
  scheduled: ["Programada", "info"],
  confirmed: ["Confirmada", "success"],
  pending: ["Pendiente", "warning"],
  completed: ["Atendida", "neutral"],
  cancelled: ["Cancelada", "danger"],
};

export default function CitaList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");
  const fetchAppointments = useCallback(
    () => appointmentsApi.list({ search, status, date }),
    [date, search, status]
  );
  const { data, error, isLoading, reload } = useFetch(fetchAppointments);

  const handleDelete = useCallback(async (appointment) => {
    const result = await confirmAction({
      title: "Eliminar cita",
      text: `Se eliminara la cita de ${appointment.pet?.name}.`,
      confirmButtonText: "Eliminar",
    });

    if (!result.isConfirmed) {
      return;
    }

    await appointmentsApi.remove(appointment.id);
    await reload();
    showToast({ title: "Cita eliminada" });
  }, [reload]);

  const columns = useMemo(
    () => [
      {
        key: "patient",
        header: "Paciente",
        render: (appointment) => (
          <div>
            <p className="font-medium text-slate-950">{appointment.pet?.name}</p>
            <p className="text-xs text-slate-500">{appointment.client?.fullName}</p>
          </div>
        ),
      },
      { key: "service", header: "Servicio" },
      {
        key: "date",
        header: "Fecha",
        render: (appointment) => `${formatDate(appointment.date)} - ${appointment.time}`,
      },
      { key: "veterinarian", header: "Responsable" },
      {
        key: "status",
        header: "Estado",
        render: (appointment) => {
          const [label, variant] = statusMap[appointment.status];
          return <StatusBadge variant={variant}>{label}</StatusBadge>;
        },
      },
      {
        key: "actions",
        header: "",
        cellClassName: "text-right",
        render: (appointment) => (
          <div className="flex justify-end gap-1">
            <Link to={`/citas/${appointment.id}/editar`}>
              <IconButton icon={FiEdit2} label="Editar cita" variant="ghost" />
            </Link>
            <IconButton
              icon={FiTrash2}
              label="Eliminar cita"
              variant="ghost"
              onClick={() => handleDelete(appointment)}
            />
          </div>
        ),
      },
    ],
    [handleDelete]
  );

  return (
    <PageContainer>
      <PageHeader
        title="Citas"
        description="Agenda operativa de atenciones veterinarias."
        actions={
          <Link to="/citas/nueva">
            <Button>
              <FiPlus size={16} />
              Nueva cita
            </Button>
          </Link>
        }
      />

      <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_200px_180px]">
        <SearchInput
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onClear={() => setSearch("")}
          placeholder="Buscar por mascota, cliente o servicio"
        />
        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">Todos los estados</option>
          <option value="scheduled">Programadas</option>
          <option value="confirmed">Confirmadas</option>
          <option value="pending">Pendientes</option>
          <option value="completed">Atendidas</option>
          <option value="cancelled">Canceladas</option>
        </Select>
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
      </div>

      {isLoading && (
        <div className="rounded-xl border border-slate-200 bg-white py-16">
          <Loader label="Cargando agenda" />
        </div>
      )}

      {error && (
        <ErrorState
          title="No se pudo cargar la agenda"
          description="Intenta nuevamente para recuperar las citas."
          onRetry={reload}
        />
      )}

      {!isLoading && !error && (
        <DataTable
          columns={columns}
          data={data ?? []}
          emptyMessage="No se encontraron citas"
        />
      )}
    </PageContainer>
  );
}
