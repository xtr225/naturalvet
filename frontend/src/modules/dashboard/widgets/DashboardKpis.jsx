import {
  FiUsers,
  FiHeart,
  FiCalendar,
  FiPackage,
} from "react-icons/fi";
import StatCard from "../../../components/cards/StatCard";

export default function DashboardKpis({ stats }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Clientes" value={stats.clients} icon={FiUsers} />
      <StatCard
        title="Mascotas"
        value={stats.pets}
        icon={FiHeart}
        color="emerald"
      />
      <StatCard
        title="Citas"
        value={stats.appointments}
        icon={FiCalendar}
        color="amber"
      />
      <StatCard
        title="Inventario"
        value={stats.inventory}
        icon={FiPackage}
        color="violet"
      />
    </div>
  );
}
