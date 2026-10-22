import { memo, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { CompanyCard } from "@/components/CompanyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompany } from "@/context/CompanyContext";
import { useDebounce } from "@/hooks/useDebounce";
import { CATEGORY_COLORS, COLLEGE_NAME, COLLEGE_SHORT, PORTAL_TITLE } from "@/lib/constants";
import { ErrorState } from "@/components/QueryState";
import { useCompanies } from "@/lib/companyApi";
import type { CompanyCategory, CompanySummary } from "@/lib/companyData";

type Filter = "All" | CompanyCategory;
const FILTERS: Filter[] = ["All", "Super Dream", "Dream", "Standard", "Regular"];

const CardSkeleton = memo(function CardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-white p-4">
      <div className="flex justify-between">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
});

export default function Index() {
  const navigate = useNavigate();
  const { selectCompany } = useCompany();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const debounced = useDebounce(search, 200);

  const { data, isLoading, isError, error, refetch } = useCompanies();
  const companies = useMemo(() => data ?? [], [data]);

  const searched = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter((c) =>
      [c.name, c.shortName, c.hq, c.companyType].some((f) => f.toLowerCase().includes(q)),
    );
  }, [companies, debounced]);

  const counts = useMemo(() => {
    const base: Record<Filter, number> = { All: searched.length, "Super Dream": 0, Dream: 0, Standard: 0, Regular: 0 };
    for (const c of searched) base[c.companyType] += 1;
    return base;
  }, [searched]);

  const visible = useMemo(
    () => (filter === "All" ? searched : searched.filter((c) => c.companyType === filter)),
    [searched, filter],
  );

  // 1) persist to localStorage + 2) update context (both inside selectCompany) 3) navigate
  const handleSelect = useCallback(
    (company: CompanySummary) => {
      selectCompany(company);
      navigate("/company/intelligence");
    },
    [selectCompany, navigate],
  );

  const reset = () => {
    setSearch("");
    setFilter("All");
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="container py-8 sm:py-12">
          <span className="inline-flex items-center rounded-full border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-1 text-xs font-semibold tracking-wider text-[#334155]">
            {COLLEGE_SHORT} · INTELLIGENCE PLATFORM
          </span>
          <p className="mt-4 font-heading text-sm font-medium text-[#64748B]">{COLLEGE_NAME}</p>
          <h1 className="mt-1 max-w-4xl text-3xl font-semibold leading-tight text-[#0F172A] sm:text-4xl">
            {PORTAL_TITLE}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">Your strategic edge for campus placements</p>

          <div className="relative mt-6 max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies by name, location or category"
              aria-label="Search companies"
              className="pl-9 pr-10"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:bg-secondary hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
          {FILTERS.map((f) => {
            const active = filter === f;
            const color = f === "All" ? "#0F172A" : CATEGORY_COLORS[f];
            return (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f)}
                className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors"
                style={
                  active
                    ? { backgroundColor: color, borderColor: color, color: "#fff" }
                    : { borderColor: `${color}55`, color }
                }
              >
                {f}
                <span
                  className="rounded-full px-1.5 text-xs"
                  style={active ? { backgroundColor: "rgba(255,255,255,0.25)" } : { backgroundColor: `${color}15` }}
                >
                  {counts[f]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }, (_, i) => <CardSkeleton key={i} />)
            : visible.map((c) => <CompanyCard key={c.id} company={c} onSelect={handleSelect} />)}
        </div>

        {isError && <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={() => refetch()} showHome={false} />}

        {!isLoading && !isError && visible.length === 0 && (
          <div className="mx-auto mt-10 max-w-sm rounded-xl border border-dashed border-border p-8 text-center">
            <p className="font-heading text-lg font-semibold">No companies found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search term or category.</p>
            <Button variant="outline" className="mt-4" onClick={reset}>
              Reset search and filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
