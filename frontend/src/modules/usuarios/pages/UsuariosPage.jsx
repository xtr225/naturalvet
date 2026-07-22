import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import ErrorState from "../../../components/feedback/ErrorState";
import Loader from "../../../components/feedback/Loader";
import { showToast } from "../../../components/feedback/Toast";
import FormActions from "../../../components/forms/FormActions";
import FormField from "../../../components/forms/FormField";
import PageContainer from "../../../components/layout/PageContainer";
import PageHeader from "../../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import DataTable from "../../../components/ui/DataTable";
import Input from "../../../components/ui/Input";
import LoaderButton from "../../../components/ui/LoaderButton";
import Select from "../../../components/ui/Select";
import StatusBadge from "../../../components/ui/StatusBadge";
import { usersApi } from "../../../api/api";
import { useFetch } from "../../../hooks/useFetch";
import { userSchema } from "../../../utils/validators";

const roleLabels = {
  admin: "Administrador",
  reception: "Recepcion",
};

export default function UsuariosPage() {
  const usersState = useFetch(useCallback(() => usersApi.list(), []));
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "reception",
    },
  });

  const columns = useMemo(
    () => [
      {
        key: "name",
        header: "Usuario",
        render: (user) => (
          <div>
            <p className="font-medium text-slate-950">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        ),
      },
      {
        key: "roles",
        header: "Rol",
        render: (user) => (
          <StatusBadge variant={user.roles.includes("admin") ? "info" : "neutral"}>
            {roleLabels[user.roles[0]]}
          </StatusBadge>
        ),
      },
      {
        key: "permissions",
        header: "Permisos",
        render: (user) => user.permissions.length,
      },
    ],
    []
  );

  const onSubmit = async (values) => {
    await usersApi.create(values);
    reset();
    await usersState.reload();
    showToast({ title: "Usuario creado" });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Usuarios"
        description="Gestion de perfiles, roles y permisos del sistema."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div>
          {usersState.isLoading && (
            <div className="rounded-xl border border-slate-200 bg-white py-16">
              <Loader label="Cargando usuarios" />
            </div>
          )}

          {usersState.error && (
            <ErrorState
              title="No se pudo cargar usuarios"
              description="Intenta nuevamente."
              onRetry={usersState.reload}
            />
          )}

          {!usersState.isLoading && !usersState.error && (
            <DataTable
              columns={columns}
              data={usersState.data ?? []}
              emptyMessage="Sin usuarios registrados"
            />
          )}
        </div>

        <Card hover={false}>
          <CardHeader>
            <CardTitle>Nuevo usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField label="Nombre" error={errors.name?.message}>
                <Input {...register("name")} />
              </FormField>

              <FormField label="Correo" error={errors.email?.message}>
                <Input {...register("email")} />
              </FormField>

              <FormField label="Rol" error={errors.role?.message}>
                <Select {...register("role")}>
                  <option value="admin">Administrador</option>
                  <option value="reception">Recepcion</option>
                </Select>
              </FormField>

              <FormActions>
                <LoaderButton type="submit" isLoading={isSubmitting}>
                  Crear usuario
                </LoaderButton>
              </FormActions>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
