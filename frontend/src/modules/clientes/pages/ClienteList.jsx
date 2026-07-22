import { useCallback, useMemo, useState } from "react";
import { FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
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
import Pagination from "../../../components/ui/Pagination";
import SearchInput from "../../../components/ui/SearchInput";
import Select from "../../../components/ui/Select";
import StatusBadge from "../../../components/ui/StatusBadge";
import { clientsApi } from "../../../api/api";
import { useFetch } from "../../../hooks/useFetch";
import { usePagination } from "../../../hooks/usePagination";
import { formatDate } from "../../../utils/formatDate";
import { formatPhone } from "../../../utils/formatPhone";

const statusLabels = {
  active: "Activo",
  inactive: "Inactivo",
};

export default function ClienteList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const fetchClients = useCallback(
    () => clientsApi.list({ search, status }),
    [search, status]
  );
  const { data, error, isLoading, reload } = useFetch(fetchClients);
  const { items, page, setPage, totalPages } = usePagination(data ?? [], 5);

  const handleDelete = useCallback(async (client) => {
    const result = await confirmAction({
      title: "Eliminar cliente",
      text: `Se eliminara a ${client.fullName}.`,
      confirmButtonText: "Eliminar",
    });

    if (!result.isConfirmed) {
      return;
    }

    await clientsApi.remove(client.id);
    await reload();
    showToast({ title: "Cliente eliminado" });
  }, [reload]);

  const columns = useMemo(
    () => [
      {
        key: "fullName",
        header: "Cliente",
        render: (client) => (
          <div>
            <p className="font-medium text-slate-950">{client.fullName}</p>
            <p className="text-xs text-slate-500">DNI {client.document}</p>
          </div>
        ),
      },
      {
        key: "contact",
        header: "Contacto",
        render: (client) => (
          <div>
            <p>{formatPhone(client.phone)}</p>
            <p className="text-xs text-slate-500">{client.email}</p>
          </div>
        ),
      },
      {
        key: "pets",
        header: "Mascotas",
      },
      {
        key: "lastVisit",
        header: "Ultima visita",
        render: (client) => client.lastVisit ? formatDate(client.lastVisit) : "Sin visitas",
      },
      {
        key: "status",
        header: "Estado",
        render: (client) => (
          <StatusBadge variant={client.status === "active" ? "success" : "neutral"}>
            {statusLabels[client.status]}
          </StatusBadge>
        ),
      },
      {
        key: "actions",
        header: "",
        cellClassName: "text-right",
        render: (client) => (
          <div className="flex justify-end gap-1">
            <Link to={`/clientes/${client.id}`}>
              <IconButton icon={FiEye} label="Ver cliente" variant="ghost" />
            </Link>
            <Link to={`/clientes/${client.id}/editar`}>
              <IconButton icon={FiEdit2} label="Editar cliente" variant="ghost" />
            </Link>
            <IconButton
              icon={FiTrash2}
              label="Eliminar cliente"
              variant="ghost"
              onClick={() => handleDelete(client)}
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
        title="Clientes"
        description="Gestion de propietarios, contacto y relacion con mascotas."
        actions={
          <Link to="/clientes/nuevo">
            <Button>
              <FiPlus size={16} />
              Nuevo cliente
            </Button>
          </Link>
        }
      />

      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px]">
        <SearchInput
          value={search}
          onChange={(event) => {
            setPage(1);
            setSearch(event.target.value);
          }}
          onClear={() => {
            setPage(1);
            setSearch("");
          }}
          placeholder="Buscar por nombre, documento, telefono o correo"
        />

        <Select
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value);
          }}
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </Select>
      </div>

      {isLoading && (
        <div className="rounded-xl border border-slate-200 bg-white py-16">
          <Loader label="Cargando clientes" />
        </div>
      )}

      {error && (
        <ErrorState
          title="No se pudo cargar clientes"
          description="Intenta nuevamente para recuperar el listado."
          onRetry={reload}
        />
      )}

      {!isLoading && !error && (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={items}
            emptyMessage="No se encontraron clientes"
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </PageContainer>
  );
}
