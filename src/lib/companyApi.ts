// Phase 2 data-access layer. Read-only.
// Company data: ONLY public.company_json (short_json / full_json), no joins.
// Skills: public.company_skill_levels, skill_set_master, proficiency_levels, skill_set_topics.

import { useQuery } from "@tanstack/react-query";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import {
  asRecord,
  asString,
  normalizeCompanyProfile,
  normalizeCompanySummary,
  normalizeDashboardSkills,
  type CompanyProfile,
  type CompanySummary,
  type DashboardSkill,
} from "@/lib/companyData";

function assertConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.");
  }
}

export interface CompanyDetail {
  summary: CompanySummary;
  profile: CompanyProfile;
}

// ---------- Companies (cards) ----------
export async function fetchCompanies(): Promise<CompanySummary[]> {
  assertConfigured();
  const { data, error } = await supabase.from("company_json").select("company_id, short_json").order("company_id");
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeCompanySummary(row.short_json, Number(row.company_id)));
}

export function useCompanies() {
  return useQuery({ queryKey: ["companies"], queryFn: fetchCompanies });
}

// ---------- Company detail (22 sections) ----------
export async function fetchCompanyDetail(id: number): Promise<CompanyDetail> {
  assertConfigured();
  const { data, error } = await supabase
    .from("company_json")
    .select("company_id, short_json, full_json")
    .eq("company_id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error(`Company ${id} was not found.`);
  return {
    summary: normalizeCompanySummary(data.short_json, Number(data.company_id)),
    profile: normalizeCompanyProfile(data.full_json, data.short_json),
  };
}

export function useCompanyProfile(id: number | null | undefined) {
  return useQuery({
    queryKey: ["company-profile", id],
    queryFn: () => fetchCompanyDetail(id as number),
    enabled: typeof id === "number" && Number.isFinite(id),
  });
}

// ---------- Skills ----------
export async function fetchCompanySkills(id: number): Promise<DashboardSkill[]> {
  assertConfigured();

  const levelsRes = await supabase
    .from("company_skill_levels")
    .select("skill_set_id, required_level, required_proficiency_level_id")
    .eq("company_id", id);
  if (levelsRes.error) throw new Error(levelsRes.error.message);
  const levels = levelsRes.data ?? [];
  if (levels.length === 0) return [];

  const skillIds = Array.from(new Set(levels.map((l) => Number(l.skill_set_id))));

  const [masterRes, profRes, topicsRes] = await Promise.all([
    supabase.from("skill_set_master").select("skill_set_id, skill_set_name, short_name").in("skill_set_id", skillIds),
    supabase.from("proficiency_levels").select("proficiency_level_id, proficiency_name, proficiency_code"),
    supabase
      .from("skill_set_topics")
      .select("skill_set_id, level_number, topics")
      .in("skill_set_id", skillIds)
      .order("level_number"),
  ]);
  for (const r of [masterRes, profRes, topicsRes]) if (r.error) throw new Error(r.error.message);

  const nameById = new Map<number, string>();
  for (const m of masterRes.data ?? []) {
    nameById.set(Number(m.skill_set_id), asString(m.skill_set_name) || asString(m.short_name));
  }
  const profById = new Map<number, string>();
  for (const p of profRes.data ?? []) {
    profById.set(Number(p.proficiency_level_id), asString(p.proficiency_name) || asString(p.proficiency_code));
  }

  // 10-level ladders: index = level_number - 1; duplicate rows for a level are joined.
  const topicsBySkill: Record<number, string[]> = {};
  for (const t of topicsRes.data ?? []) {
    const sid = Number(t.skill_set_id);
    const lvl = Number(t.level_number);
    if (!Number.isInteger(lvl) || lvl < 1 || lvl > 10) continue;
    const ladder = (topicsBySkill[sid] ??= Array.from({ length: 10 }, () => ""));
    const text = asString(t.topics);
    ladder[lvl - 1] = ladder[lvl - 1] ? `${ladder[lvl - 1]}; ${text}` : text;
  }

  // Same raw shape the seed's `skill_levels` used, so the existing normalizer is reused as-is.
  const skillLevels = levels.map((l) => ({
    skill_set_id: Number(l.skill_set_id),
    skill_set_name: nameById.get(Number(l.skill_set_id)) ?? "",
    required_level: l.required_level,
    required_proficiency: profById.get(Number(l.required_proficiency_level_id)) ?? "",
  }));

  return normalizeDashboardSkills(skillLevels.map(asRecord), topicsBySkill);
}

export function useCompanySkills(id: number | null | undefined) {
  return useQuery({
    queryKey: ["company-skills", id],
    queryFn: () => fetchCompanySkills(id as number),
    enabled: typeof id === "number" && Number.isFinite(id),
  });
}
