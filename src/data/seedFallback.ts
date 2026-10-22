// Phase 1 fallback (NOT used in the live render path since Phase 2).
// Kept so the app can be run offline / without Supabase by importing these
// accessors in place of the hooks in src/lib/companyApi.ts.
import { SEED_COMPANIES } from "@/data/seedCompanies";
import { getSkillTopics } from "@/data/skillTopics";
import {
  normalizeCompanyProfile,
  normalizeCompanySummary,
  normalizeDashboardSkills,
  type CompanyProfile,
  type CompanySummary,
  type DashboardSkill,
} from "@/lib/companyData";

export function loadCompanySummaries(): CompanySummary[] {
  return SEED_COMPANIES.map((c) => normalizeCompanySummary(c.short_json, c.company_id));
}

export function loadCompanyProfile(companyId: number): CompanyProfile | null {
  const row = SEED_COMPANIES.find((c) => c.company_id === companyId);
  return row ? normalizeCompanyProfile(row.full_json, row.short_json) : null;
}

export function loadCompanySkills(companyId: number): DashboardSkill[] {
  const row = SEED_COMPANIES.find((c) => c.company_id === companyId);
  if (!row) return [];
  const topics: Record<number, string[]> = {};
  for (const s of row.skill_levels) topics[s.skill_set_id] = getSkillTopics(s.skill_set_id);
  return normalizeDashboardSkills(row.skill_levels, topics);
}
