import { NavLink } from "react-router-dom";
import { Building2, Gauge, LayoutGrid } from "lucide-react";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { COLLEGE_SHORT } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/company/intelligence", label: "Company Intelligence", icon: Building2 },
  { to: "/company/skills", label: "Skill Intelligence", icon: Gauge },
];

function SidebarLink({
  to,
  label,
  icon: Icon,
  iconOnly,
  onNavigate,
  end,
}: {
  to: string;
  label: string;
  icon: typeof Building2;
  iconOnly: boolean;
  onNavigate: () => void;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      title={iconOnly ? label : undefined}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
          iconOnly && "justify-center px-0",
          isActive ? "bg-[#EFF6FF] text-[#2563EB]" : "text-[#334155] hover:bg-white",
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden />
      {!iconOnly && <span className="truncate">{label}</span>}
    </NavLink>
  );
}

export function AppSidebar() {
  const { collapsed, isMobile, closeMobile } = useSidebar();
  const iconOnly = collapsed && !isMobile;

  return (
    <Sidebar>
      <div className={cn("flex h-14 items-center border-b border-[#E5E7EB] px-4", iconOnly && "justify-center px-0")}>
        <span className="font-heading text-base font-semibold text-[#0F172A]">
          {iconOnly ? COLLEGE_SHORT.charAt(0) : COLLEGE_SHORT}
        </span>
        {!iconOnly && <span className="ml-2 text-xs text-[#64748B]">Placement Hub</span>}
      </div>

      <nav className="flex-1 space-y-1 p-2" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <SidebarLink key={item.to} {...item} iconOnly={iconOnly} onNavigate={closeMobile} />
        ))}
      </nav>

      <div className="border-t border-[#E5E7EB] p-2">
        <SidebarLink
          to="/"
          end
          label="All Companies"
          icon={LayoutGrid}
          iconOnly={iconOnly}
          onNavigate={closeMobile}
        />
      </div>
    </Sidebar>
  );
}
