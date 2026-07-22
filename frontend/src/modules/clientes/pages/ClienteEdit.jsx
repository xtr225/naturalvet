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
import { clientsApi } from "../../../api/api";
import { useFetch } from "../../../hooks/useFetch";
import { clientSchema } from "../../../utils/validators";

export default function ClienteEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fetchClient = useCallback(() => clientsApi.find(id), [id]);
  const { data: client, error, isLoading, reload } = useFetch(fetchClient);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      document: "",
      phone: "",
      email: "",
      address: "",
      status: "active",
      notes: "",
    },
  });

  useEffect(() => {
    if (client) {
      reset(client);
    }
  }, [client, reset]);

  const onSubmit = async (values) => {
    await clientsApi.update(id, values);
    showToast({ title: "Cliente actualizado" });
    navigate(`/clientes/${id}`);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Editar cliente"
        description="Actualizacion de datos del propietario."
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
        <Card hover={false}>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
              <FormField label="Nombres" error={errors.firstName?.message}>
                <Input error={errors.firstName} {...register("firstName")} />
              </FormField>

              <FormField label="Apellidos" error={errors.lastName?.message}>
                <Input error={errors.lastName} {...register("lastName")} />
              </FormField>

              <FormField label="Documento" error={errors.document?.message}>
                <Input error={errors.document} {...register("document")} />
              </FormField>

              <FormField label="Telefono" error={errors.phone?.message}>
                <Input error={errors.phone} {...register("phone")} />
              </FormField>

              <FormField label="Correo" error={errors.email?.message}>
                <Input error={errors.email} {...register("email")} />
              </FormField>

              <FormField label="Estado" error={errors.status?.message}>
                <Select error={errors.status} {...register("status")}>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </Select>
              </FormField>

              <FormField
                label="Direccion"
                error={errors.address?.message}
                className="md:col-span-2"
              >
                <Input error={errors.address} {...register("address")} />
              </FormField>

              <FormField
                label="Observaciones"
                error={errors.notes?.message}
                className="md:col-span-2"
              >
                <TextArea error={errors.notes} {...register("notes")} />
              </FormField>

              <FormActions className="md:col-span-2">
                <Button variant="outline" onClick={() => navigate(`/clientes/${id}`)}>
                  Cancelar
                </Button>
                <LoaderButton type="submit" isLoading={isSubmitting}>
                  Guardar cambios
                </LoaderButton>
              </FormActions>
            </form>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
