import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Globe, Linkedin } from "lucide-react";
import { CompanyLogo } from "@/components/CompanyLogo";
import { NotAvailablePill, renderValue } from "@/components/FieldValue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ErrorState, PageSkeleton } from "@/components/QueryState";
import { useRequireCompany } from "@/context/CompanyContext";
import { useCompanyProfile } from "@/lib/companyApi";
import { buildIntelligenceSections, type IntelligenceField, type IntelligenceSection } from "@/data/intelligenceData";
import { isNullish } from "@/lib/companyData";
import { cn } from "@/lib/utils";

// Offset = layout header (3rem) + info bar (3.5rem) + tab bar (2.75rem) + breathing room.
const SCROLL_OFFSET = 168;

const FieldRow = memo(function FieldRow({ field }: { field: IntelligenceField }) {
  return (
    <div className="flex flex-col gap-1 border-t border-slate-100 px-4 py-3 first:border-t-0 sm:flex-row sm:gap-4">
      <dt className="text-sm font-medium text-slate-500 sm:w-1/3">{field.label}</dt>
      <dd className="min-w-0 sm:w-2/3">{renderValue(field)}</dd>
    </div>
  );
});

const SectionCard = memo(function SectionCard({ section, index }: { section: IntelligenceSection; index: number }) {
  const Icon = section.icon;
  const populated = section.fields.filter((f) => !isNullish(f.value)).length;
  return (
    <section
      id={`section-${index}`}
      data-section-index={index}
      className="scroll-mt-40 rounded-xl border border-border bg-white"
      aria-labelledby={`section-title-${index}`}
    >
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <h2 id={`section-title-${index}`} className="flex-1 text-lg font-semibold text-[#0F172A]">
          {section.title}
        </h2>
        <Badge variant="muted" title="Populated fields">
          {populated}/{section.fields.length}
        </Badge>
      </div>
      <dl>
        {section.fields.map((f) => (
          <FieldRow key={f.key} field={f} />
        ))}
      </dl>
    </section>
  );
});

export default function CompanyIntelligence() {
  const { selected } = useRequireCompany();
  const { data, isLoading, isError, error, refetch } = useCompanyProfile(selected?.companyId);
  const company = data?.summary ?? null;
  const profile = data?.profile ?? null;
  const sections = useMemo(() => buildIntelligenceSections(profile), [profile]);

  const [active, setActive] = useState(0);
  const isScrollingRef = useRef(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>();
  const tabBarRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Scroll-spy (guarded while a programmatic scroll is in flight).
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (isScrollingRef.current) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        let current = 0;
        for (let i = 0; i < sections.length; i++) {
          const el = document.getElementById(`section-${i}`);
          if (el && el.getBoundingClientRect().top <= SCROLL_OFFSET + 8) current = i;
        }
        setActive(current);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [sections.length]);

  // Keep the active tab centered in the tab bar.
  useEffect(() => {
    const bar = tabBarRef.current;
    const tab = tabRefs.current[active];
    if (!bar || !tab) return;
    bar.scrollTo({ left: tab.offsetLeft - bar.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  useEffect(() => () => clearTimeout(scrollTimer.current), []);

  const scrollToSection = useCallback((idx: number) => {
    const el = document.getElementById(`section-${idx}`);
    if (!el) return;
    isScrollingRef.current = true;
    setActive(idx);
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET + 8;
    window.scrollTo({ top, behavior: "smooth" });
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  }, []);

  if (!selected) return null;
  if (isLoading) return <PageSkeleton rows={5} />;
  if (isError || !company || !profile) {
    return <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={() => refetch()} />;
  }

  const website = profile.website_url || company.websiteUrl;
  const linkedin = profile.linkedin_url;
  const industry = profile.category;

  return (
    <div>
      {/* Sticky top information bar */}
      <div className="sticky top-12 z-30 flex h-14 items-center justify-between gap-3 border-b border-[#E5E7EB] bg-white px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <CompanyLogo
            name={company.name}
            logoUrl={company.logoUrl}
            websiteUrl={company.websiteUrl}
            className="h-9 w-9 rounded-md"
          />
          <h1 className="truncate text-base font-semibold text-[#0F172A] sm:text-lg">{company.name}</h1>
          {!isNullish(industry) && (
            <Badge variant="outline" className="hidden shrink-0 sm:inline-flex">
              {industry}
            </Badge>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!isNullish(website) && (
            <Button asChild variant="outline" size="sm">
              <a href={website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">Website</span>
                <span className="sr-only sm:hidden">Website</span>
              </a>
            </Button>
          )}
          {!isNullish(linkedin) && (
            <Button asChild variant="outline" size="sm">
              <a href={linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">LinkedIn</span>
                <span className="sr-only sm:hidden">LinkedIn</span>
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Sticky tab bar (22 tabs) */}
      <div
        ref={tabBarRef}
        role="tablist"
        aria-label="Intelligence sections"
        className="scrollbar-hide sticky top-[6.5rem] z-20 flex h-11 items-center gap-1 overflow-x-auto border-b border-[#E5E7EB] bg-white px-2 sm:px-3"
      >
        {sections.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => (tabRefs.current[i] = el)}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => scrollToSection(i)}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active === i ? "bg-[#EFF6FF] text-[#2563EB]" : "text-[#334155] hover:bg-secondary",
            )}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-5xl space-y-4 px-3 py-4 sm:px-4 sm:py-6">
        {sections.map((s, i) => (
          <SectionCard key={s.id} section={s} index={i} />
        ))}
        <p className="pt-2 text-center text-xs text-muted-foreground">
          Missing fields show <NotAvailablePill /> and are populated as the dataset grows.
          {website && !isNullish(website) && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-1 text-[#2563EB] hover:underline"
            >
              Visit official site <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          )}
        </p>
      </div>
    </div>
  );
}
