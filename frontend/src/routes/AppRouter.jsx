import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../layouts/App/DashboardLayout";
import Login from "../modules/auth/pages/Login";
import Dashboard from "../modules/dashboard/pages/Dashboard";
import ClienteList from "../modules/clientes/pages/ClienteList";
import ClienteCreate from "../modules/clientes/pages/ClienteCreate";
import ClienteDetail from "../modules/clientes/pages/ClienteDetail";
import ClienteEdit from "../modules/clientes/pages/ClienteEdit";
import MascotaDetail from "../modules/mascotas/pages/MascotaDetail";
import MascotaForm from "../modules/mascotas/pages/MascotaForm";
import MascotaList from "../modules/mascotas/pages/MascotaList";
import CitaForm from "../modules/citas/pages/CitaForm";
import CitaList from "../modules/citas/pages/CitaList";
import HistoriaClinicaCreate from "../modules/historia-clinica/pages/HistoriaClinicaCreate";
import HistoriaClinicaDetail from "../modules/historia-clinica/pages/HistoriaClinicaDetail";
import HistoriaClinicaList from "../modules/historia-clinica/pages/HistoriaClinicaList";
import InventarioPage from "../modules/inventario/pages/InventarioPage";
import PagosPage from "../modules/pagos/pages/PagosPage";
import UsuariosPage from "../modules/usuarios/pages/UsuariosPage";
import ReportesPage from "../modules/reportes/pages/ReportesPage";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import NotificacionesPage from "../modules/notificaciones/pages/NotificacionesPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<ClienteList />} />
          <Route path="/clientes/nuevo" element={<ClienteCreate />} />
          <Route path="/clientes/:id" element={<ClienteDetail />} />
          <Route path="/clientes/:id/editar" element={<ClienteEdit />} />
          <Route path="/mascotas" element={<MascotaList />} />
          <Route path="/mascotas/nuevo" element={<MascotaForm />} />
          <Route path="/mascotas/:id" element={<MascotaDetail />} />
          <Route path="/mascotas/:id/editar" element={<MascotaForm mode="edit" />} />
          <Route path="/citas" element={<CitaList />} />
          <Route path="/citas/nueva" element={<CitaForm />} />
          <Route path="/citas/:id/editar" element={<CitaForm mode="edit" />} />
          <Route path="/historia-clinica" element={<HistoriaClinicaList />} />
          <Route path="/historia-clinica/nueva" element={<HistoriaClinicaCreate />} />
          <Route path="/historia-clinica/:id" element={<HistoriaClinicaDetail />} />
          <Route path="/inventario" element={<InventarioPage />} />
          <Route path="/pagos" element={<PagosPage />} />
          <Route path="/notificaciones" element={<NotificacionesPage />} />
          
          <Route
            element={
              <PrivateRoute
                roles={["admin"]}
                permissions={["users:manage"]}
              />
            }
          >
            <Route path="/usuarios" element={<UsuariosPage />} />
          </Route>

          <Route
            element={<PrivateRoute permissions={["reports:view"]} />}
          >
            <Route path="/reportes" element={<ReportesPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
