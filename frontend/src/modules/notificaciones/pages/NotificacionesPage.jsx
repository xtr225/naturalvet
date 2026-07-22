import { useCallback, useMemo, useState } from "react";
import ErrorState from "../../../components/feedback/ErrorState";
import Loader from "../../../components/feedback/Loader";
import { showToast } from "../../../components/feedback/Toast";
import PageContainer from "../../../components/layout/PageContainer";
import PageHeader from "../../../components/layout/PageHeader";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../../components/ui/Card";
import DataTable from "../../../components/ui/DataTable";
import LoaderButton from "../../../components/ui/LoaderButton";
import Select from "../../../components/ui/Select";
import StatusBadge from "../../../components/ui/StatusBadge";

import { useFetch } from "../../../hooks/useFetch";
import notificationService from "../services/notificationService";

const statusMap = {
    pending: ["Pendiente", "warning"],
    sent: ["Enviado", "success"],
    failed: ["Error", "danger"],
};

export default function NotificacionesPage() {

    const [status, setStatus] = useState("all");

   const notificationsState = useFetch(
    useCallback(async () => {
        console.log("========== NOTIFICACIONES ==========");
        console.log("Estado:", status);

        const response = await notificationService.getAll(status);

        console.log("Respuesta API:", response);

        return response;
    }, [status])
);

    const columns = useMemo(() => [
        {
            key: "title",
            header: "Título",
        },
        {
            key: "phone",
            header: "Destino",
        },
        {
            key: "scheduled_at",
            header: "Programada",
            render: (row) =>
                row.scheduled_at
                    ? new Date(row.scheduled_at).toLocaleString()
                    : "-",
        },
        {
            key: "status",
            header: "Estado",
            render: (row) => {
                const [label, variant] =
                    statusMap[row.status] ?? ["Desconocido", "secondary"];

                return (
                    <StatusBadge variant={variant}>
                        {label}
                    </StatusBadge>
                );
            },
        },
        {
            key: "actions",
            header: "Acciones",
            render: (row) => (
                <div className="flex gap-2">

                    <LoaderButton
                        size="sm"
                        onClick={async () => {

                            window.open(
                                row.whatsapp_url,
                                "_blank"
                            );

                        }}
                    >
                        WhatsApp
                    </LoaderButton>

                    {row.status === "pending" && (

                        <LoaderButton
                            size="sm"
                            onClick={async () => {

                                await notificationService.markAsSent(row.id);

                                showToast({
                                    title: "Notificación marcada como enviada",
                                });

                                notificationsState.reload();

                            }}
                        >
                            Marcar enviada
                        </LoaderButton>

                    )}

                </div>
            ),
        },
    ], [notificationsState]);

    const generateAgenda = async () => {

        await notificationService.generateAgenda();

        showToast({
            title: "Agenda diaria generada",
        });

        notificationsState.reload();

    };

    return (

        <PageContainer>

            <PageHeader
                title="Notificaciones"
                description="Agenda diaria y recordatorios"
            />

            <div className="grid gap-6 xl:grid-cols-[1fr_360px]">

                <div className="space-y-4">

                    <Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="max-w-xs"
                    >
                        <option value="all">Todas</option>
                        <option value="pending">Pendientes</option>
                        <option value="sent">Enviadas</option>
                    </Select>

                    {notificationsState.isLoading && (
                        <Loader label="Cargando notificaciones..." />
                    )}

                    {notificationsState.error && (
                        <ErrorState
                            title="No se pudieron cargar las notificaciones"
                            onRetry={notificationsState.reload}
                        />
                    )}

                    {!notificationsState.isLoading &&
                        !notificationsState.error && (

                            <DataTable
                                columns={columns}
                                data={notificationsState.data ?? []}
                                emptyMessage="No existen notificaciones"
                            />

                        )}

                </div>

                <Card hover={false}>

                    <CardHeader>

                        <CardTitle>
                            Agenda del establecimiento
                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        <div className="space-y-3">

                            <p>

                                <strong>Destino:</strong>

                                <br />

                                +51 983739689

                            </p>

                            <LoaderButton
                                className="w-full"
                                onClick={generateAgenda}
                            >
                                Generar agenda del día
                            </LoaderButton>

                            <p className="text-sm text-slate-500">

                                Se generarán automáticamente las citas
                                pendientes del día para el encargado del
                                establecimiento.

                            </p>

                        </div>

                    </CardContent>

                </Card>

            </div>

        </PageContainer>

    );

}