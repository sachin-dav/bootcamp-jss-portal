import { memo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Lock } from "lucide-react";
import { CompanyLogo } from "@/components/CompanyLogo";
import { ErrorState, PageSkeleton } from "@/components/QueryState";
import { useRequireCompany } from "@/context/CompanyContext";
import { useCompanyProfile, useCompanySkills } from "@/lib/companyApi";
import {
  BLOOM_COLORS,
  BLOOM_LABELS,
  CRITICALITY_COLORS,
  CRITICALITY_DESCRIPTIONS,
} from "@/lib/constants";
import {
  proficiencyToBloom,
  type BloomCode,
  type Criticality,
  type DashboardSkill,
} from "@/lib/companyData";
import { cn } from "@/lib/utils";

const BLOOM_ORDER: BloomCode[] = ["CU", "AP", "AS", "EV", "CR"];
const CRITICALITY_ORDER: Criticality[] = ["Critical", "Important", "Baseline"];

function BloomBadge({ code }: { code: BloomCode }) {
  const color = BLOOM_COLORS[code];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold"
      style={{ backgroundColor: `${color}22`, color }}
    >
      {code}
    </span>
  );
}

const SkillCard = memo(function SkillCard({ skill }: { skill: DashboardSkill }) {
  const [open, setOpen] = useState(false);
  const bloomColor = BLOOM_COLORS[skill.bloom];
  const critColor = CRITICALITY_COLORS[skill.criticality];
  const panelId = `roadmap-${skill.id}`;

  return (
    <article className="rounded-xl border border-border bg-white">
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-[#0F172A]">{skill.name}</h3>
          <div className="flex shrink-0 items-center gap-2">
            <BloomBadge code={skill.bloom} />
            <span className="text-sm font-semibold tabular-nums text-slate-700">{skill.score}/10</span>
          </div>
        </div>

        <div
          className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuenow={skill.score}
          aria-valuemin={0}
          aria-valuemax={10}
          aria-label={`${skill.name} target score`}
        >
          <div className="h-full rounded-full" style={{ width: `${skill.score * 10}%`, backgroundColor: bloomColor }} />
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: critColor }}>
            {skill.criticality}
          </span>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={panelId}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-[#2563EB] hover:bg-[#EFF6FF]"
          >
            {open ? "Hide roadmap" : "View roadmap"}
            <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} aria-hidden />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ol className="border-t border-slate-100 px-4 py-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => {
                const topic = skill.topics[level - 1] ?? "";
                const locked = level > skill.score;
                const color = BLOOM_COLORS[proficiencyToBloom(level)];
                return (
                  <li
                    key={level}
                    className={cn("flex items-start gap-3 py-2", locked && "opacity-60")}
                    data-locked={locked}
                  >
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{ backgroundColor: `${color}22`, color }}
                    >
                      {level}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-700">{topic || "Topic not available"}</p>
                      {locked && (
                        <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                          <Lock className="h-3 w-3" aria-hidden /> Beyond scope
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
});

export default function SkillIntelligence() {
  const { selected } = useRequireCompany();
  const detail = useCompanyProfile(selected?.companyId);
  const skillsQ = useCompanySkills(selected?.companyId);
  const company = detail.data?.summary ?? null;
  const skills = skillsQ.data ?? [];

  if (!selected) return null;
  if (detail.isLoading || skillsQ.isLoading) return <PageSkeleton rows={4} />;
  if (detail.isError || !company) {
    const e = detail.error;
    return <ErrorState message={e instanceof Error ? e.message : undefined} onRetry={() => detail.refetch()} />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-3 py-4 sm:px-4 sm:py-6">
      <header className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
        <CompanyLogo name={company.name} logoUrl={company.logoUrl} websiteUrl={company.websiteUrl} />
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold text-[#0F172A]">{company.shortName} Skill Intelligence</h1>
          <p className="text-sm text-muted-foreground">
            Target skill levels recruiters expect, with a 10-level preparation roadmap per skill
          </p>
        </div>
      </header>

      <section aria-label="Bloom level legend">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Bloom levels</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {BLOOM_ORDER.map((code) => {
            const color = BLOOM_COLORS[code];
            return (
              <div
                key={code}
                className="rounded-lg border p-3"
                style={{ backgroundColor: `${color}14`, borderColor: `${color}40` }}
              >
                <p className="text-sm font-bold" style={{ color }}>
                  {code}
                </p>
                <p className="text-xs text-slate-600">{BLOOM_LABELS[code]}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section aria-label="Criticality legend">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Criticality</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {CRITICALITY_ORDER.map((c) => (
            <div key={c} className="rounded-lg border border-border bg-white p-3">
              <p className="text-sm font-semibold" style={{ color: CRITICALITY_COLORS[c] }}>
                {c}
              </p>
              <p className="text-xs text-slate-600">{CRITICALITY_DESCRIPTIONS[c]}</p>
            </div>
          ))}
        </div>
      </section>

      {skillsQ.isError ? (
        <ErrorState
          message={skillsQ.error instanceof Error ? skillsQ.error.message : undefined}
          onRetry={() => skillsQ.refetch()}
          showHome={false}
        />
      ) : skills.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No skill requirements are available for this company yet.
        </p>
      ) : (
        <section aria-label="Skills" className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {skills.map((s) => (
            <SkillCard key={s.id} skill={s} />
          ))}
        </section>
      )}
    </div>
  );
}
