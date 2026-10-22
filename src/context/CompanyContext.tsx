import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SELECTED_COMPANY_KEY } from "@/lib/constants";
import type { CompanySummary } from "@/lib/companyData";

export interface SelectedCompany {
  companyId: number;
  companyName: string;
  logoUrl: string;
}

interface CompanyContextValue {
  selected: SelectedCompany | null;
  selectCompany: (company: CompanySummary) => void;
  clearCompany: () => void;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

/** Read localStorage. Detail data is fetched by id via React Query, so no lookup here. Never throws. */
function restoreSelected(): SelectedCompany | null {
  try {
    const raw = localStorage.getItem(SELECTED_COMPANY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SelectedCompany>;
    const companyId = Number(parsed.companyId);
    if (!Number.isFinite(companyId) || companyId <= 0) return null;
    return {
      companyId,
      companyName: typeof parsed.companyName === "string" ? parsed.companyName : "",
      logoUrl: typeof parsed.logoUrl === "string" ? parsed.logoUrl : "",
    };
  } catch {
    return null;
  }
}

function persistSelected(value: SelectedCompany | null) {
  try {
    if (value) localStorage.setItem(SELECTED_COMPANY_KEY, JSON.stringify(value));
    else localStorage.removeItem(SELECTED_COMPANY_KEY);
  } catch {
    /* storage unavailable: context state still works for this session */
  }
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  // Lazy initializer so a refresh on /company/* has the selection on first render.
  const [selected, setSelected] = useState<SelectedCompany | null>(restoreSelected);

  const selectCompany = useCallback((c: CompanySummary) => {
    const next: SelectedCompany = { companyId: c.id, companyName: c.name, logoUrl: c.logoUrl };
    persistSelected(next); // write localStorage synchronously, before any navigation
    setSelected(next);
  }, []);

  const clearCompany = useCallback(() => {
    persistSelected(null);
    setSelected(null);
  }, []);

  const value = useMemo(() => ({ selected, selectCompany, clearCompany }), [selected, selectCompany, clearCompany]);

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany(): CompanyContextValue {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used inside <CompanyProvider>");
  return ctx;
}

/** Route guard for /company/*: no selection → back to "/". Never renders NotFound. */
export function useRequireCompany() {
  const ctx = useCompany();
  const navigate = useNavigate();
  useEffect(() => {
    if (!ctx.selected) navigate("/", { replace: true });
  }, [ctx.selected, navigate]);
  return ctx;
}
