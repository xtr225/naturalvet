import {
  FiHome,
  FiUsers,
  FiHeart,
  FiCalendar,
  FiFileText,
  FiPackage,
  FiCreditCard,
  FiUserCheck,
  FiBarChart2,
  FiBell,
} from "react-icons/fi";

export const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: FiHome,
    permissions: ["dashboard:view"],
  },
  {
    title: "Clientes",
    path: "/clientes",
    icon: FiUsers,
    permissions: ["clients:manage"],
  },
  {
    title: "Mascotas",
    path: "/mascotas",
    icon: FiHeart,
    permissions: ["pets:manage"],
  },
  {
    title: "Citas",
    path: "/citas",
    icon: FiCalendar,
    permissions: ["appointments:manage"],
  },
  {
    title: "Historia Clínica",
    path: "/historia-clinica",
    icon: FiFileText,
    permissions: ["medical-records:manage"],
  },
  {
    title: "Inventario",
    path: "/inventario",
    icon: FiPackage,
    permissions: ["inventory:manage"],
  },
  {
    title: "Pagos",
    path: "/pagos",
    icon: FiCreditCard,
    permissions: ["payments:manage"],
  },
  {
    title: "Notificaciones",
    path: "/notificaciones",
    icon: FiBell,
    permissions: ["appointments:manage"],
  },
  {
    title: "Usuarios",
    path: "/usuarios",
    icon: FiUserCheck,
    roles: ["admin"],
    permissions: ["users:manage"],
  },
  {
    title: "Reportes",
    path: "/reportes",
    icon: FiBarChart2,
    permissions: ["reports:view"],
  },
];