import { Link, Outlet, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useCompany } from "@/context/CompanyContext";

const PAGE_LABELS: Record<string, string> = {
  "/company/intelligence": "Company Intelligence",
  "/company/skills": "Skill Intelligence",
};

export default function AppLayout() {
  const { selected } = useCompany();
  const { pathname } = useLocation();
  const pageLabel = PAGE_LABELS[pathname] ?? "Company";

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-12 items-center gap-2 border-b border-[#E5E7EB] bg-white px-3 sm:px-4">
          <SidebarTrigger />
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              All Companies
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">{selected?.companyName ?? "Company"}</span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate font-medium text-foreground">{pageLabel}</span>
          </nav>
        </header>
        <main className="min-w-0 flex-1 bg-white">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
