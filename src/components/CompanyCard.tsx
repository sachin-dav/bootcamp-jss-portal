import { memo, type KeyboardEvent } from "react";
import { ArrowRight, MapPin, TrendingDown, TrendingUp, Users } from "lucide-react";
import { CompanyLogo } from "@/components/CompanyLogo";
import { CATEGORY_COLORS } from "@/lib/constants";
import { isNullish, type CompanySummary } from "@/lib/companyData";

interface CompanyCardProps {
  company: CompanySummary;
  onSelect: (company: CompanySummary) => void;
}

function NotAvailable() {
  return <span className="italic text-muted-foreground">not publicly available</span>;
}

function CompanyCardBase({ company, onSelect }: CompanyCardProps) {
  const color = CATEGORY_COLORS[company.companyType];
  const growthMissing = isNullish(company.yoyGrowth);
  const negative = company.yoyGrowth.trim().startsWith("-");
  const Trend = negative ? TrendingDown : TrendingUp;

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(company);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(company)}
      onKeyDown={handleKey}
      aria-label={`Open ${company.name} intelligence`}
      className="group relative flex cursor-pointer flex-col gap-3 rounded-xl border border-border bg-white p-4 transition-colors hover:border-[#2563EB]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <CompanyLogo name={company.name} logoUrl={company.logoUrl} websiteUrl={company.websiteUrl} />
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
          style={{ backgroundColor: color }}
        >
          {company.companyType}
        </span>
      </div>

      <div className="min-w-0">
        <h3 className="truncate font-heading text-base font-semibold text-foreground">{company.name}</h3>
        <p className="truncate text-sm text-muted-foreground">{company.shortName}</p>
      </div>

      <dl className="space-y-1.5 pb-5 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          <dd className="truncate">{isNullish(company.hq) ? <NotAvailable /> : company.hq}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          <dd className="truncate">{isNullish(company.size) ? <NotAvailable /> : company.size}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Trend
            className={`h-4 w-4 shrink-0 ${growthMissing ? "text-slate-400" : negative ? "text-red-600" : "text-green-600"}`}
            aria-hidden
          />
          <dd className={growthMissing ? "" : negative ? "text-red-600" : "text-green-600"}>
            {growthMissing ? <NotAvailable /> : `${company.yoyGrowth} YoY`}
          </dd>
        </div>
      </dl>

      <ArrowRight
        className="absolute bottom-4 right-4 h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#2563EB]"
        aria-hidden
      />
    </div>
  );
}

export const CompanyCard = memo(CompanyCardBase);
