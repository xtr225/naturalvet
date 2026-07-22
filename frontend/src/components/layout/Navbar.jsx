import { FiBell, FiLogOut, FiMenu, FiSearch, FiSidebar } from "react-icons/fi";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import { cn } from "../../utils/cn";

export default function Navbar({
  isSidebarCollapsed,
  onLogout,
  onToggleSidebar,
  onToggleMobileSidebar,
  user,
}) {
  const displayName = user?.name ?? "Equipo Veterinario";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-[rgb(126_139_93_/_0.14)] bg-white/85 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Abrir menu"
            onClick={onToggleMobileSidebar}
          >
            <FiMenu size={20} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            aria-label={isSidebarCollapsed ? "Expandir menu" : "Colapsar menu"}
            onClick={onToggleSidebar}
          >
            <FiSidebar
              size={20}
              className={cn(
                "transition-transform duration-200",
                isSidebarCollapsed && "rotate-180"
              )}
            />
          </Button>

          <div className="hidden min-w-0 items-center gap-2 rounded-xl border border-[rgb(126_139_93_/_0.16)] bg-[color:var(--color-background)] px-3 py-2 text-sm text-slate-500 md:flex md:w-80">
            <FiSearch size={16} />
            <span className="truncate">Buscar clientes, mascotas o citas</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <IconButton
            icon={FiBell}
            label="Notificaciones"
            variant="ghost"
          />

          <div className="flex items-center gap-3 rounded-xl border border-[rgb(126_139_93_/_0.16)] bg-white px-2 py-1.5">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">{displayName}</p>
              <p className="text-xs text-slate-500">Sesion activa</p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--color-primary)] text-sm font-semibold text-white">
              {initials}
            </div>
          </div>

          <IconButton
            icon={FiLogOut}
            label="Cerrar sesion"
            variant="ghost"
            onClick={onLogout}
          />
        </div>
      </div>
    </header>
  );
}
