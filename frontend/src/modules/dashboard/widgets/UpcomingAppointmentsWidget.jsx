import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import DataTable from "../../../components/ui/DataTable";
import StatusBadge from "../../../components/ui/StatusBadge";
import { formatDate, formatTime } from "../../../utils/formatDate";

export default function UpcomingAppointmentsWidget({ appointments }) {
  const columns = [
    {
      key: "pet",
      header: "Mascota",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.pet}</p>
          <p className="text-xs text-slate-500">{row.client}</p>
        </div>
      ),
    },
    {
      key: "service",
      header: "Servicio",
    },
    {
      key: "date",
      header: "Fecha",
      render: (row) => `${formatDate(row.date)} - ${formatTime(row.date)}`,
    },
    {
      key: "status",
      header: "Estado",
      render: (row) => <StatusBadge variant={row.variant}>{row.status}</StatusBadge>,
    },
  ];

  return (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Proximas citas</CardTitle>
      </CardHeader>

      <CardContent>
        <DataTable
          columns={columns}
          data={appointments}
          emptyMessage="No hay citas programadas"
        />
      </CardContent>
    </Card>
  );
}
