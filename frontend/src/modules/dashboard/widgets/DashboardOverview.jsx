import DashboardKpis from "./DashboardKpis";
import InventoryAlertsWidget from "./InventoryAlertsWidget";
import OperationalSummaryWidget from "./OperationalSummaryWidget";
import RecentActivityWidget from "./RecentActivityWidget";
import UpcomingAppointmentsWidget from "./UpcomingAppointmentsWidget";

export default function DashboardOverview({ data }) {
  return (
    <div className="space-y-6">
      <DashboardKpis stats={data.stats} />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <UpcomingAppointmentsWidget appointments={data.appointments} />
        <InventoryAlertsWidget alerts={data.inventoryAlerts} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <OperationalSummaryWidget
          stats={data.stats}
          serviceMix={data.serviceMix}
        />
        <RecentActivityWidget items={data.activity} />
      </div>
    </div>
  );
}
