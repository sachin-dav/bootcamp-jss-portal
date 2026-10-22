// Pure normalizers. Inputs are the raw JSON shapes (short_json / full_json /
// skill_levels) so Phase 2 can pipe Supabase rows in untouched.

// ---------- Types ----------
export type CompanyCategory = "Super Dream" | "Dream" | "Standard" | "Regular";
export type BloomCode = "CU" | "AP" | "AS" | "EV" | "CR";
export type Criticality = "Critical" | "Important" | "Baseline";
export type Difficulty = "EXPERT" | "ADVANCED" | "PRO" | "BEGINNER";

export interface CompanySummary {
  id: number;
  name: string;
  shortName: string;
  logoUrl: string;
  companyType: CompanyCategory;
  hq: string;
  size: string;
  yoyGrowth: string;
  websiteUrl: string;
}

/** Every normalized profile field is a string; known keys are listed for typing. */
export interface CompanyProfile {
  [key: string]: string;
}

export interface DashboardSkill {
  id: number;
  name: string;
  score: number;
  requiredProficiency: string;
  bloom: BloomCode;
  criticality: Criticality;
  difficulty: Difficulty;
  topics: string[];
}

// ---------- Helpers ----------
export function asString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(asString).filter(Boolean).join("; ");
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

export function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      /* not JSON */
    }
  }
  return {};
}

/** Split on newlines, periods followed by space, semicolons and bullets. */
export function splitItems(text: string): string[] {
  return text
    .split(/\r?\n|;|•|·|\.\s+|\.$/)
    .map((s) => s.replace(/^[\s\-–*]+/, "").trim())
    .filter(Boolean);
}

export function titleCaseFromCode(code: string): string {
  return code
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function scoreToDifficulty(score: number): Difficulty {
  if (score >= 8) return "EXPERT";
  if (score >= 6) return "ADVANCED";
  if (score >= 4) return "PRO";
  return "BEGINNER";
}

export function proficiencyToBloom(score: number): BloomCode {
  if (score <= 2) return "CU";
  if (score <= 4) return "AP";
  if (score <= 6) return "AS";
  if (score <= 8) return "EV";
  return "CR";
}

export function scoreToCriticality(score: number): Criticality {
  if (score >= 7) return "Critical";
  if (score >= 5) return "Important";
  return "Baseline";
}

const NULLISH = new Set(["", "na", "n/a", "none", "-", "null", "undefined", "not available"]);
export function isNullish(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  return NULLISH.has(asString(value).toLowerCase());
}

// Fields that must never be surfaced anywhere in the platform.
const FORBIDDEN_KEY = /(^|_)(ctc|stipend|selection_ratio)(_|$)/i;

const CATEGORY_MAP: Record<string, CompanyCategory> = {
  "super dream": "Super Dream",
  superdream: "Super Dream",
  super_dream: "Super Dream",
  dream: "Dream",
  standard: "Standard",
  regular: "Regular",
};

export function normalizeCategory(value: unknown): CompanyCategory {
  const key = asString(value).toLowerCase();
  return CATEGORY_MAP[key] ?? "Regular";
}

// ---------- Normalizers ----------
export function normalizeCompanySummary(
  shortJson: unknown,
  companyId: number = 0,
): CompanySummary {
  const s = asRecord(shortJson);
  const name = asString(s.name) || asString(s.short_name) || "Unknown company";
  return {
    id: companyId,
    name,
    shortName: asString(s.short_name) || name,
    logoUrl: asString(s.logo_url),
    companyType: normalizeCategory(s.company_type),
    hq: asString(s.headquarters_address),
    size: asString(s.employee_size),
    yoyGrowth: asString(s.yoy_growth_rate),
    websiteUrl: asString(s.website_url),
  };
}

export function normalizeCompanyProfile(fullJson: unknown, shortJson: unknown): CompanyProfile {
  const full = asRecord(fullJson);
  const short = asRecord(shortJson);
  const out: CompanyProfile = {};
  // short_json fills gaps; full_json wins.
  for (const src of [short, full]) {
    for (const [key, raw] of Object.entries(src)) {
      if (FORBIDDEN_KEY.test(key)) continue;
      const str = asString(raw);
      if (str !== "" || !(key in out)) out[key] = str;
    }
  }
  return out;
}

/**
 * @param topicsBySkill optional 10-level topic ladders keyed by skill_set_id
 *   (Phase 2: assembled from public.skill_set_topics; Phase 1 fallback: skillTopics.ts).
 */
export function normalizeDashboardSkills(
  skillLevels: unknown,
  topicsBySkill: Record<number, string[]> = {},
): DashboardSkill[] {
  const list = Array.isArray(skillLevels) ? skillLevels : [];
  return list
    .map((raw) => {
      const r = asRecord(raw);
      const score = Math.max(0, Math.min(10, Number(r.required_level) || 0));
      const id = Number(r.skill_set_id) || 0;
      return {
        id,
        name: asString(r.skill_set_name) || "Unnamed skill",
        score,
        requiredProficiency: titleCaseFromCode(asString(r.required_proficiency)),
        bloom: proficiencyToBloom(score),
        criticality: scoreToCriticality(score),
        difficulty: scoreToDifficulty(score),
        topics: topicsBySkill[id] ?? [],
      } satisfies DashboardSkill;
    })
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}
