export const COLLEGE_NAME = "JSS Academy of Technical Education Noida";
export const COLLEGE_SHORT = "JSSATEN";
export const PORTAL_TITLE = `${COLLEGE_NAME} Companies Research & Placement Analytics Portal`;
export const PORTAL_ALIAS = `${COLLEGE_NAME} Placement Intelligence Hub`;

export const SELECTED_COMPANY_KEY = "selected-company";

import type { BloomCode, CompanyCategory, Criticality } from "@/lib/companyData";

export const CATEGORY_COLORS: Record<CompanyCategory, string> = {
  "Super Dream": "#7c3aed",
  Dream: "#2563eb",
  Standard: "#16a34a",
  Regular: "#d97706",
};

export const BLOOM_COLORS: Record<BloomCode, string> = {
  CU: "#3b82f6",
  AP: "#22c55e",
  AS: "#eab308",
  EV: "#ef4444",
  CR: "#a855f7",
};

export const BLOOM_LABELS: Record<BloomCode, string> = {
  CU: "Comprehend / Understand",
  AP: "Apply",
  AS: "Assess / Analyze",
  EV: "Evaluate",
  CR: "Create",
};

export const CRITICALITY_COLORS: Record<Criticality, string> = {
  Critical: "#dc2626",
  Important: "#d97706",
  Baseline: "#64748b",
};

export const CRITICALITY_DESCRIPTIONS: Record<Criticality, string> = {
  Critical: "Score 7+ · must-have, screened hard in selection rounds",
  Important: "Score 5–6 · expected, differentiates strong candidates",
  Baseline: "Score below 5 · good to know, rarely a deciding factor",
};
