import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../components/feedback/Loader";
import { useAuth } from "../hooks/useAuth";
import { canAccessRoute } from "../utils/permissions";

export default function PrivateRoute({ roles = [], permissions = [] }) {
  const location = useLocation();
  const auth = useAuth();

  if (auth.isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <Loader label="Validando sesion" />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!canAccessRoute({ roles, permissions }, auth)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
