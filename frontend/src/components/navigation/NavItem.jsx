import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

export default function NavItem({ to, icon: Icon, children, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white",
          isActive && "bg-blue-600 text-white",
          collapsed && "justify-center px-0"
        )
      }
    >
      {Icon && <Icon size={20} />}
      {!collapsed && <span className="truncate">{children}</span>}
    </NavLink>
  );
}
