import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../branding/Logo";
import { menuItems } from "../../routes/menu";
import { canAccessMenuItem } from "../../utils/permissions";
import { cn } from "../../utils/cn";

const Sidebar = ({
  isCollapsed = false,
  isMobileOpen = false,
  onNavigate,
  user,
}) => {
  const visibleItems = menuItems.filter((item) => canAccessMenuItem(item, user));

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 84 : 272 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="fixed inset-y-0 left-0 z-40 hidden border-r border-[rgb(255_255_255_/_0.10)] bg-[color:var(--color-primary)] text-white lg:flex lg:flex-col"
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          items={visibleItems}
          onNavigate={onNavigate}
        />
      </motion.aside>

      <motion.div
        initial={false}
        animate={{ opacity: isMobileOpen ? 1 : 0 }}
        className={cn(
          "fixed inset-0 z-40 bg-[rgb(39_51_31_/_0.55)] backdrop-blur-sm lg:hidden",
          !isMobileOpen && "pointer-events-none"
        )}
        onClick={onNavigate}
      />

      <motion.aside
        initial={false}
        animate={{ x: isMobileOpen ? 0 : -288 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="fixed inset-y-0 left-0 z-50 w-72 border-r border-[rgb(255_255_255_/_0.10)] bg-[color:var(--color-primary)] text-white lg:hidden"
      >
        <SidebarContent
          items={visibleItems}
          onNavigate={onNavigate}
        />
      </motion.aside>
    </>
  );
};

function SidebarContent({ isCollapsed = false, items, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-4">
        <Logo
          size="small"
          className={cn(
            "text-white [&_p:nth-child(2)]:text-white/70",
            isCollapsed && "[&_div:last-child]:hidden"
          )}
        />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/78 transition-all duration-200 hover:bg-white/10 hover:text-white",
                  isActive && "bg-[color:var(--color-secondary)] text-white shadow-lg shadow-[rgb(83_97_59_/_0.28)]",
                  isCollapsed && "justify-center px-0"
                )
              }
              title={isCollapsed ? item.title : undefined}
            >
              <Icon className="shrink-0" size={20} />

              {!isCollapsed && <span className="truncate">{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div
          className={cn(
            "rounded-xl bg-white/10 px-3 py-3",
            isCollapsed && "px-2"
          )}
        >
          <p className="text-xs font-medium text-white">
            {isCollapsed ? "NV" : "Puno - Perú"}
          </p>

          {!isCollapsed && (
            <p className="mt-1 text-xs leading-5 text-white/60">
              Clínica veterinaria con gestión integral.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
