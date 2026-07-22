import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ErrorState from "../../../components/feedback/ErrorState";
import Loader from "../../../components/feedback/Loader";
import { showToast } from "../../../components/feedback/Toast";
import FormActions from "../../../components/forms/FormActions";
import FormField from "../../../components/forms/FormField";
import PageContainer from "../../../components/layout/PageContainer";
import PageHeader from "../../../components/layout/PageHeader";
import Button from "../../../components/ui/Button";
import { Card, CardContent } from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import LoaderButton from "../../../components/ui/LoaderButton";
import Select from "../../../components/ui/Select";
import TextArea from "../../../components/ui/TextArea";
import { medicalRecordsApi, petsApi } from "../../../api/api";
import { useFetch } from "../../../hooks/useFetch";
import { medicalRecordSchema } from "../../../utils/validators";

export default function HistoriaClinicaCreate() {
  const navigate = useNavigate();
  const petsState = useFetch(useCallback(() => petsApi.list(), []));
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      petId: "",
      date: new Date().toISOString().slice(0, 10),
      reason: "",
      diagnosis: "",
      treatment: "",
      vaccines: "",
      attachments: "",
      observations: "",
      veterinarian: "",
    },
  });

  const onSubmit = async (values) => {
    const record = await medicalRecordsApi.create(values);
    showToast({ title: "Consulta registrada" });
    navigate(`/historia-clinica/${record.id}`);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Nueva consulta"
        description="Registro clinico del paciente veterinario."
      />

      {petsState.isLoading && (
        <div className="rounded-xl border border-slate-200 bg-white py-16">
          <Loader label="Cargando pacientes" />
        </div>
      )}

      {petsState.error && (
        <ErrorState
          title="No se pudo cargar pacientes"
          description="Intenta nuevamente."
          onRetry={petsState.reload}
        />
      )}

      {!petsState.isLoading && !petsState.error && (
        <Card hover={false}>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
              <FormField label="Mascota" error={errors.petId?.message}>
                <Select error={errors.petId} {...register("petId")}>
                  <option value="">Selecciona una mascota</option>
                  {petsState.data.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} - {pet.client?.fullName}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Fecha" error={errors.date?.message}>
                <Input type="date" error={errors.date} {...register("date")} />
              </FormField>

              <FormField label="Motivo" error={errors.reason?.message}>
                <Input error={errors.reason} {...register("reason")} />
              </FormField>

              <FormField label="Responsable" error={errors.veterinarian?.message}>
                <Input error={errors.veterinarian} {...register("veterinarian")} />
              </FormField>

              <FormField label="Diagnostico" error={errors.diagnosis?.message} className="md:col-span-2">
                <TextArea error={errors.diagnosis} {...register("diagnosis")} />
              </FormField>

              <FormField label="Tratamiento" error={errors.treatment?.message} className="md:col-span-2">
                <TextArea error={errors.treatment} {...register("treatment")} />
              </FormField>

              <FormField label="Vacunas" error={errors.vaccines?.message}>
                <Input error={errors.vaccines} {...register("vaccines")} />
              </FormField>

              <FormField label="Archivo referencial" error={errors.attachments?.message}>
                <Input error={errors.attachments} {...register("attachments")} />
              </FormField>

              <FormField label="Observaciones" error={errors.observations?.message} className="md:col-span-2">
                <TextArea error={errors.observations} {...register("observations")} />
              </FormField>

              <FormActions className="md:col-span-2">
                <Button variant="outline" onClick={() => navigate("/historia-clinica")}>
                  Cancelar
                </Button>
                <LoaderButton type="submit" isLoading={isSubmitting}>
                  Guardar consulta
                </LoaderButton>
              </FormActions>
            </form>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
