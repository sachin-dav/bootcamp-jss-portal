import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useIsMobile";

interface SidebarCtx {
  isMobile: boolean;
  collapsed: boolean; // desktop icon-only mode
  mobileOpen: boolean;
  toggle: () => void;
  closeMobile: () => void;
}

const Ctx = createContext<SidebarCtx | null>(null);

export function useSidebar() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSidebar must be used within <SidebarProvider>");
  return c;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = useCallback(() => {
    if (isMobile) setMobileOpen((o) => !o);
    else setCollapsed((c) => !c);
  }, [isMobile]);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const value = useMemo(
    () => ({ isMobile, collapsed, mobileOpen, toggle, closeMobile }),
    [isMobile, collapsed, mobileOpen, toggle, closeMobile],
  );

  return (
    <Ctx.Provider value={value}>
      <div className="flex min-h-screen w-full bg-white">{children}</div>
    </Ctx.Provider>
  );
}

/** collapsible="icon": 16rem expanded, 3.5rem icon rail on desktop; drawer on mobile. */
export function Sidebar({ children }: { children: ReactNode }) {
  const { isMobile, collapsed, mobileOpen, closeMobile } = useSidebar();

  if (isMobile) {
    return (
      <>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-black/30" onClick={closeMobile} aria-hidden />
        )}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#E5E7EB] bg-[#F8FAFC] text-[#334155] transition-transform duration-200",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
          aria-label="Sidebar"
        >
          {children}
        </aside>
      </>
    );
  }

  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-[#E5E7EB] bg-[#F8FAFC] text-[#334155] transition-[width] duration-200 md:flex",
        collapsed ? "w-14" : "w-64",
      )}
      aria-label="Sidebar"
    >
      {children}
    </aside>
  );
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggle } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle sidebar"
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md text-[#334155] hover:bg-secondary",
        className,
      )}
    >
      <PanelLeft className="h-5 w-5" />
    </button>
  );
}
