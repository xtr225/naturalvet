import { useCallback, useMemo, useState } from "react";
import { FiEye, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import ErrorState from "../../../components/feedback/ErrorState";
import Loader from "../../../components/feedback/Loader";
import PageContainer from "../../../components/layout/PageContainer";
import PageHeader from "../../../components/layout/PageHeader";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";
import IconButton from "../../../components/ui/IconButton";
import SearchInput from "../../../components/ui/SearchInput";
import { medicalRecordsApi } from "../../../api/api";
import { useFetch } from "../../../hooks/useFetch";
import { formatDate } from "../../../utils/formatDate";

export default function HistoriaClinicaList() {
  const [search, setSearch] = useState("");
  const fetchRecords = useCallback(() => medicalRecordsApi.list({ search }), [search]);
  const { data, error, isLoading, reload } = useFetch(fetchRecords);

  const columns = useMemo(
    () => [
      {
        key: "pet",
        header: "Paciente",
        render: (record) => (
          <div>
            <p className="font-medium text-slate-950">{record.pet?.name}</p>
            <p className="text-xs text-slate-500">{record.pet?.client?.fullName}</p>
          </div>
        ),
      },
      { key: "reason", header: "Consulta" },
      { key: "diagnosis", header: "Diagnostico" },
      { key: "date", header: "Fecha", render: (record) => formatDate(record.date) },
      { key: "veterinarian", header: "Responsable" },
      {
        key: "actions",
        header: "",
        cellClassName: "text-right",
        render: (record) => (
          <Link to={`/historia-clinica/${record.id}`}>
            <IconButton icon={FiEye} label="Ver historia" variant="ghost" />
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <PageContainer>
      <PageHeader
        title="Historia Clinica"
        description="Consultas, diagnosticos, tratamientos, vacunas y archivos."
        actions={
          <Link to="/historia-clinica/nueva">
            <Button>
              <FiPlus size={16} />
              Nueva consulta
            </Button>
          </Link>
        }
      />

      <div className="mb-4">
        <SearchInput
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onClear={() => setSearch("")}
          placeholder="Buscar por paciente, consulta o diagnostico"
        />
      </div>

      {isLoading && (
        <div className="rounded-xl border border-slate-200 bg-white py-16">
          <Loader label="Cargando historias" />
        </div>
      )}

      {error && (
        <ErrorState
          title="No se pudo cargar la historia clinica"
          description="Intenta nuevamente."
          onRetry={reload}
        />
      )}

      {!isLoading && !error && (
        <DataTable
          columns={columns}
          data={data ?? []}
          emptyMessage="No se encontraron historias clinicas"
        />
      )}
    </PageContainer>
  );
}
