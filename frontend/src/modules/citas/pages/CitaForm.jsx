import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
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
import { appointmentsApi, clientsApi, petsApi } from "../../../api/api";
import { useFetch } from "../../../hooks/useFetch";
import { appointmentSchema } from "../../../utils/validators";

export default function CitaForm({ mode = "create" }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit";
  const clientsState = useFetch(useCallback(() => clientsApi.list(), []));
  const petsState = useFetch(useCallback(() => petsApi.list(), []));
  const appointmentState = useFetch(useCallback(() => appointmentsApi.find(id), [id]));
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      clientId: "",
      petId: "",
      service: "",
      date: "",
      time: "",
      status: "scheduled",
      veterinarian: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (isEdit && appointmentState.data) {
      reset(appointmentState.data);
    }
  }, [appointmentState.data, isEdit, reset]);

  const isLoading =
    clientsState.isLoading ||
    petsState.isLoading ||
    (isEdit && appointmentState.isLoading);
  const error =
    clientsState.error ||
    petsState.error ||
    (isEdit && appointmentState.error);

  const onSubmit = async (values) => {
    await (isEdit
      ? appointmentsApi.update(id, values)
      : appointmentsApi.create(values));

    showToast({ title: isEdit ? "Cita actualizada" : "Cita creada" });
    navigate("/citas");
  };

  return (
    <PageContainer>
      <PageHeader
        title={isEdit ? "Editar cita" : "Nueva cita"}
        description="Programacion y seguimiento de atenciones."
      />

      {isLoading && (
        <div className="rounded-xl border border-slate-200 bg-white py-16">
          <Loader label="Preparando cita" />
        </div>
      )}

      {error && (
        <ErrorState
          title="No se pudo cargar el formulario"
          description="Intenta nuevamente."
          onRetry={() => {
            clientsState.reload();
            petsState.reload();
            if (isEdit) {
              appointmentState.reload();
            }
          }}
        />
      )}

      {!isLoading && !error && (
        <Card hover={false}>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
              <FormField label="Cliente" error={errors.clientId?.message}>
                <Select error={errors.clientId} {...register("clientId")}>
                  <option value="">Selecciona un cliente</option>
                  {clientsState.data.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.fullName}
                    </option>
                  ))}
                </Select>
              </FormField>

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

              <FormField label="Servicio" error={errors.service?.message}>
                <Input error={errors.service} {...register("service")} />
              </FormField>

              <FormField label="Responsable" error={errors.veterinarian?.message}>
                <Input error={errors.veterinarian} {...register("veterinarian")} />
              </FormField>

              <FormField label="Fecha" error={errors.date?.message}>
                <Input type="date" error={errors.date} {...register("date")} />
              </FormField>

              <FormField label="Hora" error={errors.time?.message}>
                <Input type="time" error={errors.time} {...register("time")} />
              </FormField>

              <FormField label="Estado" error={errors.status?.message}>
                <Select error={errors.status} {...register("status")}>
                  <option value="scheduled">Programada</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="pending">Pendiente</option>
                  <option value="completed">Atendida</option>
                  <option value="cancelled">Cancelada</option>
                </Select>
              </FormField>

              <FormField label="Notas" error={errors.notes?.message} className="md:col-span-2">
                <TextArea error={errors.notes} {...register("notes")} />
              </FormField>

              <FormActions className="md:col-span-2">
                <Button variant="outline" onClick={() => navigate("/citas")}>
                  Cancelar
                </Button>
                <LoaderButton type="submit" isLoading={isSubmitting}>
                  {isEdit ? "Guardar cambios" : "Guardar cita"}
                </LoaderButton>
              </FormActions>
            </form>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
