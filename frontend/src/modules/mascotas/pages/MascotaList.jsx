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
import { petsApi } from "../../../api/api";
import { useFetch } from "../../../hooks/useFetch";
import { usePagination } from "../../../hooks/usePagination";

export default function MascotaList() {
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("all");
  const fetchPets = useCallback(() => petsApi.list({ search, species }), [search, species]);
  const { data, error, isLoading, reload } = useFetch(fetchPets);
  const { items, page, setPage, totalPages } = usePagination(data ?? [], 5);

  const handleDelete = useCallback(async (pet) => {
    const result = await confirmAction({
      title: "Eliminar mascota",
      text: `Se eliminara a ${pet.name}.`,
      confirmButtonText: "Eliminar",
    });

    if (!result.isConfirmed) {
      return;
    }

    await petsApi.remove(pet.id);
    await reload();
    showToast({ title: "Mascota eliminada" });
  }, [reload]);

  const columns = useMemo(
    () => [
      {
        key: "name",
        header: "Mascota",
        render: (pet) => (
          <div>
            <p className="font-medium text-slate-950">{pet.name}</p>
            <p className="text-xs text-slate-500">{pet.species} - {pet.breed}</p>
          </div>
        ),
      },
      {
        key: "client",
        header: "Cliente",
        render: (pet) => pet.client?.fullName ?? "Sin cliente",
      },
      {
        key: "weight",
        header: "Peso",
        render: (pet) => `${pet.weight} kg`,
      },
      {
        key: "status",
        header: "Estado",
        render: (pet) => (
          <StatusBadge variant={pet.status === "active" ? "success" : "neutral"}>
            {pet.status === "active" ? "Activo" : "Inactivo"}
          </StatusBadge>
        ),
      },
      {
        key: "actions",
        header: "",
        cellClassName: "text-right",
        render: (pet) => (
          <div className="flex justify-end gap-1">
            <Link to={`/mascotas/${pet.id}`}>
              <IconButton icon={FiEye} label="Ver mascota" variant="ghost" />
            </Link>
            <Link to={`/mascotas/${pet.id}/editar`}>
              <IconButton icon={FiEdit2} label="Editar mascota" variant="ghost" />
            </Link>
            <IconButton
              icon={FiTrash2}
              label="Eliminar mascota"
              variant="ghost"
              onClick={() => handleDelete(pet)}
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
        title="Mascotas"
        description="Gestion de pacientes y relacion con propietarios."
        actions={
          <Link to="/mascotas/nuevo">
            <Button>
              <FiPlus size={16} />
              Nueva mascota
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
          placeholder="Buscar por mascota, raza o propietario"
        />

        <Select
          value={species}
          onChange={(event) => {
            setPage(1);
            setSpecies(event.target.value);
          }}
        >
          <option value="all">Todas las especies</option>
          <option value="Canino">Canino</option>
          <option value="Felino">Felino</option>
        </Select>
      </div>

      {isLoading && (
        <div className="rounded-xl border border-slate-200 bg-white py-16">
          <Loader label="Cargando mascotas" />
        </div>
      )}

      {error && (
        <ErrorState
          title="No se pudo cargar mascotas"
          description="Intenta nuevamente para recuperar el listado."
          onRetry={reload}
        />
      )}

      {!isLoading && !error && (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={items}
            emptyMessage="No se encontraron mascotas"
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </PageContainer>
  );
}
