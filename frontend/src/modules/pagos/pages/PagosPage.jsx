import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState } from "react";
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
import { clientsApi, paymentsApi } from "../../../api/api";
import { useFetch } from "../../../hooks/useFetch";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import { paymentSchema } from "../../../utils/validators";

const statusMap = {
  paid: ["Pagado", "success"],
  pending: ["Pendiente", "warning"],
  cancelled: ["Anulado", "danger"],
};

const methodMap = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
};

export default function PagosPage() {
  const [status, setStatus] = useState("all");
  const paymentsState = useFetch(useCallback(() => paymentsApi.list({ status }), [status]));
  const clientsState = useFetch(useCallback(() => clientsApi.list(), []));
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      clientId: "",
      concept: "",
      amount: "",
      method: "cash",
      status: "paid",
    },
  });

  const columns = useMemo(
    () => [
      { key: "client", header: "Cliente", render: (payment) => payment.client?.fullName },
      { key: "concept", header: "Concepto" },
      { key: "amount", header: "Monto", render: (payment) => formatCurrency(payment.amount) },
      { key: "method", header: "Metodo", render: (payment) => methodMap[payment.method] },
      { key: "date", header: "Fecha", render: (payment) => formatDate(payment.date) },
      {
        key: "status",
        header: "Estado",
        render: (payment) => {
          const [label, variant] = statusMap[payment.status];
          return <StatusBadge variant={variant}>{label}</StatusBadge>;
        },
      },
    ],
    []
  );

  const onSubmit = async (values) => {
    await paymentsApi.create(values);
    reset();
    await paymentsState.reload();
    showToast({ title: "Pago registrado" });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Pagos"
        description="Registro de cobros, metodos de pago y estados."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Select value={status} onChange={(event) => setStatus(event.target.value)} className="max-w-xs">
            <option value="all">Todos los estados</option>
            <option value="paid">Pagados</option>
            <option value="pending">Pendientes</option>
            <option value="cancelled">Anulados</option>
          </Select>

          {paymentsState.isLoading && (
            <div className="rounded-xl border border-slate-200 bg-white py-16">
              <Loader label="Cargando pagos" />
            </div>
          )}

          {paymentsState.error && (
            <ErrorState
              title="No se pudo cargar pagos"
              description="Intenta nuevamente."
              onRetry={paymentsState.reload}
            />
          )}

          {!paymentsState.isLoading && !paymentsState.error && (
            <DataTable
              columns={columns}
              data={paymentsState.data ?? []}
              emptyMessage="Sin pagos registrados"
            />
          )}
        </div>

        <Card hover={false}>
          <CardHeader>
            <CardTitle>Registrar pago</CardTitle>
          </CardHeader>
          <CardContent>
            {clientsState.isLoading && <Loader label="Cargando clientes" />}
            {!clientsState.isLoading && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField label="Cliente" error={errors.clientId?.message}>
                  <Select {...register("clientId")}>
                    <option value="">Selecciona cliente</option>
                    {clientsState.data.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.fullName}
                      </option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Concepto" error={errors.concept?.message}>
                  <Input {...register("concept")} />
                </FormField>
                <FormField label="Monto" error={errors.amount?.message}>
                  <Input type="number" step="0.01" {...register("amount")} />
                </FormField>
                <FormField label="Metodo" error={errors.method?.message}>
                  <Select {...register("method")}>
                    <option value="cash">Efectivo</option>
                    <option value="card">Tarjeta</option>
                    <option value="transfer">Transferencia</option>
                  </Select>
                </FormField>
                <FormField label="Estado" error={errors.status?.message}>
                  <Select {...register("status")}>
                    <option value="paid">Pagado</option>
                    <option value="pending">Pendiente</option>
                    <option value="cancelled">Anulado</option>
                  </Select>
                </FormField>
                <FormActions>
                  <LoaderButton type="submit" isLoading={isSubmitting}>
                    Registrar pago
                  </LoaderButton>
                </FormActions>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
