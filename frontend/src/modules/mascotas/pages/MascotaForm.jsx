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
import { clientsApi, petsApi } from "../../../api/api";
import { useFetch } from "../../../hooks/useFetch";
import { petSchema } from "../../../utils/validators";

export default function MascotaForm({ mode = "create" }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit";
  const fetchClients = useCallback(() => clientsApi.list(), []);
  const fetchPet = useCallback(() => petsApi.find(id), [id]);
  const clientsState = useFetch(fetchClients);
  const petState = useFetch(fetchPet);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: "",
      species: "Canino",
      breed: "",
      sex: "female",
      birthDate: "",
      weight: "",
      color: "",
      status: "active",
      clientId: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (isEdit && petState.data) {
      reset(petState.data);
    }
  }, [isEdit, petState.data, reset]);

  const onSubmit = async (values) => {
    const pet = isEdit
      ? await petsApi.update(id, values)
      : await petsApi.create(values);

    showToast({ title: isEdit ? "Mascota actualizada" : "Mascota creada" });
    navigate(`/mascotas/${pet.id}`);
  };

  const isLoading = clientsState.isLoading || (isEdit && petState.isLoading);
  const error = clientsState.error || (isEdit && petState.error);

  return (
    <PageContainer>
      <PageHeader
        title={isEdit ? "Editar mascota" : "Nueva mascota"}
        description="Registro clinico basico del paciente veterinario."
      />

      {isLoading && (
        <div className="rounded-xl border border-slate-200 bg-white py-16">
          <Loader label="Preparando formulario" />
        </div>
      )}

      {error && (
        <ErrorState
          title="No se pudo cargar el formulario"
          description="Verifica la informacion e intenta nuevamente."
          onRetry={() => {
            clientsState.reload();
            if (isEdit) {
              petState.reload();
            }
          }}
        />
      )}

      {!isLoading && !error && (
        <Card hover={false}>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
              <FormField label="Nombre" error={errors.name?.message}>
                <Input error={errors.name} {...register("name")} />
              </FormField>

              <FormField label="Propietario" error={errors.clientId?.message}>
                <Select error={errors.clientId} {...register("clientId")}>
                  <option value="">Selecciona un cliente</option>
                  {clientsState.data.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.fullName}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Especie" error={errors.species?.message}>
                <Select error={errors.species} {...register("species")}>
                  <option value="Canino">Canino</option>
                  <option value="Felino">Felino</option>
                  <option value="Ave">Ave</option>
                  <option value="Otro">Otro</option>
                </Select>
              </FormField>

              <FormField label="Raza" error={errors.breed?.message}>
                <Input error={errors.breed} {...register("breed")} />
              </FormField>

              <FormField label="Sexo" error={errors.sex?.message}>
                <Select error={errors.sex} {...register("sex")}>
                  <option value="female">Hembra</option>
                  <option value="male">Macho</option>
                </Select>
              </FormField>

              <FormField label="Fecha de nacimiento" error={errors.birthDate?.message}>
                <Input type="date" error={errors.birthDate} {...register("birthDate")} />
              </FormField>

              <FormField label="Peso kg" error={errors.weight?.message}>
                <Input type="number" step="0.1" error={errors.weight} {...register("weight")} />
              </FormField>

              <FormField label="Color" error={errors.color?.message}>
                <Input error={errors.color} {...register("color")} />
              </FormField>

              <FormField label="Estado" error={errors.status?.message}>
                <Select error={errors.status} {...register("status")}>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </Select>
              </FormField>

              <FormField label="Observaciones" error={errors.notes?.message} className="md:col-span-2">
                <TextArea error={errors.notes} {...register("notes")} />
              </FormField>

              <FormActions className="md:col-span-2">
                <Button variant="outline" onClick={() => navigate("/mascotas")}>
                  Cancelar
                </Button>
                <LoaderButton type="submit" isLoading={isSubmitting}>
                  {isEdit ? "Guardar cambios" : "Guardar mascota"}
                </LoaderButton>
              </FormActions>
            </form>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
