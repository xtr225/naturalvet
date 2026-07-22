import { useEffect, useMemo, useState } from "react";
import { LayoutContext } from "./LayoutContextStore";

const STORAGE_KEY = "vet-system-sidebar-collapsed";

export function LayoutProvider({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(STORAGE_KEY) === "true";
  });

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const value = useMemo(
    () => ({
      isSidebarCollapsed,
      isMobileSidebarOpen,
      closeMobileSidebar: () => setIsMobileSidebarOpen(false),
      toggleMobileSidebar: () => setIsMobileSidebarOpen((current) => !current),
      toggleSidebar: () => setIsSidebarCollapsed((current) => !current),
    }),
    [isMobileSidebarOpen, isSidebarCollapsed]
  );

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
}
