import { Outlet } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { LayoutProvider } from "../../context/LayoutContext";
import { useAuth } from "../../hooks/useAuth";
import { useLayout } from "../../hooks/useLayout";
import { cn } from "../../utils/cn";

const DashboardShell = () => {
  const { user, logout } = useAuth();
  const {
    isSidebarCollapsed,
    isMobileSidebarOpen,
    closeMobileSidebar,
    toggleMobileSidebar,
    toggleSidebar,
  } = useLayout();

  return (
    <div className="min-h-screen bg-[color:var(--color-background)]">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onNavigate={closeMobileSidebar}
        user={user}
      />

      <div
        className={cn(
          "min-h-screen transition-[padding] duration-200 ease-out lg:pl-[272px]",
          isSidebarCollapsed && "lg:pl-[84px]"
        )}
      >
        <Navbar
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          onToggleMobileSidebar={toggleMobileSidebar}
          onLogout={logout}
          user={user}
        />

        <Outlet />
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <LayoutProvider>
      <DashboardShell />
    </LayoutProvider>
  );
};

export default DashboardLayout;
